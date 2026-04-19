const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Institution = require('../models/Institution');
const StudentPurchase = require('../models/StudentPurchase');
const { fetchInstitutionContext, generateChatResponse } = require('../services/aiService');

const getSelectedInstitution = async (userId) => {
  const purchase = await StudentPurchase.findOne({ userId, status: 'completed' });
  if (!purchase || !purchase.selectedInstitutionId) return null;
  const institution = await Institution.findOne({ _id: purchase.selectedInstitutionId, status: 'active' });
  return institution;
};

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId, institutionId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let institution;
    if (institutionId) {
      institution = await Institution.findOne({ _id: institutionId, status: 'active' });
    } else {
      institution = await getSelectedInstitution(req.user._id);
    }
    if (!institution) {
      return res.status(400).json({ success: false, message: 'No institution selected. Please select an institution first.' });
    }

    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id, institutionId: institution._id });
    }
    if (!session) {
      session = await ChatSession.create({
        userId: req.user._id,
        institutionId: institution._id,
        title: message.substring(0, 60),
      });
    }

    await ChatMessage.create({
      sessionId: session._id,
      institutionId: institution._id,
      userId: req.user._id,
      role: 'user',
      content: message,
    });

    const history = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 }).limit(20).select('role content');

    const institutionContext = await fetchInstitutionContext(institution._id, message);
    const aiResponse = await generateChatResponse(institution.name, institutionContext, history.slice(0, -1), message);

    const aiMessage = await ChatMessage.create({
      sessionId: session._id,
      institutionId: institution._id,
      userId: req.user._id,
      role: 'assistant',
      content: aiResponse,
    });

    session.messageCount += 2;
    session.lastMessageAt = new Date();
    if (session.title === 'New Conversation') {
      session.title = message.substring(0, 60);
    }
    await session.save();

    res.json({ success: true, message: aiMessage, sessionId: session._id, institutionName: institution.name });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, message: 'Failed to process your message. Please try again.' });
  }
};

const getSessions = async (req, res) => {
  try {
    const { institutionId } = req.query;
    const filter = { userId: req.user._id };
    if (institutionId) filter.institutionId = institutionId;
    const sessions = await ChatSession.find(filter)
      .sort({ lastMessageAt: -1 }).limit(50)
      .populate('institutionId', 'name logo');
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('institutionId', 'name logo shortDescription');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
    res.json({ success: true, session, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createSession = async (req, res) => {
  try {
    const { institutionId } = req.body;
    const institution = await Institution.findOne({ _id: institutionId, status: 'active' });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }
    const session = await ChatSession.create({
      userId: req.user._id,
      institutionId,
      title: 'New Conversation',
    });
    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    await ChatMessage.deleteMany({ sessionId: req.params.id });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, getSessions, getSession, createSession, deleteSession };

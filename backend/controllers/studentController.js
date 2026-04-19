const StudentPurchase = require('../models/StudentPurchase');
const Institution = require('../models/Institution');
const Notice = require('../models/Notice');
const Course = require('../models/Course');
const PlacementRecord = require('../models/PlacementRecord');
const ChatSession = require('../models/ChatSession');

const purchaseAccess = async (req, res) => {
  try {
    const existing = await StudentPurchase.findOne({ userId: req.user._id });
    if (existing && existing.status === 'completed') {
      return res.status(409).json({ success: false, message: 'You have already purchased access' });
    }
    const { transactionId, amount, paymentMethod } = req.body;
    const purchase = await StudentPurchase.create({
      userId: req.user._id,
      amount: amount || 999,
      transactionId: transactionId || `TXN_${Date.now()}`,
      paymentMethod: paymentMethod || 'card',
      status: 'completed',
    });
    res.status(201).json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAccessStatus = async (req, res) => {
  try {
    const purchase = await StudentPurchase.findOne({ userId: req.user._id, status: 'completed' });
    res.json({ success: true, hasAccess: !!purchase, purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const selectInstitution = async (req, res) => {
  try {
    const { institutionId } = req.body;
    const institution = await Institution.findOne({ _id: institutionId, status: 'active' });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found or inactive' });
    }
    const purchase = await StudentPurchase.findOne({ userId: req.user._id, status: 'completed' });
    if (!purchase) {
      return res.status(403).json({ success: false, message: 'Purchase access required' });
    }
    purchase.selectedInstitutionId = institutionId;
    await purchase.save();
    res.json({ success: true, institution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const purchase = await StudentPurchase.findOne({ userId: req.user._id, status: 'completed' });
    if (!purchase || !purchase.selectedInstitutionId) {
      return res.status(400).json({ success: false, message: 'No institution selected' });
    }
    const institutionId = purchase.selectedInstitutionId;
    const [institution, notices, courses, placements, recentChats] = await Promise.all([
      Institution.findById(institutionId).select('-adminId'),
      Notice.find({ institutionId, isActive: true }).sort({ isPinned: -1, publishedAt: -1 }).limit(5),
      Course.find({ institutionId, isActive: true }).select('name level duration fees').limit(6),
      PlacementRecord.findOne({ institutionId }).sort({ year: -1 }),
      ChatSession.find({ userId: req.user._id, institutionId }).sort({ lastMessageAt: -1 }).limit(5),
    ]);
    res.json({ success: true, institution, notices, courses, placements, recentChats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNotices = async (req, res) => {
  try {
    const purchase = await StudentPurchase.findOne({ userId: req.user._id, status: 'completed' });
    if (!purchase || !purchase.selectedInstitutionId) {
      return res.status(400).json({ success: false, message: 'No institution selected' });
    }
    const notices = await Notice.find({ institutionId: purchase.selectedInstitutionId, isActive: true })
      .sort({ isPinned: -1, publishedAt: -1 });
    res.json({ success: true, notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { purchaseAccess, getAccessStatus, selectInstitution, getDashboard, getNotices };

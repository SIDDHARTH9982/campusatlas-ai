const User = require('../models/User');
const Institution = require('../models/Institution');
const StudentPurchase = require('../models/StudentPurchase');
const ChatSession = require('../models/ChatSession');

const getInstitutions = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.name = new RegExp(search, 'i');
    const institutions = await Institution.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, institutions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createInstitution = async (req, res) => {
  try {
    const { adminEmail, adminName, adminPassword, ...institutionData } = req.body;
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Admin email already registered' });
    }
    const institution = await Institution.create({ ...institutionData, status: 'active' });
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword || 'campus@123',
      role: 'institutionAdmin',
      institutionId: institution._id,
    });
    institution.adminId = admin._id;
    await institution.save();
    res.status(201).json({ success: true, institution, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!institution) return res.status(404).json({ success: false, message: 'Institution not found' });
    res.json({ success: true, institution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateInstitutionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const institution = await Institution.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!institution) return res.status(404).json({ success: false, message: 'Institution not found' });
    res.json({ success: true, institution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const [totalInstitutions, activeInstitutions, totalStudents, totalPurchases, totalChats] = await Promise.all([
      Institution.countDocuments(),
      Institution.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'student' }),
      StudentPurchase.countDocuments({ status: 'completed' }),
      ChatSession.countDocuments(),
    ]);
    const recentInstitutions = await Institution.find().sort({ createdAt: -1 }).limit(5).select('name status type location createdAt');
    const recentPurchases = await StudentPurchase.find({ status: 'completed' })
      .sort({ createdAt: -1 }).limit(10)
      .populate('userId', 'name email');

    const revenue = totalPurchases * 999;

    res.json({
      success: true,
      stats: { totalInstitutions, activeInstitutions, totalStudents, totalPurchases, totalChats, revenue },
      recentInstitutions,
      recentPurchases,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentPurchases = async (req, res) => {
  try {
    const purchases = await StudentPurchase.find().sort({ createdAt: -1 }).populate('userId', 'name email').populate('selectedInstitutionId', 'name');
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password').populate('institutionId', 'name');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getInstitutions, createInstitution, updateInstitution, updateInstitutionStatus,
  getAnalytics, getStudents, getStudentPurchases, getUsers, updateUser,
};

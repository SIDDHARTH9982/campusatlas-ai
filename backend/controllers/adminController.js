const Institution = require('../models/Institution');
const Course = require('../models/Course');
const Department = require('../models/Department');
const FeeStructure = require('../models/FeeStructure');
const Scholarship = require('../models/Scholarship');
const HostelInfo = require('../models/HostelInfo');
const PlacementRecord = require('../models/PlacementRecord');
const Notice = require('../models/Notice');
const FAQ = require('../models/FAQ');
const KnowledgeEntry = require('../models/KnowledgeEntry');
const ContactInfo = require('../models/ContactInfo');
const TransportInfo = require('../models/TransportInfo');
const LibraryInfo = require('../models/LibraryInfo');
const ChatSession = require('../models/ChatSession');

const getInstitutionId = (req) => req.user.institutionId;

const getOverview = async (req, res) => {
  try {
    const institutionId = getInstitutionId(req);
    const [institution, courseCount, noticeCount, faqCount, sessionCount] = await Promise.all([
      Institution.findById(institutionId),
      Course.countDocuments({ institutionId }),
      Notice.countDocuments({ institutionId, isActive: true }),
      FAQ.countDocuments({ institutionId }),
      ChatSession.countDocuments({ institutionId }),
    ]);
    res.json({ success: true, institution, stats: { courseCount, noticeCount, faqCount, sessionCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const institution = await Institution.findById(getInstitutionId(req));
    res.json({ success: true, institution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      getInstitutionId(req),
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json({ success: true, institution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCRUD = (Model) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find({ institutionId: getInstitutionId(req) }).sort({ createdAt: -1 });
      res.json({ success: true, data: items });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getOne: async (req, res) => {
    try {
      const item = await Model.findOne({ _id: req.params.id, institutionId: getInstitutionId(req) });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const item = await Model.create({ ...req.body, institutionId: getInstitutionId(req) });
      res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, institutionId: getInstitutionId(req) },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  delete: async (req, res) => {
    try {
      const item = await Model.findOneAndDelete({ _id: req.params.id, institutionId: getInstitutionId(req) });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
});

const courseCRUD = createCRUD(Course);
const deptCRUD = createCRUD(Department);
const feeCRUD = createCRUD(FeeStructure);
const scholarshipCRUD = createCRUD(Scholarship);
const hostelCRUD = createCRUD(HostelInfo);
const placementCRUD = createCRUD(PlacementRecord);
const noticeCRUD = createCRUD(Notice);
const faqCRUD = createCRUD(FAQ);
const knowledgeCRUD = createCRUD(KnowledgeEntry);
const contactCRUD = createCRUD(ContactInfo);
const transportCRUD = createCRUD(TransportInfo);
const libraryCRUD = createCRUD(LibraryInfo);

module.exports = {
  getOverview, getProfile, updateProfile,
  courseCRUD, deptCRUD, feeCRUD, scholarshipCRUD, hostelCRUD,
  placementCRUD, noticeCRUD, faqCRUD, knowledgeCRUD,
  contactCRUD, transportCRUD, libraryCRUD,
};

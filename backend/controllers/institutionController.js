const Institution = require('../models/Institution');
const Notice = require('../models/Notice');
const Course = require('../models/Course');

const getActiveInstitutions = async (req, res) => {
  try {
    const { search, type, city } = req.query;
    const filter = { status: 'active' };
    if (type) filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
        { shortDescription: new RegExp(search, 'i') },
      ];
    }
    const institutions = await Institution.find(filter).select('-adminId -subscriptionPlan').sort({ name: 1 });
    res.json({ success: true, institutions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getInstitutionById = async (req, res) => {
  try {
    const institution = await Institution.findOne({ _id: req.params.id, status: 'active' }).select('-adminId');
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }
    const recentNotices = await Notice.find({ institutionId: institution._id, isActive: true })
      .sort({ publishedAt: -1 }).limit(5);
    const courses = await Course.find({ institutionId: institution._id, isActive: true })
      .select('name level duration').limit(10);
    res.json({ success: true, institution, recentNotices, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActiveInstitutions, getInstitutionById };

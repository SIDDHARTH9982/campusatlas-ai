const mongoose = require('mongoose');

const placementRecordSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  year: { type: Number, required: true },
  totalStudentsPlaced: { type: Number, default: 0 },
  totalStudentsEligible: { type: Number, default: 0 },
  highestPackage: { type: Number, default: 0 },
  averagePackage: { type: Number, default: 0 },
  lowestPackage: { type: Number, default: 0 },
  topRecruiters: [{ type: String }],
  placementRate: { type: Number, default: 0 },
  courseWise: [{
    courseName: String,
    placed: Number,
    avgPackage: Number,
  }],
  notableAlumni: [{
    name: String,
    company: String,
    role: String,
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

placementRecordSchema.index({ institutionId: 1, year: -1 });

module.exports = mongoose.model('PlacementRecord', placementRecordSchema);

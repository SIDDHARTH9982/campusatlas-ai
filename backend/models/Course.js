const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  name: { type: String, required: true },
  code: { type: String },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  level: { type: String, enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate', 'phd', 'school'], required: true },
  duration: { type: String },
  totalSeats: { type: Number, default: 0 },
  description: { type: String, default: '' },
  eligibility: { type: String, default: '' },
  syllabus: { type: String, default: '' },
  mode: { type: String, enum: ['full-time', 'part-time', 'online', 'distance'], default: 'full-time' },
  fees: { type: Number, default: 0 },
  specializations: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

courseSchema.index({ institutionId: 1 });

module.exports = mongoose.model('Course', courseSchema);

const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  courseName: { type: String },
  tuitionFee: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  examFee: { type: Number, default: 0 },
  libraryFee: { type: Number, default: 0 },
  sportsFee: { type: Number, default: 0 },
  otherFees: [{ name: String, amount: Number }],
  totalFee: { type: Number, default: 0 },
  perSemester: { type: Boolean, default: false },
  academicYear: { type: String },
  notes: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

feeStructureSchema.index({ institutionId: 1 });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);

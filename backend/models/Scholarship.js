const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['merit', 'need-based', 'government', 'sports', 'sc-st', 'minority', 'other'], default: 'other' },
  amount: { type: Number, default: 0 },
  coverage: { type: String, default: '' },
  eligibility: { type: String, default: '' },
  howToApply: { type: String, default: '' },
  deadline: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

scholarshipSchema.index({ institutionId: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);

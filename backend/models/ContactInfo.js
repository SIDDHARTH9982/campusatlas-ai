const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  type: { type: String, enum: ['faculty', 'department', 'office', 'helpdesk'], default: 'office' },
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  officeLocation: { type: String, default: '' },
  officeHours: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

contactInfoSchema.index({ institutionId: 1 });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);

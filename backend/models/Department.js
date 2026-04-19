const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  name: { type: String, required: true },
  code: { type: String },
  head: { type: String, default: '' },
  description: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  established: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

departmentSchema.index({ institutionId: 1 });

module.exports = mongoose.model('Department', departmentSchema);

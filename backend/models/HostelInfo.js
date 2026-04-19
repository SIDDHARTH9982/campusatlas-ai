const mongoose = require('mongoose');

const hostelInfoSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['boys', 'girls', 'coed'], required: true },
  totalRooms: { type: Number, default: 0 },
  totalCapacity: { type: Number, default: 0 },
  roomTypes: [{ type: String, capacity: Number, feePerYear: Number }],
  feePerYear: { type: Number, default: 0 },
  messAvailable: { type: Boolean, default: true },
  messFeePerYear: { type: Number, default: 0 },
  facilities: [{ type: String }],
  warden: { type: String, default: '' },
  contact: { type: String, default: '' },
  address: { type: String, default: '' },
  rules: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

hostelInfoSchema.index({ institutionId: 1 });

module.exports = mongoose.model('HostelInfo', hostelInfoSchema);

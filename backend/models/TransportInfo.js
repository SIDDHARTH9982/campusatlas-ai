const mongoose = require('mongoose');

const transportInfoSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  routeName: { type: String, required: true },
  routeNumber: { type: String },
  stops: [{ name: String, time: String }],
  feePerYear: { type: Number, default: 0 },
  vehicleType: { type: String, default: 'Bus' },
  contact: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

transportInfoSchema.index({ institutionId: 1 });

module.exports = mongoose.model('TransportInfo', transportInfoSchema);

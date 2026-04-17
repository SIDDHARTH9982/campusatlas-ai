const mongoose = require('mongoose');

const libraryInfoSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  name: { type: String, default: 'Central Library' },
  totalBooks: { type: Number, default: 0 },
  totalJournals: { type: Number, default: 0 },
  totalEResources: { type: Number, default: 0 },
  openingHours: { type: String, default: '' },
  location: { type: String, default: '' },
  contact: { type: String, default: '' },
  facilities: [{ type: String }],
  membershipFee: { type: Number, default: 0 },
  rules: { type: String, default: '' },
  digitalAccess: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

libraryInfoSchema.index({ institutionId: 1 });

module.exports = mongoose.model('LibraryInfo', libraryInfoSchema);

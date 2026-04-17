const mongoose = require('mongoose');

const studentPurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: 'card' },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  purchasedAt: { type: Date, default: Date.now },
  selectedInstitutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', default: null },
}, { timestamps: true });

module.exports = mongoose.model('StudentPurchase', studentPurchaseSchema);

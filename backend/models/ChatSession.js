const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  title: { type: String, default: 'New Conversation' },
  isActive: { type: Boolean, default: true },
  messageCount: { type: Number, default: 0 },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

chatSessionSchema.index({ userId: 1, institutionId: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);

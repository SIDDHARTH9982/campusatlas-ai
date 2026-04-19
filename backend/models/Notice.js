const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['academic', 'administrative', 'event', 'holiday', 'general', 'exam', 'admission'], default: 'general' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  publishedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

noticeSchema.index({ institutionId: 1, publishedAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);

const mongoose = require('mongoose');

const knowledgeEntrySchema = new mongoose.Schema({
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  category: {
    type: String,
    enum: ['admissions', 'fees', 'courses', 'departments', 'hostel', 'placements', 'scholarships',
      'transport', 'library', 'exams', 'internships', 'events', 'faculty', 'general'],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

knowledgeEntrySchema.index({ institutionId: 1, category: 1 });

module.exports = mongoose.model('KnowledgeEntry', knowledgeEntrySchema);

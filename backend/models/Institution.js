const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  type: { type: String, enum: ['school', 'college', 'university', 'institute'], required: true },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
  },
  logo: { type: String, default: null },
  coverImage: { type: String, default: null },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  website: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  established: { type: Number, default: null },
  accreditation: [{ type: String }],
  affiliatedTo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'active', 'inactive', 'suspended'], default: 'pending' },
  subscriptionPlan: { type: String, enum: ['starter', 'growth', 'enterprise'], default: 'starter' },
  subscriptionStatus: { type: String, enum: ['active', 'trial', 'expired', 'cancelled'], default: 'trial' },
  subscriptionExpiry: { type: Date, default: null },
  totalStudents: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tags: [{ type: String }],
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  admissionsOpen: { type: Boolean, default: false },
}, { timestamps: true });

institutionSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Institution', institutionSchema);

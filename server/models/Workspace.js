const mongoose = require('mongoose');
const slugify = require('slugify');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true }, // Identificador na URL
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logo: { type: String, default: '' }, // URL ou Emoji
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member', 'guest'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Middleware para gerar slug automaticamente antes de salvar
workspaceSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Workspace', workspaceSchema);

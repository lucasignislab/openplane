const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    identifier: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        maxlength: 5
    }, // Ex: "FRONT", "API" (O prefixo da Issue)
    description: { type: String },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tech Lead
    icon: { type: String, default: '📊' }, // Emoji padrão
}, { timestamps: true });

// Garante que o identificador seja único DENTRO do Workspace (não globalmente)
projectSchema.index({ workspace: 1, identifier: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);

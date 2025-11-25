const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' }, // HTML do Editor Tiptap

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },

    // O ID Mágico (1, 2, 3...)
    sequenceId: { type: Number },

    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    priority: {
        type: String,
        enum: ['urgent', 'high', 'medium', 'low', 'none'],
        default: 'none'
    },

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date },
}, { timestamps: true });

// Index composto para garantir performance nas buscas por projeto
issueSchema.index({ project: 1, sequenceId: 1 });

// Lógica de Auto-Incremento Atômico
issueSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const project = this.project;

    // Encontra a última issue criada NESTE projeto
    const lastIssue = await this.constructor.findOne({ project }, 'sequenceId')
        .sort({ sequenceId: -1 }); // Ordena decrescente

    // Se houver última, soma 1. Se não, começa do 1.
    this.sequenceId = lastIssue ? lastIssue.sequenceId + 1 : 1;

    next();
});

module.exports = mongoose.model('Issue', issueSchema);

const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para determinar o status do ciclo dinamicamente
cycleSchema.virtual('status').get(function () {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (now >= start && now <= end) return 'current';
    if (now < start) return 'upcoming';
    return 'completed';
});

module.exports = mongoose.model('Cycle', cycleSchema);

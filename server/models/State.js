const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Ex: "Code Review", "QA", "Deploying"
    color: { type: String, default: '#858e96' }, // Para a bolinha colorida na UI
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    // O grupo define o comportamento (ex: "Completed" risca a tarefa, "Backlog" esconde)
    group: {
        type: String,
        enum: ['backlog', 'unstarted', 'started', 'completed', 'cancelled'],
        required: true
    },

    sequence: { type: Number, required: true } // Ordem da coluna no Kanban (1, 2, 3...)
});

module.exports = mongoose.model('State', stateSchema);

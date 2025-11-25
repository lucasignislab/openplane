const State = require('../models/State');

// @desc    Listar Estados de um Projeto
// @route   GET /api/v1/states?projectId=xyz
// @access  Private
exports.getStates = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ success: false, message: 'Project ID é obrigatório' });
        }

        const states = await State.find({ project: projectId })
            .sort({ sequence: 1 });

        res.status(200).json({ success: true, count: states.length, data: states });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

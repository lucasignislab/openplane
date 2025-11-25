const Cycle = require('../models/Cycle');
const Issue = require('../models/Issue');

// @desc    Criar Ciclo
// @route   POST /api/v1/cycles
exports.createCycle = async (req, res) => {
    try {
        const { name, startDate, endDate, projectId, description } = req.body;

        // (Opcional: Validar se as datas não se sobrepõem a outro ciclo, se desejar essa regra)

        const cycle = await Cycle.create({
            name,
            description,
            startDate,
            endDate,
            projectId,
            workspaceId: req.user.workspaceId, // Assumindo que passamos isso ou buscamos do projeto
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: cycle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Listar Ciclos de um Projeto
// @route   GET /api/v1/cycles?projectId=xyz
exports.getCycles = async (req, res) => {
    try {
        const { projectId } = req.query;
        const cycles = await Cycle.find({ projectId }).sort({ startDate: 1 });

        // Calcular o progresso de cada ciclo (issues concluídas vs total)
        // Para um MVP rápido, retornamos apenas os ciclos, o cálculo pode ser feito no frontend ou agregação complexa aqui.

        res.status(200).json({ success: true, data: cycles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Obter detalhes de um Ciclo (incluindo estatísticas)
// @route   GET /api/v1/cycles/:id
exports.getCycleDetails = async (req, res) => {
    try {
        const cycle = await Cycle.findById(req.params.id);
        if (!cycle) return res.status(404).json({ success: false, message: 'Ciclo não encontrado' });

        // Buscar issues deste ciclo
        const issues = await Issue.find({ cycleId: cycle._id })
            .populate('state')
            .populate('assignees', 'name profilePicture');

        res.status(200).json({ success: true, data: { ...cycle.toObject(), issues } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const User = require('../models/User');
const Issue = require('../models/Issue');
const Project = require('../models/Project');

// @desc    Obter Issues atribuídas ao usuário logado (Cross-Project)
// @route   GET /api/v1/users/me/issues
// @access  Private
exports.getMyIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ assignees: req.user.id })
            .populate('project', 'name identifier icon') // Precisamos saber de qual projeto é
            .populate('state')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: issues.length, data: issues });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Obter estatísticas do Dashboard do Usuário
// @route   GET /api/v1/users/me/dashboard
// @access  Private
exports.getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Contagem de Issues por Estado (Simplificado)
        const assignedIssues = await Issue.countDocuments({ assignees: userId });
        const createdIssues = await Issue.countDocuments({ createdBy: userId }); // Assumindo que temos createdBy no Schema

        // 2. Projetos Recentes (Onde sou membro)
        // Nota: Mongoose não tem "recentemente acessado" nativo sem log de atividade, 
        // então vamos pegar os últimos criados onde sou membro.
        // Idealmente, usaríamos a tabela ActivityLog para saber onde o user clicou por último.
        const recentProjects = await Project.find({ 'members.user': userId }) // Precisa ajustar se a lógica de membros for diferente
            .sort({ updatedAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    assigned: assignedIssues,
                    created: createdIssues,
                    pending: assignedIssues // Simplificação: Assumir tudo como pendente por enquanto
                },
                recentProjects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

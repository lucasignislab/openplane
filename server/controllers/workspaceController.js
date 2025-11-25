const Workspace = require('../models/Workspace');

// @desc    Criar novo Workspace
// @route   POST /api/v1/workspaces
// @access  Private
exports.createWorkspace = async (req, res) => {
    try {
        // O slug é gerado automaticamente pelo Mongoose middleware (veja o Model)
        const workspace = await Workspace.create({
            name: req.body.name,
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'admin' }] // O dono é o primeiro membro
        });

        res.status(201).json({ success: true, data: workspace });
    } catch (error) {
        // Tratamento para erro de duplicidade de nome/slug
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Já existe um workspace com este nome.' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Listar Workspaces do Usuário Logado
// @route   GET /api/v1/workspaces
// @access  Private
exports.getMyWorkspaces = async (req, res) => {
    try {
        // Busca workspaces onde o array 'members' contém o ID do usuário
        const workspaces = await Workspace.find({
            'members.user': req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: workspaces.length, data: workspaces });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Obter Workspace único pelo Slug (usado na URL)
// @route   GET /api/v1/workspaces/:slug
// @access  Private
exports.getWorkspaceBySlug = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ slug: req.params.slug })
            .populate('members.user', 'name email profilePicture'); // Traz detalhes dos membros

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace não encontrado' });
        }

        // Verificação de segurança: O usuário é membro?
        const isMember = workspace.members.some(member => {
            const memberId = member.user._id || member.user;
            return memberId.toString() === req.user.id;
        });
        if (!isMember) {
            return res.status(403).json({ success: false, message: 'Acesso negado a este workspace' });
        }

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const Workspace = require('../models/Workspace');
const User = require('../models/User');

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

// @desc    Atualizar Workspace (Nome/Logo)
// @route   PATCH /api/v1/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res) => {
    try {
        let workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace não encontrado' });
        }

        // Verificar se o usuário é Admin do workspace
        const member = workspace.members.find(m => m.user.toString() === req.user.id);
        if (!member || member.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Apenas admins podem editar o workspace' });
        }

        workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Convidar Membro (Adicionar por Email)
// @route   POST /api/v1/workspaces/:id/members
// @access  Private
exports.inviteMember = async (req, res) => {
    try {
        const { email, role } = req.body;
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace não encontrado' });
        }

        // 1. Validações de Permissão
        const requestingMember = workspace.members.find(m => m.user.toString() === req.user.id);
        if (!requestingMember || requestingMember.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Sem permissão para convidar' });
        }

        // 2. Encontrar usuário a ser convidado
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado no sistema. Peça para ele criar uma conta primeiro.' });
        }

        // 3. Verificar se já é membro
        const isAlreadyMember = workspace.members.some(m => m.user.toString() === userToInvite._id.toString());
        if (isAlreadyMember) {
            return res.status(400).json({ success: false, message: 'Usuário já é membro deste workspace' });
        }

        // 4. Adicionar
        workspace.members.push({
            user: userToInvite._id,
            role: role || 'member'
        });

        await workspace.save();

        // Popula para retorno visual imediato
        const updatedWorkspace = await Workspace.findById(req.params.id).populate('members.user', 'name email profilePicture');

        res.status(200).json({ success: true, data: updatedWorkspace.members });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Remover Membro
// @route   DELETE /api/v1/workspaces/:id/members/:userId
// @access  Private
exports.removeMember = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        const memberToRemoveId = req.params.userId;

        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace não encontrado' });
        }

        // Validações de permissão
        const requestingMember = workspace.members.find(m => m.user.toString() === req.user.id);

        // Admin pode remover qualquer um, ou o próprio usuário pode sair
        const isAdmin = requestingMember && requestingMember.role === 'admin';
        const isSelf = req.user.id === memberToRemoveId;

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ success: false, message: 'Sem permissão para remover este membro' });
        }

        // Filtrar array removendo o usuário
        workspace.members = workspace.members.filter(m => m.user.toString() !== memberToRemoveId);

        await workspace.save();

        // Retornar lista atualizada
        const updatedWorkspace = await Workspace.findById(req.params.id).populate('members.user', 'name email profilePicture');
        res.status(200).json({ success: true, data: updatedWorkspace.members });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

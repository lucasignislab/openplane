const Project = require('../models/Project');
const State = require('../models/State');
const Workspace = require('../models/Workspace');

// @desc    Criar Projeto (e gerar Estados Padrão)
// @route   POST /api/v1/projects
// @access  Private
exports.createProject = async (req, res) => {
    const { name, identifier, description, workspaceId } = req.body;

    try {
        // 1. Verificar se o Workspace existe e se usuário é membro
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace não encontrado' });
        }

        // (Opcional: Adicionar verificação se user é admin do workspace aqui)

        // 2. Criar o Projeto
        const project = await Project.create({
            name,
            identifier: identifier.toUpperCase(), // Ex: "FRONT"
            description,
            workspace: workspaceId,
            lead: req.user.id
        });

        // 3. A MÁGICA: Criar Estados Padrão para o Kanban
        const defaultStates = [
            { name: 'Backlog', color: '#87909e', group: 'backlog', sequence: 1 },
            { name: 'Todo', color: '#e4e5e7', group: 'unstarted', sequence: 2 },
            { name: 'In Progress', color: '#f59e0b', group: 'started', sequence: 3 },
            { name: 'Done', color: '#16a34a', group: 'completed', sequence: 4 },
            { name: 'Canceled', color: '#ef4444', group: 'cancelled', sequence: 5 }
        ];

        // Adiciona o ID do projeto a cada estado e cria no banco
        const statePromises = defaultStates.map(state =>
            State.create({ ...state, project: project._id })
        );
        await Promise.all(statePromises);

        res.status(201).json({ success: true, data: project, message: 'Projeto e Estados criados com sucesso' });

    } catch (error) {
        // Erro de identificador duplicado
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Identificador já existe neste workspace.' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Listar Projetos de um Workspace
// @route   GET /api/v1/projects?workspaceId=xyz
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const { workspaceId } = req.query;

        if (!workspaceId) {
            return res.status(400).json({ success: false, message: 'Workspace ID é obrigatório' });
        }

        const projects = await Project.find({ workspace: workspaceId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Listar Estados de um Projeto
// @route   GET /api/v1/projects/:id/states
// @access  Private
exports.getProjectStates = async (req, res) => {
  try {
    const states = await State.find({ project: req.params.id }).sort({ sequence: 1 });
    res.status(200).json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

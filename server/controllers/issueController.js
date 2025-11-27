const Issue = require('../models/Issue');
const Project = require('../models/Project');
const State = require('../models/State');
const Comment = require('../models/Comment');

// @desc    Criar uma nova Issue
// @route   POST /api/v1/issues
// @access  Private
exports.createIssue = async (req, res) => {
    try {
        const { title, description, priority, assignees, dueDate, projectId, stateId, cycleId } = req.body;

        // 1. Validar se o Projeto existe
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
        }

        let targetStateId = stateId;

        // 2. Lógica do "Estado Padrão" (Vital para UX do Plane)
        // Se o frontend não mandar um stateId, buscamos o estado 'backlog' deste projeto
        if (!targetStateId) {
            const defaultState = await State.findOne({
                project: projectId,
                group: 'backlog' // Procura pelo grupo Backlog
            }).sort({ sequence: 1 }); // Pega o primeiro da fila

            if (defaultState) {
                targetStateId = defaultState._id;
            } else {
                // Fallback: Se não achar backlog, pega qualquer um (ex: Todo)
                const anyState = await State.findOne({ project: projectId });
                targetStateId = anyState?._id;
            }
        }

        // 3. Criar a Issue
        // O sequenceId será gerado automaticamente pelo Model aqui
        const issue = await Issue.create({
            title,
            description,
            priority: priority || 'none',
            project: projectId,
            workspace: project.workspace, // Herda o workspace do projeto
            state: targetStateId,
            assignees,
            cycleId, // <--- Adicionar aqui! (Se for undefined, o Mongoose ignora ou salva null, o que é ok)
            dueDate
        });

        // Popula os dados para retorno imediato na UI
        const populatedIssue = await Issue.findById(issue._id)
            .populate('state', 'name color group')
            .populate('assignees', 'name profilePicture');

        res.status(201).json({
            success: true,
            data: populatedIssue,
            // Retornamos o identificador completo para o frontend exibir (ex: "FRONT-1")
            identifier: `${project.identifier}-${issue.sequenceId}`
        });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Listar Issues de um Projeto (Com filtros básicos)
// @route   GET /api/v1/issues?projectId=xyz
// @access  Private
exports.getIssues = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ success: false, message: 'Project ID é obrigatório' });
        }

        const issues = await Issue.find({ project: projectId })
            .populate('state') // Traz a cor e nome do estado
            .populate('assignees', 'name profilePicture')
            .sort({ createdAt: -1 }); // Mais recentes primeiro

        res.status(200).json({ success: true, count: issues.length, data: issues });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Obter Issue Única por ID
// @route   GET /api/v1/issues/:id
exports.getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('state')
            .populate('assignees', 'name profilePicture');

        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue não encontrada' });
        }

        res.status(200).json({ success: true, data: issue });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Listar Comentários de uma Issue
// @route   GET /api/v1/issues/:id/comments
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ issue: req.params.id })
            .populate('author', 'name profilePicture')
            .sort({ createdAt: 1 }); // Mais antigos primeiro

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Adicionar Comentário
// @route   POST /api/v1/issues/:id/comments
exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            text: req.body.text,
            issue: req.params.id,
            author: req.user.id
        });

        // Populate para retorno imediato
        await comment.populate('author', 'name profilePicture');

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Atualizar Issue
// @route   PUT /api/v1/issues/:id
// @access  Private
exports.updateIssue = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue não encontrada' });
        }

        // Atualizar
        issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('state')
            .populate('assignees', 'name profilePicture');

        res.status(200).json({ success: true, data: issue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Deletar Issue
// @route   DELETE /api/v1/issues/:id
// @access  Private
exports.deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue não encontrada' });
        }

        await issue.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createWorkspace, getMyWorkspaces, getWorkspaceBySlug } = require('../controllers/workspaceController');

const router = express.Router();

// Todas as rotas aqui são protegidas
router.use(protect);

router.route('/')
    .post(createWorkspace)
    .get(getMyWorkspaces);

router.route('/:slug')
    .get(getWorkspaceBySlug);

module.exports = router;

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceBySlug,
    updateWorkspace,
    inviteMember,
    removeMember
} = require('../controllers/workspaceController');

const router = express.Router();

// Todas as rotas aqui são protegidas
router.use(protect);

router.route('/')
    .post(createWorkspace)
    .get(getMyWorkspaces);

router.route('/:slug')
    .get(getWorkspaceBySlug);

router.route('/:id')
    .patch(updateWorkspace);

router.route('/:id/members')
    .post(inviteMember);

router.route('/:id/members/:userId')
    .delete(removeMember);

module.exports = router;

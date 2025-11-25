const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createIssue, getIssues, getIssueById, getComments, addComment } = require('../controllers/issueController');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createIssue)
    .get(getIssues);

router.route('/:id')
    .get(getIssueById);

router.route('/:id/comments')
    .get(getComments)
    .post(addComment);

module.exports = router;

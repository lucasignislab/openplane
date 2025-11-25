const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createProject, getProjects, getProjectStates } = require('../controllers/projectController');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createProject)
    .get(getProjects);

router.route('/:id/states').get(getProjectStates);

module.exports = router;

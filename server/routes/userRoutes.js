const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMyIssues, getUserDashboardStats } = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/me/issues', getMyIssues);
router.get('/me/dashboard', getUserDashboardStats);

module.exports = router;

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMyIssues, getUserDashboardStats, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/me/issues', getMyIssues);
router.get('/me/dashboard', getUserDashboardStats);
router.put('/me', updateProfile);

module.exports = router;

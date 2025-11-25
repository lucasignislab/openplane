const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getStates } = require('../controllers/stateController');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getStates);

module.exports = router;

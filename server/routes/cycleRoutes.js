const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createCycle, getCycles, getCycleDetails } = require('../controllers/cycleController');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createCycle)
    .get(getCycles);

router.route('/:id')
    .get(getCycleDetails);

module.exports = router;

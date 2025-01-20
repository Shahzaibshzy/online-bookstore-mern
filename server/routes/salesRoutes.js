const express = require('express');
const { getSalesOverview } = require('../controller/salesController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', getSalesOverview);

module.exports = router;

const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getUserDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/user', authenticate, getUserDashboard);

module.exports = router;
const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getUserDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/user', authenticate, getUserDashboard);

module.exports = router;

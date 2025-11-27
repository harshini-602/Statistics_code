const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getUserDashboard, getPostAnalytics } = require('../controllers/dashboardController');

const router = express.Router();

// Get user dashboard with statistics
router.get('/user', authenticate, getUserDashboard);

// Get analytics for a specific post
router.get('/post/:postId', authenticate, getPostAnalytics);

module.exports = router;
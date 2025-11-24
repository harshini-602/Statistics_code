const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, logout, getProfile, followUser, unfollowUser, getFollowers, getFollowing, getUserById } = require('../controllers/userController');
// Public user profile (placed after specific routes to avoid route param conflicts)
const { authenticate } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
], login);

router.post('/logout', logout);


router.get('/profile', authenticate, getProfile);

// Follow/unfollow routes
router.post('/:id/follow', authenticate, followUser);
router.post('/:id/unfollow', authenticate, unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

// Public user profile by ID — keep this after specific routes to avoid
// collisions with literal paths like '/profile'
router.get('/:id', getUserById);

module.exports = router;

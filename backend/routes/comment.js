const express = require('express');
const { body } = require('express-validator');
const { getComments, createComment, deleteComment, likeComment } = require('../controllers/commentController');
const { authenticate, authorize } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

const router = express.Router();

router.get('/:postId', getComments);

router.post('/', authenticate, [
  body('postId').notEmpty().withMessage('Post ID is required'),
  body('content').notEmpty().withMessage('Content is required'),
  handleValidation
], createComment);

router.delete('/:id', authenticate, deleteComment);

// Like/unlike a comment
router.post('/:id/like', authenticate, likeComment);

module.exports = router;

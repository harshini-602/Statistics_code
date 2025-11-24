const express = require('express');
const { body } = require('express-validator');

const { getTags, createTag, updateTag, deleteTag } = require('../controllers/tagController');
const { authenticate } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

const router = express.Router();

router.get('/', getTags);

router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Name is required'),
  handleValidation
], createTag);

router.put('/:id', authenticate, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  handleValidation
], updateTag);

router.delete('/:id', authenticate, deleteTag);

module.exports = router;

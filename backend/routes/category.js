const express = require('express');
const { body } = require('express-validator');

const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

const router = express.Router();

router.get('/', getCategories);

router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Name is required'),
  handleValidation
], createCategory);

router.put('/:id', authenticate, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  handleValidation
], updateCategory);

router.delete('/:id', authenticate, deleteCategory);

module.exports = router;

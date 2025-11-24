const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      console.error('createCategory error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

const updateCategory = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('updateCategory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('deleteCategory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

const Tag = require('../models/Tag');

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    console.error('getTags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTag = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { name, description } = req.body;
    const tag = new Tag({ name, description });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Tag name already exists' });
    } else {
      console.error('createTag error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

const updateTag = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { name, description } = req.body;
    const tag = await Tag.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    console.error('updateTag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTag = async (req, res) => {
  if (req.user.role !== 'blogger') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    console.error('deleteTag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTags, createTag, updateTag, deleteTag };

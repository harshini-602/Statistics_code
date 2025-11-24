const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .populate('replies');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, replyTo, postId: bodyPostId } = req.body;
    const postId = req.params.postId || bodyPostId;
    if (!postId) return res.status(400).json({ message: 'Post ID is required' });

    const comment = new Comment({
      postId,
      userId: req.user.id,
      content,
      replies: replyTo ? [replyTo] : []
    });
    await comment.save();
    if (replyTo) {
      await Comment.findByIdAndUpdate(replyTo, { $push: { replies: comment._id } });
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error('createComment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Comment not found or not authorized' });
    }
    comment.content = req.body.content || comment.content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('updateComment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    // Allow any authenticated user to delete comments (registered users have full privileges)
    // Use findByIdAndDelete to avoid relying on the deprecated/removed document.remove()
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    // Clean up any references in other comments' replies arrays
    if (deleted) {
      await Comment.updateMany({ replies: deleted._id }, { $pull: { replies: deleted._id } });
      return res.json({ message: 'Comment deleted' });
    }
    return res.status(500).json({ message: 'Failed to delete comment' });
  } catch (error) {
    console.error('deleteComment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const userId = req.user.id;
    const index = comment.likes.indexOf(userId);
    if (index > -1) {
      comment.likes.splice(index, 1);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('likeComment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment, likeComment };

const Post = require('../models/Post');
const Comment = require('../models/Comment');


// Returns all posts for a user, with like, dislike, comment counts per post and overall stats
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get all posts by user
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    const postIds = posts.map(p => p._id);
    // Get all comments for these posts
    const comments = await Comment.find({ postId: { $in: postIds } });
    // Map postId to comment count
    const commentCountMap = {};
    comments.forEach(c => {
      commentCountMap[c.postId] = (commentCountMap[c.postId] || 0) + 1;
    });

    // Per-post stats
    const postStats = posts.map(post => ({
      _id: post._id,
      title: post.title,
      status: post.status,
      createdAt: post.createdAt,
      likes: post.likes ? post.likes.length : 0,
      dislikes: post.dislikes ? post.dislikes.length : 0,
      comments: commentCountMap[post._id] || 0,
      // Placeholder: random read time between 2-7 min
      readTime: Math.floor(Math.random() * 6) + 2
    }));

    // Overall stats
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);
    const totalDislikes = posts.reduce((sum, p) => sum + (p.dislikes ? p.dislikes.length : 0), 0);
    const totalComments = comments.length;
    const avgReadTime = postStats.length ? Math.round(postStats.reduce((sum, p) => sum + p.readTime, 0) / postStats.length) : 0;

    res.json({
      stats: {
        totalPosts,
        totalLikes,
        totalDislikes,
        totalComments,
        avgReadTime
      },
      posts: postStats
    });
  } catch (error) {
    console.error('getUserDashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserDashboard };

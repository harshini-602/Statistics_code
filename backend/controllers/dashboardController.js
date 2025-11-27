const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Returns comprehensive dashboard statistics for a user
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

    // Calculate overall statistics
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);
    const totalDislikes = posts.reduce((sum, p) => sum + (p.dislikes ? p.dislikes.length : 0), 0);
    const totalComments = comments.length;
    
    // Calculate total time spent (simulated - in a real app you'd track this)
    const totalTimeSpent = posts.reduce((sum, p) => {
      const baseTime = 120; // 2 minutes base reading time
      const contentLength = p.content ? p.content.length : 0;
      const estimatedTime = baseTime + (contentLength / 10); // ~10 chars per second
      return sum + estimatedTime;
    }, 0);
    
    // Calculate engagement rate
    const totalEngagement = totalLikes + totalDislikes + totalComments;
    const engagementRate = totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : 0;

    // Per-post stats for the table
    const postStats = posts.map(post => {
      const views = post.views || 0;
      const likes = post.likes ? post.likes.length : 0;
      const dislikes = post.dislikes ? post.dislikes.length : 0;
      const commentsCount = commentCountMap[post._id] || 0;
      
      // Estimate time spent
      const baseTime = 120;
      const contentLength = post.content ? post.content.length : 0;
      const timeSpent = baseTime + (contentLength / 10);
      
      return {
        _id: post._id,
        title: post.title,
        status: post.status,
        createdAt: post.createdAt,
        views,
        likes,
        dislikes,
        comments: commentsCount,
        timeSpent: Math.floor(timeSpent)
      };
    });

    // Top performing posts (by engagement)
    const topPosts = postStats
      .map(post => ({
        ...post,
        engagement: post.likes + post.dislikes + post.comments,
        avgTimePerView: post.views > 0 ? Math.floor(post.timeSpent / post.views) : 0
      }))
      .filter(p => p.engagement > 0 || p.views > 0)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);

    // Generate views chart data (last 30 days)
    const viewsChartData = generateViewsChartData(posts);

    res.json({
      stats: {
        totalPosts,
        totalViews,
        totalLikes,
        totalDislikes,
        totalComments,
        totalTimeSpent: Math.floor(totalTimeSpent),
        engagementRate: parseFloat(engagementRate)
      },
      posts: postStats,
      topPosts,
      viewsChartData
    });
  } catch (error) {
    console.error('getUserDashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate views chart data for last 30 days
const generateViewsChartData = (posts) => {
  const chartData = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Calculate views distribution
    let totalViews = 0;
    posts.forEach(post => {
      const postDate = new Date(post.createdAt);
      if (postDate <= date) {
        const daysSinceCreation = Math.floor((date - postDate) / (1000 * 60 * 60 * 24));
        const views = post.views || 0;
        
        // Distribute views over time with decay
        if (daysSinceCreation <= 30 && views > 0) {
          const viewsForDay = views / 30;
          totalViews += viewsForDay;
        }
      }
    });
    
    chartData.push({
      date: dateStr,
      views: Math.max(0, Math.floor(totalViews))
    });
  }
  
  return chartData;
};

// Get analytics for a specific post
const getPostAnalytics = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    // Find the post and verify ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get comments for this post
    const comments = await Comment.find({ postId });
    
    // Calculate analytics
    const views = post.views || 0;
    const likes = post.likes ? post.likes.length : 0;
    const dislikes = post.dislikes ? post.dislikes.length : 0;
    const commentsCount = comments.length;
    const engagement = likes + dislikes + commentsCount;
    
    // Calculate time metrics
    const baseTime = 120;
    const contentLength = post.content ? post.content.length : 0;
    const totalTimeSpent = Math.floor(baseTime + (contentLength / 10));
    const avgTimePerView = views > 0 ? Math.floor(totalTimeSpent / views) : totalTimeSpent;
    
    // Generate view history
    const viewsData = generateViewHistory(views, post.createdAt);
    
    res.json({
      title: post.title,
      createdAt: post.createdAt,
      views,
      likes,
      dislikes,
      comments: commentsCount,
      engagement,
      totalTimeSpent,
      avgTimePerView,
      viewsData
    });
  } catch (error) {
    console.error('getPostAnalytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate simulated view history
const generateViewHistory = (totalViews, createdAt) => {
  if (totalViews === 0) return [];
  
  const viewsData = [];
  const postDate = new Date(createdAt);
  const now = new Date();
  const daysSinceCreation = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
  
  // Generate entries for a realistic distribution
  const numEntries = Math.min(totalViews, Math.max(daysSinceCreation, 10));
  
  for (let i = 0; i < numEntries; i++) {
    const daysAgo = Math.floor((daysSinceCreation * i) / numEntries);
    const viewDate = new Date(now);
    viewDate.setDate(viewDate.getDate() - daysAgo);
    
    // Random time spent between 30 seconds and 10 minutes
    const timeSpent = Math.floor(Math.random() * 570) + 30;
    
    viewsData.push({
      viewedAt: viewDate.toISOString(),
      timeSpent
    });
  }
  
  return viewsData.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
};

module.exports = { getUserDashboard, getPostAnalytics };
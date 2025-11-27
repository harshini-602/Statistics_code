import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import axios from '../api/axios';
import { 
  FiEdit2, FiThumbsUp, FiThumbsDown, FiMessageCircle, 
  FiPlusCircle, FiLogOut, FiBarChart2, FiEye, FiTrendingUp,
  FiClock, FiZap 
} from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchFollowers();
      fetchFollowing();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/user');
      setStats(response.data.stats);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setPosts([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`/api/users/${user.id}/followers`);
      setFollowers(res.data);
    } catch {
      setFollowers([]);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`/api/users/${user.id}/following`);
      setFollowing(res.data);
    } catch {
      setFollowing([]);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num || 0;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Hero Card */}
      <div className="relative bg-gradient-to-r from-slate-200 to-emerald-100 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 animate-fade-in mb-10">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-slate-100 shadow-lg flex items-center justify-center overflow-hidden border-4 border-slate-200">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 drop-shadow-lg">{user.username}</h1>
          <p className="text-lg text-slate-600 mb-2">{user.email}</p>
          <div className="flex flex-col md:flex-row gap-4 mt-4 items-center md:items-start justify-center md:justify-start">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-200 text-slate-700 font-semibold shadow hover:bg-slate-300 transition-all duration-200 hover:scale-105"
            >
              <FiLogOut /> Logout
            </button>
            <button
              onClick={() => navigate('/create-post')}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-400 text-white font-semibold shadow hover:bg-emerald-500 transition-all duration-200 hover:scale-105 animate-bounce-slow"
            >
              <FiPlusCircle /> Create Post
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 transition-all duration-200 hover:scale-105"
            >
              <FiBarChart2 /> Full Analytics
            </button>
          </div>
          {/* Followers/Following Section */}
          <div className="flex gap-6 mt-6 justify-center md:justify-start">
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Followers</span>
              <div className="flex flex-wrap gap-2">
                {followers.length === 0 ? (
                  <span className="text-slate-400 text-xs">No followers yet</span>
                ) : (
                  followers.slice(0, 3).map(f => (
                    <span key={f._id} className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">{f.username}</span>
                  ))
                )}
                {followers.length > 3 && (
                  <span className="px-3 py-1 rounded-full bg-slate-300 text-slate-700 text-xs font-semibold">+{followers.length - 3} more</span>
                )}
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Following</span>
              <div className="flex flex-wrap gap-2">
                {following.length === 0 ? (
                  <span className="text-slate-400 text-xs">Not following anyone</span>
                ) : (
                  following.slice(0, 3).map(f => (
                    <span key={f._id} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{f.username}</span>
                  ))
                )}
                {following.length > 3 && (
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-700 text-xs font-semibold">+{following.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {/* Total Views */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Total Views</p>
                <p className="text-3xl font-bold text-blue-900">{formatNumber(stats.totalViews)}</p>
                <p className="text-blue-600 text-xs mt-2 flex items-center gap-1">
                  <FiTrendingUp size={12} /> Across all posts
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <FiEye className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Engagement */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Engagement</p>
                <p className="text-3xl font-bold text-green-900">{formatNumber(stats.totalLikes + stats.totalDislikes + stats.totalComments)}</p>
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                  <FiZap size={12} /> {stats.engagementRate}% rate
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <FiThumbsUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Avg Time */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Avg Time</p>
                <p className="text-3xl font-bold text-purple-900">{formatTime(stats.totalTimeSpent / stats.totalPosts)}</p>
                <p className="text-purple-600 text-xs mt-2 flex items-center gap-1">
                  <FiClock size={12} /> Per article
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-lg">
                <FiClock className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* Total Comments */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium mb-1">Comments</p>
                <p className="text-3xl font-bold text-orange-900">{formatNumber(stats.totalComments)}</p>
                <p className="text-orange-600 text-xs mt-2 flex items-center gap-1">
                  <FiMessageCircle size={12} /> Reader feedback
                </p>
              </div>
              <div className="bg-orange-200 p-3 rounded-lg">
                <FiMessageCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-slate-50 rounded-2xl shadow-lg p-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-slate-700 flex items-center gap-2">
          <span>Your Posts</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">{posts.length}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-emerald-50 text-slate-700">
                <th className="py-3 px-4 text-left font-semibold">Title</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Views</th>
                <th className="py-3 px-4 text-center font-semibold">Likes</th>
                <th className="py-3 px-4 text-center font-semibold">Dislikes</th>
                <th className="py-3 px-4 text-center font-semibold">Comments</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr
                  key={post._id}
                  className="border-b last:border-b-0 hover:bg-blue-50/60 transition group"
                >
                  <td className="py-3 px-4 font-semibold max-w-xs">
                    <span
                      className="text-emerald-700 hover:underline cursor-pointer transition group-hover:text-emerald-500 line-clamp-2"
                      onClick={() => navigate(`/posts/${post._id}`)}
                    >
                      {post.title}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-blue-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <FiEye size={14} />{formatNumber(post.views)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <FiThumbsUp size={14} />{post.likes}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-rose-500 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <FiThumbsDown size={14} />{post.dislikes}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <FiMessageCircle size={14} />{post.comments}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 shadow transition-all duration-150 hover:scale-110"
                        title="Edit Post"
                        onClick={() => navigate(`/edit/${post._id}`)}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 shadow transition-all duration-150 hover:scale-110"
                        title="View Analytics"
                        onClick={() => navigate(`/posts/${post._id}/analytics`)}
                      >
                        <FiBarChart2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="text-center text-slate-400 py-8 text-lg">
            <FiPlusCircle className="mx-auto mb-4" size={48} />
            No posts yet. Start by creating your first post!
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s ease; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease; animation-delay: 0.2s; animation-fill-mode: both; }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        .line-clamp-2 { 
          display: -webkit-box; 
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical; 
          overflow: hidden; 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px);} 
          to { opacity: 1; transform: none; } 
        }
        @keyframes bounce { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-8px); } 
        }
      `}</style>
    </div>
  );
};

export default Profile;
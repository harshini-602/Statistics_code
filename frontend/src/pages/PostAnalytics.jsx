import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Loader from '../components/Loader';
import Card from '../components/Card';
import { FiEye, FiThumbsUp, FiThumbsDown, FiMessageCircle, FiClock, FiArrowLeft } from 'react-icons/fi';

const PostAnalytics = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/dashboard/post/${postId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error loading post analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [postId]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  if (loading) return <Loader />;

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analytics not found</h2>
          <p className="text-slate-600 mb-6">Unable to load post analytics.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-900 text-white rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{analytics.title}</h1>
          <p className="text-slate-600">
            Published on {new Date(analytics.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Views */}
          <Card className="p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.views}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiEye className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Total Likes */}
          <Card className="p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.likes}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FiThumbsUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Total Dislikes */}
          <Card className="p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Dislikes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.dislikes}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <FiThumbsDown className="text-red-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Total Comments */}
          <Card className="p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Comments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.comments}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FiMessageCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Avg Time Per View */}
          <Card className="p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Time Per View</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatTime(analytics.avgTimePerView)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiClock className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Time Spent</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{formatTime(analytics.totalTimeSpent)}</p>
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">All viewers combined</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Engagement Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {analytics.views > 0 ? Math.round((analytics.engagement / analytics.views) * 100) : 0}%
            </p>
            <div className="mt-4 bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Based on views</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Engagement</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">{analytics.engagement}</p>
            <div className="mt-4 bg-rose-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Likes + Dislikes + Comments</p>
            </div>
          </Card>
        </div>

        {/* Viewers List */}
        {analytics.viewsData && analytics.viewsData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">View History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">View Time</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.viewsData.map((view, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        {new Date(view.viewedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {formatTime(view.timeSpent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {(!analytics.viewsData || analytics.viewsData.length === 0) && (
          <Card className="p-12 text-center">
            <FiEye className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Views Yet</h3>
            <p className="text-gray-600">
              Views will appear here once people start reading your post.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostAnalytics;

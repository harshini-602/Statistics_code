import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageCircle,
  FiTrendingUp,
  FiClock,
  FiZap
} from 'react-icons/fi';
import Card from './Card';

const Statistics = ({ stats, posts, topPosts, viewsChartData }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (viewsChartData) {
      setChartData(viewsChartData);
    }
  }, [viewsChartData]);

  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Helper function to format time
  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Engagement breakdown for pie chart
  const engagementData = [
    { name: 'Likes', value: stats?.totalLikes || 0 },
    { name: 'Dislikes', value: stats?.totalDislikes || 0 },
    { name: 'Comments', value: stats?.totalComments || 0 }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>
          <p className="text-gray-600 text-sm mt-1">Track your blog performance and engagement</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTimeRange('7days')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === '7days'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setSelectedTimeRange('30days')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === '30days'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setSelectedTimeRange('alltime')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === 'alltime'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <Card className="p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats?.totalViews || 0)}
              </p>
              <p className="text-blue-600 text-xs mt-2 flex items-center gap-1">
                <FiTrendingUp size={14} /> Active engagement
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiEye className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Total Engagement */}
        <Card className="p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Engagement</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalLikes || 0 + stats?.totalDislikes || 0 + stats?.totalComments || 0}
              </p>
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                <FiZap size={14} /> {stats?.engagementRate || 0}% rate
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiThumbsUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Avg Time Spent */}
        <Card className="p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Time Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatTime(stats?.totalTimeSpent || 0)}
              </p>
              <p className="text-purple-600 text-xs mt-2 flex items-center gap-1">
                <FiClock size={14} /> Per article
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiClock className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Total Comments */}
        <Card className="p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats?.totalComments || 0)}
              </p>
              <p className="text-orange-600 text-xs mt-2 flex items-center gap-1">
                <FiMessageCircle size={14} /> Reader feedback
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiMessageCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                name="Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h2>
          {engagementData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => (
                    <text fontSize="12" fill="#374151" fontWeight="600">
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  )}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <p>No engagement data available yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Interaction Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Total Likes</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{stats?.totalLikes || 0}</p>
          <div className="mt-4 bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Average per post: {stats?.totalPosts > 0 ? Math.round((stats?.totalLikes || 0) / stats?.totalPosts) : 0}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Total Dislikes</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{stats?.totalDislikes || 0}</p>
          <div className="mt-4 bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Average per post: {stats?.totalPosts > 0 ? Math.round((stats?.totalDislikes || 0) / stats?.totalPosts) : 0}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Engagement Rate</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.engagementRate || 0}%</p>
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Based on total interactions
            </p>
          </div>
        </Card>
      </div>

      {/* Top Performing Posts */}
      {topPosts && topPosts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Views</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Likes</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Comments</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Engagement</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post, index) => (
                  <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 truncate">{post.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                        <FiEye size={14} /> {post.views}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        {post.likes}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                        {post.comments}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs">
                        {post.engagement}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-600 font-medium">{formatTime(post.avgTimePerView)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* All Posts Analytics */}
      {posts && posts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Posts Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Views</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Likes</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Dislikes</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Comments</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Time</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 truncate block">{post.title}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-900">{post.views}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-semibold">{post.likes}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">{post.dislikes}</td>
                    <td className="py-3 px-4 text-center text-orange-600 font-semibold">{post.comments}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{formatTime(post.timeSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {(!posts || posts.length === 0) && (
        <Card className="p-12 text-center">
          <FiEye className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Your statistics will appear here once you create and publish posts that get viewed and engaged with.
          </p>
        </Card>
      )}
    </div>
  );
};

export default Statistics;

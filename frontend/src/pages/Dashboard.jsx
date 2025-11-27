
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiFileText, FiPlusCircle, FiMessageCircle, FiBarChart2, FiSettings, FiLogOut, FiEye, FiEdit2, FiTrash2, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import axios from '../api/axios';
import Loader from '../components/Loader';
import Card from '../components/Card';
import Statistics from '../components/Statistics';
import { useAuth } from '../context/AuthContext';

// Event context for dashboard refresh
export const DashboardRefreshContext = React.createContext({ trigger: () => {}, subscribe: () => {} });

// Provider for dashboard refresh events
export function DashboardRefreshProvider({ children }) {
  const listenersRef = useRef([]);
  const trigger = () => {
    listenersRef.current.forEach(fn => fn && fn());
  };
  const subscribe = (fn) => {
    listenersRef.current.push(fn);
    return () => {
      listenersRef.current = listenersRef.current.filter(f => f !== fn);
    };
  };
  return (
    <DashboardRefreshContext.Provider value={{ trigger, subscribe }}>
      {children}
    </DashboardRefreshContext.Provider>
  );
}

const sidebarItems = [
  { label: 'Dashboard Overview', icon: <FiHome />, key: 'overview' },
  { label: 'My Posts', icon: <FiFileText />, key: 'posts' },
  { label: 'Statistics', icon: <FiBarChart2 />, key: 'statistics' },
  { label: 'Create New Post', icon: <FiPlusCircle />, key: 'create' },
  { label: 'Settings', icon: <FiSettings />, key: 'settings' },
  { label: 'Logout', icon: <FiLogOut />, key: 'logout' },
];

const statusColors = {
  Published: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
};

function Sidebar({ collapsed, onToggle, selected, onSelect }) {
  return (
    <aside className={`bg-gray-900 text-gray-100 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} fixed md:static z-30`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {!collapsed && <span className="text-xl font-bold tracking-tight">Dashboard</span>}
        <button className="md:hidden" onClick={onToggle}>
          <FiMenu size={22} />
        </button>
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.key}>
              <button
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all hover:bg-gray-800 focus:outline-none ${selected === item.key ? 'bg-gray-800' : ''}`}
                onClick={() => onSelect(item.key)}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SummaryCards({ stats }) {
  const cards = [
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: <FiFileText className="text-blue-500" /> },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: <FiThumbsUp className="text-green-500" /> },
    { label: 'Total Dislikes', value: stats?.totalDislikes || 0, icon: <FiThumbsDown className="text-red-500" /> },
    { label: 'Total Comments', value: stats?.totalComments || 0, icon: <FiMessageCircle className="text-pink-500" /> },
    { label: 'Avg. Read Time (min)', value: stats?.avgReadTime || 0, icon: <FiBarChart2 className="text-yellow-500" /> },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => (
        <Card key={card.label} className="flex items-center space-x-4 hover:shadow-lg transition-all group">
          <div className="text-3xl group-hover:scale-110 transition-transform">{card.icon}</div>
          <div>
            <div className="text-2xl font-bold group-hover:text-green-500 transition-colors">{card.value}</div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PostsTable({ posts }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = posts.filter(
    (post) =>
      (filter === 'All' || post.status === filter) &&
      post.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <Card className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 p-4">
        <h2 className="text-lg font-semibold">My Posts</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search posts..."
            className="pl-3 pr-3 py-2 rounded border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Created</th>
              <th className="py-2 px-4 text-left">Likes</th>
              <th className="py-2 px-4 text-left">Dislikes</th>
              <th className="py-2 px-4 text-left">Comments</th>
              <th className="py-2 px-4 text-left">Read Time</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((post) => (
              <tr key={post._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-semibold">{post.title}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[post.status]}`}>{post.status}</span>
                </td>
                <td className="py-2 px-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4">{post.likes}</td>
                <td className="py-2 px-4">{post.dislikes}</td>
                <td className="py-2 px-4">{post.comments}</td>
                <td className="py-2 px-4">{post.readTime} min</td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="p-1 rounded hover:bg-blue-100 transition" title="Edit">
                    <FiEdit2 />
                  </button>
                  <button className="p-1 rounded hover:bg-green-100 transition" title="View">
                    <FiEye />
                  </button>
                  <button className="p-1 rounded hover:bg-red-100 transition" title="Delete">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4 p-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="text-sm">{page} / {totalPages}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </Card>
  );
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [viewsChartData, setViewsChartData] = useState([]);
  const { user } = useAuth();
  const location = useLocation();


  // Refetch dashboard if user changes or if navigation state requests refresh
  useEffect(() => {
    if (user) fetchDashboard();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (location.state && location.state.refresh) {
      fetchDashboard();
      // Remove refresh state so it doesn't refetch on every render
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line
  }, [location.state]);

  // Listen for dashboard refresh events
  const { subscribe } = useContext(DashboardRefreshContext) || {};
  useEffect(() => {
    if (!subscribe) return;
    const unsub = subscribe(fetchDashboard);
    return () => unsub && unsub();
    // eslint-disable-next-line
  }, [subscribe]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/dashboard/user');
      setStats(res.data.stats);
      setPosts(res.data.posts || []);
      setTopPosts(res.data.topPosts || []);
      setViewsChartData(res.data.viewsChartData || []);
    } catch (e) {
      setStats(null);
      setPosts([]);
      setTopPosts([]);
      setViewsChartData([]);
    } finally {
      setLoading(false);
    }
  };


  // Floating button handler
  const handleCreate = () => {
    window.location.href = '/create-post';
  };


  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={!sidebarOpen && window.innerWidth < 768}
        onToggle={() => setSidebarOpen((v) => !v)}
        selected={selected}
        onSelect={setSelected}
      />
      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-56 p-4 md:p-8 transition-all">
        {/* Floating Create Button */}
        <button
          onClick={handleCreate}
          className="fixed z-40 bottom-8 right-8 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all font-semibold text-lg"
        >
          <FiPlusCircle className="inline mr-2" /> Create New Post
        </button>
        {/* Dashboard Overview */}
        {selected === 'overview' && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <SummaryCards stats={stats} />
            <PostsTable posts={posts} />
          </>
        )}
        {/* My Posts */}
        {selected === 'posts' && (
          <>
            <h1 className="text-2xl font-bold mb-6">My Posts</h1>
            <PostsTable posts={posts} />
          </>
        )}
        {/* Statistics */}
        {selected === 'statistics' && (
          <Statistics stats={stats} posts={posts} topPosts={topPosts} viewsChartData={viewsChartData} />
        )}
        {/* Create New Post */}
        {selected === 'create' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <p className="text-gray-500">[Create Post Form Placeholder]</p>
          </div>
        )}
        {/* Settings */}
        {selected === 'settings' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-500">[Settings Placeholder]</p>
          </div>
        )}
        {/* Logout */}
        {selected === 'logout' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Logout</h1>
            <p className="text-gray-500">[Logout Placeholder]</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardWithProvider(props) {
  return (
    <DashboardRefreshProvider>
      <Dashboard {...props} />
    </DashboardRefreshProvider>
  );
}

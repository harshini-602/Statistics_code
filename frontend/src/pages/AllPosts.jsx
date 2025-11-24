import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showFollowed, setShowFollowed] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, [page, search, category, tag, showFollowed]);

  const fetchPosts = async () => {
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (tag) params.tag = tag;
      if (showFollowed) params.followed = true;
      const response = await axios.get('/api/posts', { params });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-rose-50 py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-8 text-center drop-shadow-lg tracking-tight animate-fade-in">
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400 bg-clip-text text-transparent">All Posts</span>
        </h1>

        <div className="mb-8 flex flex-wrap gap-4 justify-center items-end animate-fade-in">
          <Button
            onClick={() => setShowFollowed(f => !f)}
            className={`rounded-full px-5 py-2 font-semibold shadow transition ${showFollowed ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            {showFollowed ? 'Show All Posts' : 'Show Followed Users Posts'}
          </Button>
          <Input
            label="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or content"
            className="w-56"
          />
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
            <select
              className="p-2 border rounded-lg bg-white shadow focus:ring-emerald-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required={false}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Tag</label>
            <select
              className="p-2 border rounded-lg bg-white shadow focus:ring-emerald-300"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {tags.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post._id} className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl bg-white/80 rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-300 to-sky-300 flex items-center justify-center mr-3 shadow">
                  <span className="text-lg font-bold text-white uppercase">{post.author.username[0]}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">{post.author.username}</span>
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 line-clamp-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || (post.content && post.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...')}</p>
              <Link
                to={`/posts/${post._id}`}
                className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 animate-pop"
              >
                Read More
              </Link>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-2 flex-wrap animate-fade-in">
          <Button onClick={() => setPage(1)} disabled={page === 1} className="rounded-full px-4 py-2 bg-gradient-to-r from-slate-400 to-emerald-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200">First</Button>
          <Button onClick={() => setPage(page - 1)} disabled={page === 1} className="rounded-full px-4 py-2 bg-gradient-to-r from-slate-400 to-emerald-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200">Previous</Button>
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-full font-semibold transition-colors duration-200 ${page === i + 1 ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
              >{i + 1}</button>
            ))}
          </div>
          <Button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="rounded-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200">Next</Button>
          <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="rounded-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200">Last</Button>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Loader from '../components/Loader';
import Comments from '../components/Comments';
import { useAuth } from '../context/AuthContext';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
        setLikes(res.data.likes?.length || 0);
        
        // Fetch comments count
        const commentsRes = await axios.get(`/api/comments/${id}`);
        setCommentsCount(Array.isArray(commentsRes.data) ? commentsRes.data.length : 0);
      } catch (err) {
        console.error('Error loading post:', err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Track view when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000); // in seconds
      if (timeSpent > 1) { // Only track if spent more than 1 second
        axios.post(`/api/posts/${id}/track-view`, { timeSpent }).catch(err => console.error('Error tracking view:', err));
      }
    };
  }, [id]);

  const handleLike = async () => {
    try {
      if (!user) return navigate('/login');
      const res = await axios.post(`/api/posts/${post._id}/like`);
      if (res && res.data) {
        setLikes(res.data.likes);
      }
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  if (loading) return <Loader />;

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-4">
        <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">error_outline</span>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Post not found</h2>
        <p className="text-slate-600 mb-6">Sorry, the post you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-slate-900 text-white rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  const imageUrl = post.images?.[0]
    ? `http://localhost:5000/${post.images[0]}`
    : post.thumbnail;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-8">
          {post.title}
        </h1>

        {/* Author Info & Meta */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link to={`/users/${post.author._id}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <span className="text-lg font-bold text-white uppercase">
                  {post.author.username[0]}
                </span>
              </div>
            </Link>
            <div>
              <Link
                to={`/users/${post.author._id}`}
                className="text-slate-900 font-semibold hover:underline transition-all block"
              >
                {post.author.username}
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{Math.ceil(post.content.replace(/<[^>]+>/g, "").length / 1000)} min read</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 transition-colors group"
              title="Like"
            >
              <span className="material-symbols-outlined text-slate-600 group-hover:text-red-500 transition-colors">
                favorite
              </span>
            </button>
            <span className="text-sm text-slate-600">{likes}</span>
            
            <button
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 transition-colors group ml-2"
              title="Comments"
            >
              <span className="material-symbols-outlined text-slate-600 group-hover:text-blue-500 transition-colors">
                chat_bubble
              </span>
            </button>
            <span className="text-sm text-slate-600">{commentsCount}</span>
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-12">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Content Section with Greyish Background */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl p-6 sm:p-8 lg:p-10 mb-12">
          <div 
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-h1:text-3xl prose-h1:mb-5 prose-h1:mt-10
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-base
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:my-5 prose-ol:my-5
              prose-li:text-slate-700 prose-li:my-1 prose-li:text-base
              prose-img:rounded-lg prose-img:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-slate-300 
              prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:my-6
              prose-code:bg-white prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-slate-800
              prose-pre:bg-slate-900 prose-pre:text-slate-100"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

        {/* Debug: show raw HTML & length (temporary) */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <details className="bg-white/90 p-4 rounded-lg shadow">
            <summary className="font-semibold cursor-pointer">Debug: Raw HTML & Length</summary>
            <div className="mt-3 text-sm text-slate-700">
              <p className="mb-2"><strong>Content length:</strong> {post.content ? post.content.length : 0}</p>
              <pre className="whitespace-pre-wrap max-h-64 overflow-auto text-xs">{post.content}</pre>
            </div>
          </details>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12 pb-12 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mb-12 pb-12 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <Link to={`/users/${post.author._id}`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer flex-shrink-0">
                <span className="text-3xl font-bold text-white uppercase">
                  {post.author.username[0]}
                </span>
              </div>
            </Link>
            <div className="flex-1">
              <div className="mb-2">
                <Link
                  to={`/users/${post.author._id}`}
                  className="text-xl font-bold text-slate-900 hover:underline"
                >
                  {post.author.username}
                </Link>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {post.author.bio || "Writer and creator sharing thoughts and stories with the community."}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section - Centered with Medium Width */}
      <div className="bg-slate-50 py-12">
        <div id="comments" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Comments postId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
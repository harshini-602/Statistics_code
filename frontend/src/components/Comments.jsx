import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CommentItem = ({ comment, onDelete, onLike, onReply, currentUser }) => {
  const isAuthor = currentUser && comment.userId?._id === currentUser._id;
  const isLiked = currentUser && comment.likes?.includes(currentUser._id);

  return (
    <div className="py-6 border-b border-slate-200 last:border-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white uppercase">
            {comment.userId?.username?.[0] || 'U'}
          </span>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-slate-900">
              {comment.userId?.username || 'Unknown User'}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Content */}
          <div 
            className="text-slate-700 leading-relaxed mb-3 prose prose-sm max-w-none
              prose-p:my-1 prose-a:text-blue-600 hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment._id)}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-slate-500 hover:text-red-500'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isLiked ? 'favorite' : 'favorite_border'}
              </span>
              <span>{comment.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => onReply(comment._id)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">reply</span>
              <span>Reply</span>
            </button>

            {isAuthor && (
              <button
                onClick={() => onDelete(comment._id)}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors ml-auto"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex gap-3 pl-4 border-l-2 border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white uppercase">
                      {reply.userId?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900">
                        {reply.userId?.username || 'Unknown User'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700">{reply.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const fetchComments = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get(`/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(true);
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      toast.info('Please login or signup to post comments');
      return navigate('/login');
    }
    try {
      await axios.post('/api/comments', { postId, content, replyTo });
      setContent('');
      setReplyTo(null);
      toast.success('Comment posted');
      fetchComments(false);
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error(err.response?.data?.message || 'Error posting comment');
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      toast.info('Please login to delete comments');
      return navigate('/login');
    }
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await axios.delete(`/api/comments/${id}`);
      toast.success('Comment deleted');
      fetchComments(false);
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.message || 'Error deleting comment');
    }
  };

  const handleLike = async (id) => {
    if (!user) {
      toast.info('Login to like comments');
      return navigate('/login');
    }
    try {
      await axios.post(`/api/comments/${id}/like`);
      fetchComments(false); // Refresh without showing loading
    } catch (err) {
      console.error('Error liking comment:', err);
      toast.error(err.response?.data?.message || 'Error liking comment');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Comments ({comments.length})
        </h2>
        <div className="h-1 w-16 bg-slate-900"></div>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          {replyTo && (
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
              <span className="material-symbols-outlined text-base">reply</span>
              <span>Replying to comment</span>
              <button
                type="button"
                onClick={() => {
                  setReplyTo(null);
                  setContent('');
                }}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white uppercase">
                {user.username?.[0]}
              </span>
            </div>

            {/* Input and Button */}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
                rows="3"
              />
              <div className="flex justify-end gap-2 mt-3">
                {replyTo && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setContent('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {replyTo ? 'Reply' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <p className="text-slate-600 mb-4">Join the conversation</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Sign in to comment
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            <span>Loading comments...</span>
          </div>
        </div>
      ) : (
        <div>
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">chat_bubble_outline</span>
              <p className="text-slate-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onReply={setReplyTo}
                  currentUser={user}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
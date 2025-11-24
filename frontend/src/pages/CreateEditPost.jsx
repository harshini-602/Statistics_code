import React, { useState, useEffect, useContext } from 'react';
import { DashboardRefreshContext } from './Dashboard';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { toast } from 'react-toastify';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-slate-200 bg-white p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <div className="flex gap-1 pr-2 border-r border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Bold"
        >
          <span className="material-symbols-outlined text-lg">format_bold</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Italic"
        >
          <span className="material-symbols-outlined text-lg">format_italic</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('underline') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Underline"
        >
          <span className="material-symbols-outlined text-lg">format_underlined</span>
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 pr-2 border-r border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Subheading"
        >
          H3
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 pr-2 border-r border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('orderedList') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Numbered List"
        >
          <span className="material-symbols-outlined text-lg">format_list_numbered</span>
        </button>
      </div>

      {/* Quote & Code */}
      <div className="flex gap-1 pr-2 border-r border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('blockquote') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Quote"
        >
          <span className="material-symbols-outlined text-lg">format_quote</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('codeBlock') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
          }`}
          title="Code"
        >
          <span className="material-symbols-outlined text-lg">code</span>
        </button>
      </div>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded transition-colors ${
          editor.isActive('link') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
        }`}
        title="Add Link"
      >
        <span className="material-symbols-outlined text-lg">link</span>
      </button>
    </div>
  );
};

const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { trigger: triggerDashboardRefresh } = useContext(DashboardRefreshContext) || {};

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (id) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const post = response.data;
      setTitle(post.title);
      setContent(post.content);
      setCategories(post.categories.map(c => c._id));
      setTags(post.tags.map(t => t._id));
      setStatus(post.status);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setAvailableCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/tags');
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!images || images.length === 0) {
        toast.warn('No images selected!');
      }
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', status);
      if (categories[0]) formData.append('categories', categories[0]);
      tags.forEach(tag => formData.append('tags', tag));
      images.forEach(img => formData.append('images', img));

      if (id) {
        await axios.put(`/api/posts/${id}`, formData);
        toast.success('Post updated successfully');
        if (triggerDashboardRefresh) triggerDashboardRefresh();
        navigate('/dashboard');
      } else {
        await axios.post('/api/posts', formData);
        toast.success('Post created successfully');
        if (triggerDashboardRefresh) triggerDashboardRefresh();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      const resp = error.response?.data;
      if (resp?.errors && Array.isArray(resp.errors)) {
        resp.errors.forEach((e) => toast.error(e));
      } else if (resp?.message) {
        toast.error(resp.message);
      } else {
        toast.error(error.message || 'Error saving post');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              <span className="font-medium text-sm">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
              
              {/* Publish Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    Saving...
                  </>
                ) : (
                  <>
                    {id ? 'Update' : 'Publish'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Post title"
              className="w-full text-3xl sm:text-4xl font-bold text-slate-900 placeholder-slate-400 border-0 focus:ring-0 outline-none bg-transparent p-0"
            />
          </div>

          {/* Image Upload Section */}
          {imagePreviews.length === 0 ? (
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors group-hover:border-slate-400 group-hover:bg-slate-50">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-3">image</span>
                <p className="text-sm font-medium text-slate-600">Add cover image</p>
                <p className="text-xs text-slate-500 mt-1">Click to browse or drag and drop</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} alt="preview" className="w-full h-80 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white text-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TipTap Editor */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent 
              editor={editor} 
              className="prose prose-lg max-w-none p-6 min-h-[500px] 
                prose-headings:text-slate-900 
                prose-p:text-slate-700 
                prose-a:text-blue-600 
                prose-strong:text-slate-900
                prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4"
            />
          </div>

          {/* Publishing Options */}
          <div className="border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  value={categories[0] || ''}
                  onChange={e => setCategories([e.target.value])}
                  required
                >
                  <option value="" disabled>Select</option>
                  {availableCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent min-h-[42px]"
                  value={tags}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    setTags(selected);
                  }}
                >
                  {availableTags.map(tag => (
                    <option key={tag._id} value={tag._id}>{tag.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(tagId => {
                  const tag = availableTags.find(t => t._id === tagId);
                  return tag ? (
                    <span key={tagId} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-2">
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter(t => t !== tagId))}
                        className="hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditPost;
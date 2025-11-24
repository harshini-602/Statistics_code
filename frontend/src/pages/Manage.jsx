import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Manage = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [catName, setCatName] = useState('');
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [cRes, tRes] = await Promise.all([axios.get('/api/categories'), axios.get('/api/tags')]);
      setCategories(cRes.data);
      setTags(tRes.data);
    } catch (err) { console.error(err); }
  };

  const addCategory = async () => {
    if (!catName) return;
    setLoading(true);
    try {
      await axios.post('/api/categories', { name: catName });
      setCatName('');
      fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const addTag = async () => {
    if (!tagName) return;
    setLoading(true);
    try {
      await axios.post('/api/tags', { name: tagName });
      setTagName('');
      fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const removeCategory = async (id) => {
    try { await axios.delete(`/api/categories/${id}`); fetchAll(); } catch (err) { console.error(err); }
  };

  const removeTag = async (id) => {
    try { await axios.delete(`/api/tags/${id}`); fetchAll(); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-rose-50 py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 drop-shadow-lg tracking-tight text-center animate-fade-in">
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400 bg-clip-text text-transparent">Manage Categories & Tags</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <Card className="bg-white/90 rounded-2xl shadow-xl p-8">
            <h2 className="font-semibold mb-4 text-xl text-emerald-600">Categories</h2>
            <div className="mb-4 flex gap-2">
              <Input label="New category" value={catName} onChange={(e) => setCatName(e.target.value)} className="flex-1" />
              <Button onClick={addCategory} className="rounded-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200 animate-pop">Add</Button>
            </div>
            <ul className="divide-y divide-slate-100">
              {categories.map(c => (
                <li key={c._id} className="flex justify-between items-center py-2">
                  <span className="text-slate-700">{c.name}</span>
                  <button className="text-rose-500 hover:underline font-medium" onClick={() => removeCategory(c._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-white/90 rounded-2xl shadow-xl p-8">
            <h2 className="font-semibold mb-4 text-xl text-emerald-600">Tags</h2>
            <div className="mb-4 flex gap-2">
              <Input label="New tag" value={tagName} onChange={(e) => setTagName(e.target.value)} className="flex-1" />
              <Button onClick={addTag} className="rounded-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow hover:scale-105 transition-transform duration-200 animate-pop">Add</Button>
            </div>
            <ul className="divide-y divide-slate-100">
              {tags.map(t => (
                <li key={t._id} className="flex justify-between items-center py-2">
                  <span className="text-slate-700">{t.name}</span>
                  <button className="text-rose-500 hover:underline font-medium" onClick={() => removeTag(t._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Manage;

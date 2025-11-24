import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Loader from '../components/Loader';
import Button from '../components/Button';

const UserProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchFollowers();
    fetchFollowing();
  }, [id, user]);

  const fetchProfile = async () => {
    try {
      const url = `/api/users/${id}`;
      const res = await axios.get(url);
      setProfile(res.data);
      if (user && res.data.followers.includes(user.id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error('UserProfile fetch error:', err);
      console.error('Request URL:', `/api/users/${id}`);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`/api/users/${id}/followers`);
      setFollowers(res.data);
    } catch {
      setFollowers([]);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`/api/users/${id}/following`);
      setFollowing(res.data);
    } catch {
      setFollowing([]);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`/api/users/${id}/follow`);
      setIsFollowing(true);
      fetchFollowers();
    } catch {}
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`/api/users/${id}/unfollow`);
      setIsFollowing(false);
      fetchFollowers();
    } catch {}
  };

  if (loading) return <Loader />;
  if (!profile) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 flex flex-col items-center">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
          alt="avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.username}</h1>
        <p className="text-slate-500 mb-4">{profile.email}</p>
        {user && user.id !== profile._id && (
          isFollowing ? (
            <Button onClick={handleUnfollow} className="bg-rose-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-rose-500 transition">Unfollow</Button>
          ) : (
            <Button onClick={handleFollow} className="bg-emerald-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-emerald-500 transition">Follow</Button>
          )
        )}
        <div className="flex gap-8 mt-6">
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Followers</span>
            <div className="flex flex-wrap gap-2">
              {followers.length === 0 ? (
                <span className="text-slate-400 text-xs">No followers yet</span>
              ) : (
                followers.map(f => (
                  <span key={f._id} className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">{f.username}</span>
                ))
              )}
            </div>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Following</span>
            <div className="flex flex-wrap gap-2">
              {following.length === 0 ? (
                <span className="text-slate-400 text-xs">Not following anyone</span>
              ) : (
                following.map(f => (
                  <span key={f._id} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{f.username}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

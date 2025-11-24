import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount (will succeed if HttpOnly token cookie is present)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/users/profile');
        const data = res.data;
        // Normalize user object to include `id`
        const normalized = { id: data._id || data.id, username: data.username, email: data.email };
        setUser(normalized);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (credentials) => {
    // credentials: { email, password }
    try {
      await axios.post('/api/users/login', credentials);
      // backend sets HttpOnly cookie; fetch profile
      const profile = await axios.get('/api/users/profile');
      const data = profile.data;
      const normalized = { id: data._id || data.id, username: data.username, email: data.email };
      setUser(normalized);
      toast.success('Logged in successfully');
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return { ok: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (e) {
      // ignore
    }
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

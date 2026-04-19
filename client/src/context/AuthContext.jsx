import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Validate token
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const PROD_URL = 'https://sft-2biz.onrender.com';
      const baseURL = import.meta.env.MODE === 'development' ? '/api' : `${import.meta.env.VITE_API_URL || PROD_URL}/api`;
      const res = await axios.get(`${baseURL}/auth/me`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(res.data);
    } catch (error) {
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const PROD_URL = 'https://sft-2biz.onrender.com';
      const baseURL = import.meta.env.MODE === 'development' ? '/api' : `${import.meta.env.VITE_API_URL || PROD_URL}/api`;
      const res = await axios.post(`${baseURL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };

  const register = async (name, email, password) => {
    try {
      const PROD_URL = 'https://sft-2biz.onrender.com';
      const baseURL = import.meta.env.MODE === 'development' ? '/api' : `${import.meta.env.VITE_API_URL || PROD_URL}/api`;
      const res = await axios.post(`${baseURL}/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


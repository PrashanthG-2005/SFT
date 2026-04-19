import axios from 'axios';

const PROD_URL = 'https://sft-2biz.onrender.com';
const API = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : `${import.meta.env.VITE_API_URL || PROD_URL}/api`
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const expenseAPI = {
  getAll: () => API.get('/expenses'),
  add: (data) => API.post('/expenses', data),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
};

export const budgetAPI = {
  getAll: () => API.get('/budgets'),
  add: (data) => API.post('/budgets', data),
  update: (id, data) => API.put(`/budgets/${id}`, data),
  delete: (id) => API.delete(`/budgets/${id}`),
};

export const goalAPI = {
  getAll: () => API.get('/goals'),
  add: (data) => API.post('/goals', data),
  addAmount: (id, data) => API.put(`/goals/${id}/add`, data),
  delete: (id) => API.delete(`/goals/${id}`),
};

export const investmentAPI = {
  getAll: () => API.get('/investments'),
  add: (data) => API.post('/investments', data),
  update: (id, data) => API.put(`/investments/${id}`, data),
  delete: (id) => API.delete(`/investments/${id}`),
};

// Request interceptor for auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export const reportsAPI = {
  getReports: (params) => API.get('/reports', { params }),
};

export default API;


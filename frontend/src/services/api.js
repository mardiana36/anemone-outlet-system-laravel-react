import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/login', { email, password }),
  
  logout: () => 
    api.post('/logout'),
  
  getMe: () => 
    api.get('/me'),
};

export const productAPI = {
  getProducts: () => 
    api.get('/products'),
  
  createProduct: (data) => 
    api.post('/products', data),
};


export const orderAPI = {
  getOrders: () => 
    api.get('/orders'),
  
  createOrder: (items) => 
    api.post('/orders', { items }),
  
  updateOrderStatus: (id, status) => 
    api.put(`/orders/${id}/status`, { status }),
};

export const dashboardAPI = {
  getSummary: () => 
    api.get('/dashboard/summary'),
};

export default api;
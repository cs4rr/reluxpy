import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('relux_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const verifyToken = () => 
  api.get('/auth/verify');

// Categories
export const getCategories = () => 
  api.get('/categories');

export const getCategoryBySlug = (slug) => 
  api.get(`/categories/${slug}`);

// Products
export const getProducts = (params = {}) => 
  api.get('/products', { params });

export const getProductById = (id) => 
  api.get(`/products/${id}`);

export const createProduct = (formData) => 
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateProduct = (id, formData) => 
  api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteProduct = (id) => 
  api.delete(`/products/${id}`);

export default api;

import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;

export const authAPI = {
  register: (data) => API.post('/auth/register/', data),
  login: (data) => API.post('/auth/login/', data),
  logout: () => API.post('/auth/logout/'),
  profile: () => API.get('/auth/profile/'),
};

export const productAPI = {
  list: (params) => API.get('/products/', { params }),
  get: (id) => API.get(`/products/${id}/`),
  create: (data) => API.post('/products/', data),
  update: (id, data) => API.patch(`/products/${id}/`, data),
  delete: (id) => API.delete(`/products/${id}/`),
};

export const categoryAPI = {
  list: () => API.get('/categories/'),
};

export const cartAPI = {
  get: () => API.get('/cart/'),
  addItem: (productId, quantity = 1) =>
    API.post('/cart/items/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) =>
    API.patch(`/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => API.delete(`/cart/items/${itemId}/`),
  clear: () => API.delete('/cart/'),
};

export const orderAPI = {
  checkout: (shippingAddress) => API.post('/checkout/', { shipping_address: shippingAddress }),
  list: () => API.get('/orders/'),
  update: (id, data) => API.patch(`/orders/${id}/`, data),
};

export const adminAPI = {
  stats: () => API.get('/admin/stats/'),
};

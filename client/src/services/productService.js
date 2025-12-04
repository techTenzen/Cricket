import api from './api';

export const productService = {
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },

  createProduct: (productData) => {
    const config = productData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/products', productData, config);
  },

  updateProduct: (id, productData) => {
    const config = productData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.put(`/products/${id}`, productData, config);
  },

  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  addReview: (id, reviewData) => {
    return api.post(`/products/${id}/reviews`, reviewData);
  }
};
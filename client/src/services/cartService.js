import api from './api';

export const cartService = {
  getCart: () => {
    return api.get('/cart');
  },

  addToCart: (productId, quantity) => {
    return api.post('/cart/add', { productId, quantity });
  },

  updateCartItem: (productId, quantity) => {
    return api.put(`/cart/update/${productId}`, { quantity });
  },

  removeFromCart: (productId) => {
    return api.delete(`/cart/remove/${productId}`);
  },

  clearCart: () => {
    return api.delete('/cart/clear');
  }
};
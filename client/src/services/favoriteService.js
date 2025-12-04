import api from './api';

export const favoriteService = {
  getFavorites: () => api.get('/favorites'),
  addToFavorites: (productId) => api.post('/favorites', { productId }),
  removeFromFavorites: (productId) => api.delete(`/favorites/${productId}`)
};
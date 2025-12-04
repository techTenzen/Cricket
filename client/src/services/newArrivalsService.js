import api from './api';

export const newArrivalsService = {
  getNewArrivals: () => api.get('/new-arrivals'),
  addToNewArrivals: (productId, order) => api.post('/admin/new-arrivals', { productId, order }),
  removeFromNewArrivals: (productId) => api.delete(`/admin/new-arrivals/${productId}`),
  updateNewArrivalsOrder: (items) => api.put('/admin/new-arrivals/order', { items })
};
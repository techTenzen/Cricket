import api from './api';

export const bestSellerService = {
  getBestSellers: () => api.get('/bestsellers'),
  
  // Admin functions
  getAdminBestSellers: () => api.get('/admin/bestsellers'),
  addBestSeller: (productId) => api.post('/admin/bestsellers', { productId }),
  updateOrder: (id, order) => api.put(`/admin/bestsellers/${id}/order`, { order }),
  deleteBestSeller: (id) => api.delete(`/admin/bestsellers/${id}`),
  syncAutoBestSellers: () => api.post('/admin/bestsellers/sync')
};
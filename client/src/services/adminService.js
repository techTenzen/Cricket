import api from './api';

export const adminService = {
  // Dashboard stats
  getStats: () => api.get('/admin/stats'),
  
  // User management
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Order management
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  deleteOrder: (orderId) => api.delete(`/orders/${orderId}`),
  
  // Product management (using existing product endpoints with admin auth)
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (productId, productData) => api.put(`/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  
  // Reset functions
  resetRevenue: () => api.post('/admin/reset/revenue'),
  resetOrders: () => api.post('/admin/reset/orders'),
  resetConversionRate: () => api.post('/admin/reset/conversion-rate'),
  resetAvgOrderValue: () => api.post('/admin/reset/avg-order-value'),
  resetReturnRate: () => api.post('/admin/reset/return-rate')
};
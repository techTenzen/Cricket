import api from './api';

export const orderService = {
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  getMyOrders: () => {
    return api.get('/orders/my-orders');
  },

  getOrder: (id) => {
    return api.get(`/orders/${id}`);
  },

  getAllOrders: () => {
    return api.get('/orders');
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/orders/${id}/status`, { status });
  },

  deleteOrder: (id) => {
    return api.delete(`/orders/${id}`);
  }
};
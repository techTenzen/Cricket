export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  PRODUCTS: {
    BASE: '/products',
    REVIEWS: (id) => `/products/${id}/reviews`
  },
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    UPDATE: (id) => `/cart/update/${id}`,
    REMOVE: (id) => `/cart/remove/${id}`,
    CLEAR: '/cart/clear'
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders'
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    ORDERS: '/admin/orders'
  }
};

export const CATEGORIES = [
  'bats', 'balls', 'pads', 'gloves', 'helmets', 'shoes', 'clothing', 'accessories'
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};
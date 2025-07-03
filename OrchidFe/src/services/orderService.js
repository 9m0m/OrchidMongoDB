import apiClient from './apiConfig';

const OrderService = {
  // Get all orders (admin only)
  getAllOrders: async () => {
    return apiClient.get('/orders');
  },

  // Get order by ID
  getOrderById: async (id) => {
    return apiClient.get(`/orders/${id}`);
  },

  // Get orders by user ID
  getOrdersByUser: async () => {
    return apiClient.get('/orders/user');
  },

  // Create new order
  createOrder: async (orderData) => {
    return apiClient.post('/orders', orderData);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return apiClient.put(`/orders/${id}/status`, { status });
  },

  // Cancel order
  cancelOrder: async (id) => {
    return apiClient.put(`/orders/${id}/cancel`);
  }
};

export default OrderService;

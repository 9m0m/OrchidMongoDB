import apiClient from './apiConfig';

const AdminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiClient.get('/admin/dashboard');
  },

  // User management
  getAllUsers: async () => {
    return apiClient.get('/admin/accounts');
  },

  getUserById: async (id) => {
    return apiClient.get(`/admin/accounts/${id}`);
  },

  createUser: async (userData) => {
    return apiClient.post('/admin/accounts', userData);
  },

  updateUser: async (id, userData) => {
    return apiClient.put(`/admin/accounts/${id}`, userData);
  },

  updateUserStatus: async (id, status) => {
    return apiClient.patch(`/admin/accounts/${id}/status`, { status });
  },

  deleteUser: async (id) => {
    return apiClient.delete(`/admin/accounts/${id}`);
  },

  // Employee management
  getAllEmployees: async () => {
    return apiClient.get('/admin/employees');
  },

  // Category management
  getAllCategories: async () => {
    return apiClient.get('/admin/categories');
  },

  getCategoryById: async (id) => {
    return apiClient.get(`/admin/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return apiClient.post('/admin/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return apiClient.put(`/admin/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return apiClient.delete(`/admin/categories/${id}`);
  },

  // Orchid management
  getAllOrchids: async () => {
    return apiClient.get('/admin/orchids');
  },

  getOrchidById: async (id) => {
    return apiClient.get(`/admin/orchids/${id}`);
  },

  createOrchid: async (orchidData) => {
    return apiClient.post('/admin/orchids', orchidData);
  },

  updateOrchid: async (id, orchidData) => {
    return apiClient.put(`/admin/orchids/${id}`, orchidData);
  },

  deleteOrchid: async (id) => {
    return apiClient.delete(`/admin/orchids/${id}`);
  },

  // Role management
  getAllRoles: async () => {
    return apiClient.get('/admin/roles');
  },

  getRoleById: async (id) => {
    return apiClient.get(`/admin/roles/${id}`);
  },

  // Order management
  getAllOrders: async () => {
    return apiClient.get('/admin/orders');
  },

  getOrderById: async (id) => {
    return apiClient.get(`/admin/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return apiClient.post('/admin/orders', orderData);
  },

  updateOrder: async (id, orderData) => {
    return apiClient.put(`/admin/orders/${id}`, orderData);
  },

  updateOrderStatus: async (id, status) => {
    const orderId = id ?? '';
    return apiClient.patch(`/admin/orders/${orderId}/status`, { status });
  },

  deleteOrder: async (id) => {
    return apiClient.delete(`/admin/orders/${id}`);
  },
};

export default AdminService;

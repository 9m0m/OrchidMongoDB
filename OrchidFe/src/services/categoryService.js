import apiClient from './apiConfig';

const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    return apiClient.get('/categories');
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return apiClient.get(`/categories/${id}`);
  },

  // Create new category
  createCategory: async (categoryData) => {
    return apiClient.post('/categories', categoryData);
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    return apiClient.put(`/categories/${id}`, categoryData);
  },

  // Delete category
  deleteCategory: async (id) => {
    return apiClient.delete(`/categories/${id}`);
  },

  // Get orchids by category
  getOrchidsByCategory: async (categoryId) => {
    return apiClient.get(`/categories/${categoryId}/orchids`);
  }
};

export default CategoryService;

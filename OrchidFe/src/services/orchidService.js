import apiClient from './apiConfig';

const OrchidService = {
  // Get all orchids
  getAllOrchids: async () => {
    return apiClient.get('/orchids');
  },

  // Get orchid by ID
  getOrchidById: async (id) => {
    if (!id) {
      return Promise.reject(new Error('Invalid orchid ID'));
    }
    // Using the correct endpoint that's permitted for public access
    return apiClient.get(`/orchids/${id}`);
  },

  // Create new orchid (public method - will fail unless you're an admin)
  createOrchid: async (orchidData) => {
    return apiClient.post('/orchids', orchidData);
  },

  // Update orchid (public method - will fail unless you're an admin)
  updateOrchid: async (id, orchidData) => {
    return apiClient.put(`/orchids/${id}`, orchidData);
  },

  // Delete orchid (public method - will fail unless you're an admin)
  deleteOrchid: async (id) => {
    return apiClient.delete(`/orchids/${id}`);
  },

  // Search orchids by name
  searchOrchids: async (name) => {
    return apiClient.get(`/orchids/search?name=${name}`);
  },

  // ADMIN METHODS
  // These methods use the admin endpoints and require admin privileges

  // Admin: Create new orchid
  adminCreateOrchid: async (orchidData) => {
    return apiClient.post('/admin/orchids', orchidData);
  },

  // Admin: Update orchid
  adminUpdateOrchid: async (id, orchidData) => {
    return apiClient.put(`/admin/orchids/${id}`, orchidData);
  },

  // Admin: Delete orchid
  adminDeleteOrchid: async (id) => {
    return apiClient.delete(`/admin/orchids/${id}`);
  },

  // Admin: Get all orchids
  adminGetAllOrchids: async () => {
    return apiClient.get('/admin/orchids');
  }
};

export default OrchidService;

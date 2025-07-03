import apiClient from './apiConfig';

const AccountService = {
  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/accounts/login', credentials);
      console.log('Login response:', response.data);

      // The response has a nested structure: data.result contains the actual user data and token
      if (response.data && response.data.result && response.data.result.token) {
        localStorage.setItem('token', response.data.result.token);

        // Store user details from the result
        const userData = {
          id: response.data.result.accountId,
          name: response.data.result.accountName,
          email: response.data.result.email,
          // Store role as uppercase to match the conditional check in NavBar
          role: response.data.result.roleName?.toUpperCase()
        };
        console.log('User data being stored in localStorage:', userData);

        localStorage.setItem('user', JSON.stringify(userData));
        console.log('LocalStorage after login:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
      } else {
        console.warn('Login response missing expected structure:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    return apiClient.post('/accounts/register', userData);
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiClient.get('/accounts/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiClient.put('/accounts/profile', userData);
  },

  // Logout - properly call backend API and clear local storage
  logout: async () => {
    try {
      // Call the backend logout API to invalidate the token on the server
      await apiClient.post('/accounts/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AccountService;

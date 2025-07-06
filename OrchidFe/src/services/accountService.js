import { apiClient, API_BASE_URL } from './apiConfig';



// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    const error = isJson 
      ? await response.json()
      : { error: 'API Error', message: await response.text() };
    console.error('API Error:', error);
    throw new Error(JSON.stringify(error));
  }
  
  return isJson ? response.json() : response.text();
};

const accountService = {
  // Register a new account
  register: async (registerData) => {
    console.log('Registering with data:', registerData);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(registerData)
      });
      
      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();
      
      try {
        const data = await responseClone.json();
        
        if (!response.ok) {
          console.error('Registration error:', {
            status: response.status,
            statusText: response.statusText,
            errorData: data
          });
          
          // Create a more detailed error message
          const error = new Error(data.message || 'Registration failed');
          error.response = response;
          error.data = data;
          throw error;
        }
        
        return data;
      } catch (jsonError) {
        // If JSON parsing fails, try to get the response as text
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        throw new Error(`Registration failed: ${response.status} ${response.statusText} - ${text}`);
      }
    } catch (error) {
      console.error('Registration request failed:', error);
      throw error;
    }
  },

  // Login
  login: async (loginData) => {
    console.log('Login attempt with data:', loginData);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const responseData = await handleResponse(response);
      console.log('Login response data:', responseData);
      
      // Extract the actual data from the response
      const data = responseData.result || responseData;
      
      // Store the token and user data in localStorage
      if (data.token || data.jwtToken) {
        const token = data.token || data.jwtToken;
        localStorage.setItem('token', token);
        
        // Extract user data from the response
        const userData = data.user || data.account || {
          id: data.id,
          name: data.name || data.accountName,
          email: data.email,
          role: data.role || data.roleName
        };
        
        // Ensure we have the required user data
        if (userData) {
          // Store individual fields for backward compatibility
          localStorage.setItem('accountId', userData.id || userData._id || '');
          localStorage.setItem('accountName', userData.name || userData.accountName || userData.email || '');
          localStorage.setItem('email', userData.email || '');
          
          // Normalize the role (handle case sensitivity)
          const userRole = userData.role || userData.roleName || '';
          const normalizedRole = userRole.toString().toLowerCase();
          localStorage.setItem('roleName', normalizedRole);
          
          // Store the complete user object
          const userToStore = {
            id: userData.id || userData._id,
            name: userData.name || userData.accountName,
            email: userData.email,
            role: normalizedRole,
            ...userData // Include any additional user data
          };
          
          localStorage.setItem('user', JSON.stringify(userToStore));
          console.log('Stored user data:', userToStore);
        }
        
        console.log('User data stored in localStorage:', {
          token: token ? '***' : 'not found',
          accountId: localStorage.getItem('accountId'),
          accountName: localStorage.getItem('accountName'),
          email: localStorage.getItem('email'),
          roleName: localStorage.getItem('roleName')
        });
        
        return { success: true, ...responseData };
      }
      
      return { success: false, message: 'No token received' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    // Clear local storage regardless of response
    localStorage.removeItem('token');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountName');
    localStorage.removeItem('email');
    localStorage.removeItem('roleName');

    return handleResponse(response);
  },

  // Get current user profile
  getCurrentProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get account by ID (String ID)
  getAccountById: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all accounts
  getAllAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update account by ID (String ID)
  updateAccount: async (accountId, accountData) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(accountData)
    });
    return handleResponse(response);
  },

  // Delete account by ID (String ID)
  deleteAccount: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }

    return response.status === 204; // No content response
  },

  // Helper methods for local storage
  getStoredAccountId: () => {
    return localStorage.getItem('accountId'); // Returns String ID
  },

  getStoredAccountName: () => {
    return localStorage.getItem('accountName');
  },

  getStoredEmail: () => {
    return localStorage.getItem('email');
  },

  getStoredRoleName: () => {
    return localStorage.getItem('roleName');
  },

  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

export default accountService;

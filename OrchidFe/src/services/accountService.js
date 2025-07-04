import { apiConfig } from './apiConfig';

const API_BASE_URL = apiConfig.baseURL;

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
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  return response.json();
};

const accountService = {
  // Register a new account
  register: async (registerData) => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(registerData)
    });
    return handleResponse(response);
  },

  // Login
  login: async (loginData) => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(loginData)
    });
    const result = await handleResponse(response);

    // Store token and user info if login successful
    if (result.result && result.result.token) {
      localStorage.setItem('token', result.result.token);
      localStorage.setItem('accountId', result.result.accountId); // String ID
      localStorage.setItem('accountName', result.result.accountName);
      localStorage.setItem('email', result.result.email);
      localStorage.setItem('roleName', result.result.roleName);
    }

    return result;
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/logout`, {
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
    const response = await fetch(`${API_BASE_URL}/api/accounts/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get account by ID (String ID)
  getAccountById: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${accountId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all accounts
  getAllAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update account by ID (String ID)
  updateAccount: async (accountId, accountData) => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${accountId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(accountData)
    });
    return handleResponse(response);
  },

  // Delete account by ID (String ID)
  deleteAccount: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${accountId}`, {
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

import axios from 'axios';

// Use environment variable or fallback to default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_BASE_URL = `${API_URL}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// For backward compatibility
export const apiConfig = {
  baseURL: API_BASE_URL,
  client: apiClient
};

// Add a request interceptor for handling auth token
apiClient.interceptors.request.use(
  (config) => {
    // Skip adding token for login/register requests
    const publicEndpoints = ['/accounts/login', '/accounts/register'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.endsWith(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Adding authorization token to request:', config.url);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No token available for request:', config.url);
        // Optionally redirect to login or handle missing token
        if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
          console.log('Redirecting to login...');
          window.location.href = '/login';
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    });

    if (error.response?.status === 401) {
      console.log('Token might be expired or invalid');
      // Don't automatically remove token here, let components handle it
    }

    return Promise.reject(error);
  }
);

export default apiClient;

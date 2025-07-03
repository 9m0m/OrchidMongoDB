import axios from 'axios';

const API_BASE_URL ='http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for handling auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Adding authorization token to request:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token available for request:', config.url);
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

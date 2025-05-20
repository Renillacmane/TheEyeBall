import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BE_ADDRESS,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login or handle as needed
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

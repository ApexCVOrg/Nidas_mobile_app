import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../redux/store';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error('Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      isNetworkError: !error.response
    });
    
    if (error.response?.status === 401) {
      // Handle token expiration
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 
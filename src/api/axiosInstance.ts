import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../redux/store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOST =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

const api = axios.create({
  baseURL: `${HOST}`,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

console.log('Using baseURL:', api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Try to get token from Redux first
    let token = store.getState().auth.token;
    
    // If no token in Redux, try AsyncStorage
    if (!token) {
      try {
        token = await AsyncStorage.getItem('auth_token');
        console.log('🔍 Token from AsyncStorage:', token ? 'Found' : 'Not found');
      } catch (error) {
        console.error('Error getting token from AsyncStorage:', error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Added Authorization header with token');
    } else {
      console.log('⚠️ No token found for request:', config.url);
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
api.interceptors.response.use(
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

export default api; 
import axios from 'axios';
import { ApiError, ApiResponse } from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

export const apiClient = {
  get: <T>(url: string): Promise<ApiResponse<T>> => 
    api.get(url).then((response) => response.data),
  
  post: <T>(url: string, data: unknown): Promise<ApiResponse<T>> =>
    api.post(url, data).then((response) => response.data),
  
  put: <T>(url: string, data: unknown): Promise<ApiResponse<T>> =>
    api.put(url, data).then((response) => response.data),
  
  delete: <T>(url: string, config: unknown): Promise<ApiResponse<T>> =>
    api.delete(url, config).then((response) => response.data),
};
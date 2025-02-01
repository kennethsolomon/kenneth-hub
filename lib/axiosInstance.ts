import axios, { AxiosInstance } from 'axios';
import { getToken } from '@/services/authService';

const createApiClient = (tokenSource: string, baseURL?: string): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://default-api.example.com',
    timeout: 10000, // Optional: Set a timeout (10s)
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for authentication
  api.interceptors.request.use(
    async (config) => {
      // TODO: Apply logic to handle token expiration
      const token = typeof window !== "undefined" ? localStorage.getItem(tokenSource) : null;
      if (!token) {
        const newToken = await getToken(tokenSource);
        localStorage.setItem(tokenSource, newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for handling errors globally
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized! Redirecting...");
        // Handle logout or redirect logic
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApiClient;
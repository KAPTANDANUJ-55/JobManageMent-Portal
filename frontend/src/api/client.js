// ---------------------------------------------------------------------------
// Universal API Client
// Handles both Mock mode (in-browser DB) and Live mode (Spring Boot backend)
// Controlled by `VITE_USE_MOCKS=true` in .env
// ---------------------------------------------------------------------------
import axios from 'axios';
import { TOKEN_KEY } from '@/utils/constants';
import * as mockHandlers from './mock/handlers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Live Axios client for Spring Boot
const liveClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token if present
liveClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for status handling
liveClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export { USE_MOCKS, liveClient, mockHandlers };
export default liveClient;

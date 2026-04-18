import axios from 'axios';
import { getApiUrl } from '../config/env';
import { AuthStore } from '../stores/auth.store';
import { pinia } from '../main';
import { useToast } from '../composables/useToast';

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// ── Request: attach auth token ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // We need the store instance. Since this is outside setup, 
    // we use the pinia instance if available.
    const store = AuthStore(pinia); 
    const token = store.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: handle 401 & errors ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const toast = useToast();
    
    if (error.response?.status === 401) {
      const store = AuthStore(pinia);
      store.clearSession();
      // Optionally redirect: window.location.href = '/login';
    } else {
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default api;

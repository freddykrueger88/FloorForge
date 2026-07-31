import axios from 'axios';

/**
 * FloorForge – Axios API Client
 * Zentraler HTTP-Client mit JWT-Interceptor
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor – JWT Token anhängen
api.interceptors.request.use(
  (config) => {
    // Token aus Zustand-Store holen (zirkularer Import vermeiden via window)
    const token = window.__floorforgeToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – 401 behandeln
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session abgelaufen – zur Login-Seite weiterleiten
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// 401 → zur Login-Seite (außer bei Login/Register selbst – dort ist 401 eine
// normale "falsche Zugangsdaten"-Antwort, kein abgelaufenes Session-Cookie)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => err.config?.url?.includes(p));
    if (err.response?.status === 401 && !isAuthEndpoint) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

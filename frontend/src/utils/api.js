import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// 401 → zur Login-Seite (außer bei Login/Register/Me selbst – dort ist 401
// eine normale Antwort ("falsche Zugangsdaten" bzw. "nicht eingeloggt"),
// kein abgelaufenes Session-Cookie mitten in der Nutzung). Bugfix: /auth/me
// lief bisher über denselben Redirect – App.jsx ruft fetchMe() bei JEDEM
// Seiten-Mount auf, auch auf /login und /register. Für einen nicht
// eingeloggten Besucher direkt auf /login lieferte das einen 401, der
// Interceptor hat per window.location.href auf /login "umgeleitet" – ein
// harter Reload derselben Seite, der fetchMe() erneut auslöst: Endlosschleife
// aus Seiten-Reloads, bis der allgemeine Rate-Limiter mit 429 abbricht
// (auf das der Interceptor nicht reagiert). authStore.fetchMe() fängt ein
// 401 hier bereits selbst ab und setzt user: null, die bestehenden Route-
// Guards (PrivateRoute/PublicRoute) reagieren darauf ohne Reload.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/me'];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => err.config?.url?.includes(p));
    const alreadyOnLogin = window.location.pathname === '/login';
    if (err.response?.status === 401 && !isAuthEndpoint && !alreadyOnLogin) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

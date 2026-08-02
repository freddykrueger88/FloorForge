/**
 * apiFetch – Gemeinsamer fetch-Wrapper für alle Hook-basierten API-Aufrufe
 * (Boards, Frames, Lines). Leitet bei 401 zum Login um (Session abgelaufen),
 * analog zum Axios-Interceptor in utils/api.js – außer bei Login/Register
 * selbst, wo ein 401 lediglich falsche Zugangsdaten bedeutet.
 */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  const json = await res.json();

  if (!res.ok) {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => url.includes(p));
    if (res.status === 401 && !isAuthEndpoint) {
      window.location.href = '/login';
    }
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json.data;
}

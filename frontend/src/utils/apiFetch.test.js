import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch } from './apiFetch.js';

const originalLocation = window.location;
const originalFetch = globalThis.fetch;

function mockFetchResponse(status, body) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('apiFetch (Bugfix: Reload-Loop bei 401 für nicht eingeloggte Besucher)', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { ...originalLocation, pathname: '/boards', href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
    globalThis.fetch = originalFetch;
  });

  it('leitet bei 401 auf einer geschützten Route zur Login-Seite um', async () => {
    mockFetchResponse(401, { success: false, message: 'Nicht eingeloggt' });
    await apiFetch('/api/boards').catch(() => {});
    expect(window.location.href).toBe('/login');
  });

  it('leitet NICHT erneut um, wenn bereits auf /login (verhindert Reload-Loop, z.B. durch einen global gemounteten Hook, der unbedingt beim Mount fetcht)', async () => {
    window.location.pathname = '/login';
    mockFetchResponse(401, { success: false, message: 'Nicht eingeloggt' });
    await apiFetch('/api/settings').catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei 401 auf /auth/login NICHT um (falsche Zugangsdaten sind keine abgelaufene Session)', async () => {
    mockFetchResponse(401, { success: false, message: 'Falsches Passwort' });
    await apiFetch('/api/auth/login', { method: 'POST' }).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei 401 auf /auth/register NICHT um', async () => {
    mockFetchResponse(401, { success: false, message: 'E-Mail bereits vergeben' });
    await apiFetch('/api/auth/register', { method: 'POST' }).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei anderen Fehlercodes (z.B. 429) nicht um', async () => {
    mockFetchResponse(429, { success: false, message: 'Zu viele Anfragen' });
    await apiFetch('/api/boards').catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('liefert bei Erfolg json.data ohne Umleitung', async () => {
    mockFetchResponse(200, { success: true, data: { foo: 'bar' } });
    const result = await apiFetch('/api/boards');
    expect(result).toEqual({ foo: 'bar' });
    expect(window.location.href).toBe('');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../utils/api.js';
import useAuthStore from './authStore.js';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false });
    vi.clearAllMocks();
  });

  it('startet ohne eingeloggten Nutzer', () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('fetchMe setzt den Nutzer bei Erfolg', async () => {
    api.get.mockResolvedValueOnce({ data: { data: { user: { id: '1', email: 'a@b.de' } } } });

    await useAuthStore.getState().fetchMe();

    expect(useAuthStore.getState().user).toEqual({ id: '1', email: 'a@b.de' });
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('fetchMe räumt den Nutzer bei einem Fehler (z.B. abgelaufene Session) auf', async () => {
    useAuthStore.setState({ user: { id: '1' } });
    api.get.mockRejectedValueOnce(new Error('401'));

    await useAuthStore.getState().fetchMe();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('logout setzt den Nutzer auch dann zurück, wenn der Server-Call fehlschlägt', async () => {
    useAuthStore.setState({ user: { id: '1' } });
    api.post.mockRejectedValueOnce(new Error('network error'));

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
  });
});

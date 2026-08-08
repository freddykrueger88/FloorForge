/**
 * useLibraryApi – API-Hook für die Community-Übungsbibliothek (EPIC 010 MVP)
 * Struktur analog useBoardsApi.js
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = '/api/library';

export function useLibraryApi() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState(null);

  const request = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLibrary = useCallback(({ category = '', search = '' } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request(() => apiFetch(`${BASE}${qs ? `?${qs}` : ''}`));
  }, [request]);

  const fetchEntry = useCallback((id) =>
    request(() => apiFetch(`${BASE}/${id}`)), [request]);

  const cloneEntry = useCallback((id) =>
    request(() => apiFetch(`${BASE}/${id}/clone`, { method: 'POST' })), [request]);

  const reportEntry = useCallback((id, reason = '') =>
    request(() => apiFetch(`${BASE}/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) })), [request]);

  const deleteEntry = useCallback((id) =>
    request(() => apiFetch(`${BASE}/${id}`, { method: 'DELETE' })), [request]);

  return { loading, error, fetchLibrary, fetchEntry, cloneEntry, reportEntry, deleteEntry };
}

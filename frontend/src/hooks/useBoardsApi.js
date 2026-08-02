/**
 * useBoardsApi – API-Hook für alle Board-Operationen
 * Kapselt fetch-Aufrufe, Loading- & Error-State
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = '/api/boards';

export function useBoardsApi() {
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

  const fetchBoards  = useCallback(() =>
    request(() => apiFetch(BASE)), [request]);

  const fetchBoard   = useCallback((id) =>
    request(() => apiFetch(`${BASE}/${id}`)), [request]);

  const createBoard  = useCallback((data) =>
    request(() => apiFetch(BASE, { method: 'POST', body: JSON.stringify(data) })), [request]);

  const updateBoard  = useCallback((id, data) =>
    request(() => apiFetch(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })), [request]);

  const deleteBoard  = useCallback((id) =>
    request(() => apiFetch(`${BASE}/${id}`, { method: 'DELETE' })), [request]);

  return { loading, error, fetchBoards, fetchBoard, createBoard, updateBoard, deleteBoard };
}

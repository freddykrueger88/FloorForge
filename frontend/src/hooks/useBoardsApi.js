/**
 * useBoardsApi – API-Hook für alle Board-Operationen
 * Kapselt fetch-Aufrufe, Loading- & Error-State
 */
import { useState, useCallback } from 'react';

const BASE = '/api/boards';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // Auth-Cookie muss auch cross-origin (Vite :5173 → API :3001) mitgeschickt werden
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json.data;
}

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

/**
 * useAiApi – API-Hook für den KI-Trainingsassistenten (EPIC 010 MVP)
 * Struktur analog useLibraryApi.js
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = '/api/ai';

export function useAiApi() {
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

  const fetchStatus = useCallback(() =>
    request(() => apiFetch(`${BASE}/status`)), [request]);

  const generateTrainingPlan = useCallback((params) =>
    request(() => apiFetch(`${BASE}/training-plan`, { method: 'POST', body: JSON.stringify(params) })), [request]);

  return { loading, error, fetchStatus, generateTrainingPlan };
}

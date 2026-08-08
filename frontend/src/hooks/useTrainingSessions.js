/**
 * useTrainingSessions – API-Hook für Trainingseinheiten (Issue #45)
 * Kapselt fetch-Aufrufe, Loading- & Error-State, analog useBoardsApi.js.
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = '/api/trainings';
const MAX_SESSIONS = 20;

export function useTrainingSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState(null);

  const request = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(() =>
    request(async () => setSessions(await apiFetch(BASE))), [request]);

  // EPIC 010 – KI-Trainingsassistent: optionale zusätzliche Felder (notes,
  // goal), damit "Als Trainingseinheit übernehmen" ein einzelner Request
  // ist statt Create+Update.
  const createSession = useCallback((name, teamId = null, extra = {}) =>
    request(async () => {
      const newSession = await apiFetch(BASE, { method: 'POST', body: JSON.stringify({ name, teamId, ...extra }) });
      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    }), [request]);

  const renameSession = useCallback((id, name) =>
    request(async () => {
      const updated = await apiFetch(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
      setSessions((prev) => prev.map((s) => s._id === id ? updated : s));
      return updated;
    }), [request]);

  const deleteSession = useCallback((id) =>
    request(async () => {
      await apiFetch(`${BASE}/${id}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s._id !== id));
    }), [request]);

  return {
    sessions, loading, error,
    fetchSessions, createSession, renameSession, deleteSession,
    canAddSession: sessions.length < MAX_SESSIONS,
  };
}

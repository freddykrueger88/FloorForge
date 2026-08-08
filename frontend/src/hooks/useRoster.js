/**
 * useRoster – API-Hook für den zentralen Team-Kader (Issue #53)
 * Kapselt fetch-Aufrufe, Loading- & Error-State, analog usePlaybooks.js.
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = '/api/roster';
const MAX_ROSTER_PLAYERS = 40;

export function useRoster() {
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [loading,       setLoading      ] = useState(false);
  const [error,         setError        ] = useState(null);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(BASE);
      setRosterPlayers(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addRosterPlayer = useCallback(async ({ name, jerseyNumber, role, teamId }) => {
    try {
      const newPlayer = await apiFetch(BASE, {
        method: 'POST',
        body: JSON.stringify({ name, jerseyNumber, role, teamId }),
      });
      setRosterPlayers((prev) => [...prev, newPlayer]);
      return newPlayer;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Offline-Konflikterkennung (siehe offlineSync.js), analog useBoardsApi.js:
  // der Aufrufer kennt den aktuell geladenen player.updatedAt/player.name,
  // dieser Hook selbst hält keinen Baseline-State.
  const updateRosterPlayer = useCallback(async (id, patch, { baselineUpdatedAt = null, label = null } = {}) => {
    try {
      const updated = await apiFetch(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(patch) }, {
        baselineUpdatedAt, conflictCheckUrl: `${BASE}/${id}`, label,
      });
      setRosterPlayers((prev) => prev.map((p) => p._id === id ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteRosterPlayer = useCallback(async (id, { baselineUpdatedAt = null, label = null } = {}) => {
    try {
      await apiFetch(`${BASE}/${id}`, { method: 'DELETE' }, {
        baselineUpdatedAt, conflictCheckUrl: `${BASE}/${id}`, label,
      });
      setRosterPlayers((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    rosterPlayers, loading, error,
    fetchRoster, addRosterPlayer, updateRosterPlayer, deleteRosterPlayer,
    canAddRosterPlayer: rosterPlayers.length < MAX_ROSTER_PLAYERS,
  };
}

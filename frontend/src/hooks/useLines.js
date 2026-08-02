/**
 * useLines – State-Management für Lines (Sturm-/Defensivreihen)
 * (Issue #12 – v0.4.0)
 */
import { useState, useCallback } from 'react';

const BASE = (boardId) => `/api/boards/${boardId}/lines`;

async function apiFetch(url, options = {}) {
  const res  = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json.data;
}

export function useLines(boardId) {
  const [lines,        setLines       ] = useState([]);
  const [activeLineId, setActiveLineId] = useState(null);
  const [loading,      setLoading     ] = useState(false);
  const [error,        setError       ] = useState(null);

  const loadLines = useCallback(async (initialActiveLineId = null) => {
    if (!boardId) return;
    setLoading(true);
    try {
      const data = await apiFetch(BASE(boardId));
      setLines(data);
      setActiveLineId(initialActiveLineId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const addLine = useCallback(async (name, color = '#facc15', type = 'offense') => {
    try {
      const newLine = await apiFetch(BASE(boardId), {
        method: 'POST',
        body: JSON.stringify({ name, color, type, playerIds: [] }),
      });
      setLines((prev) => [...prev, newLine]);
      return newLine;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [boardId]);

  const updateLine = useCallback(async (lineId, patch) => {
    try {
      const updated = await apiFetch(`${BASE(boardId)}/${lineId}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      });
      setLines((prev) => prev.map((l) => (l._id === lineId ? updated : l)));
    } catch (err) {
      setError(err.message);
    }
  }, [boardId]);

  const deleteLine = useCallback(async (lineId) => {
    try {
      await apiFetch(`${BASE(boardId)}/${lineId}`, { method: 'DELETE' });
      setLines((prev) => prev.filter((l) => l._id !== lineId));
      setActiveLineId((prev) => (prev === lineId ? null : prev));
    } catch (err) {
      setError(err.message);
    }
  }, [boardId]);

  // Spieler einer Line zu-/abwählen (Toggle per Klick auf Spieler-Icon)
  const togglePlayerInLine = useCallback(async (lineId, playerId) => {
    const line = lines.find((l) => l._id === lineId);
    if (!line) return;
    const already = line.playerIds.includes(playerId);
    const nextPlayerIds = already
      ? line.playerIds.filter((id) => id !== playerId)
      : [...line.playerIds, playerId];
    await updateLine(lineId, { playerIds: nextPlayerIds });
  }, [lines, updateLine]);

  // Aktive Line umschalten (nur lokal + synchron mit Server, ohne Ladeanimation)
  const setActiveLine = useCallback(async (lineId) => {
    setActiveLineId(lineId);
    try {
      await apiFetch(`${BASE(boardId)}/active`, {
        method: 'PUT',
        body: JSON.stringify({ lineId }),
      });
    } catch (err) {
      setError(err.message);
    }
  }, [boardId]);

  const activeLine = lines.find((l) => l._id === activeLineId) ?? null;

  return {
    lines, activeLine, activeLineId,
    loading, error,
    loadLines, addLine, updateLine, deleteLine,
    togglePlayerInLine, setActiveLine,
    canAddLine: lines.length < 10,
  };
}

/**
 * useFrames – Frame State-Management
 *
 * Features:
 *   - Frames laden, hinzufügen, aktualisieren, löschen
 *   - Aktiven Frame wechseln
 *   - Drag & Drop Reihenfolge ändern
 *   - Neuen Frame aus aktuellem Zustand kopieren
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = (boardId) => `/api/boards/${boardId}/frames`;

export function useFrames(boardId) {
  const [frames,       setFrames      ] = useState([]);
  const [activeIndex,  setActiveIndex ] = useState(0);
  const [loading,      setLoading     ] = useState(false);
  const [error,        setError       ] = useState(null);

  const activeFrame = frames[activeIndex] ?? null;

  // ── Laden ──
  const loadFrames = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const data = await apiFetch(BASE(boardId));
      setFrames(data);
      setActiveIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // ── Frame hinzufügen (kopiert aktuellen Zustand) ──
  const addFrame = useCallback(async (currentPlayers, currentElements, label = '') => {
    setLoading(true);
    try {
      const newFrame = await apiFetch(BASE(boardId), {
        method: 'POST',
        body: JSON.stringify({ players: currentPlayers, elements: currentElements, label }),
      });
      setFrames((prev) => [...prev, newFrame]);
      setActiveIndex((prev) => prev + 1); // Neuer Frame direkt aktiv
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // ── Frame aktualisieren (Spieler/Elemente speichern) ──
  const updateFrame = useCallback(async (frameId, patch) => {
    try {
      const updated = await apiFetch(`${BASE(boardId)}/${frameId}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      });
      setFrames((prev) => prev.map((f) => f._id === frameId ? updated : f));
    } catch (err) {
      setError(err.message);
    }
  }, [boardId]);

  // ── Frame löschen ──
  const deleteFrame = useCallback(async (frameId) => {
    try {
      await apiFetch(`${BASE(boardId)}/${frameId}`, { method: 'DELETE' });
      setFrames((prev) => {
        const next = prev.filter((f) => f._id !== frameId);
        setActiveIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [boardId]);

  // ── Drag & Drop Reihenfolge ──
  const reorderFrames = useCallback(async (newOrder) => {
    // newOrder: Array von Frame-Objekten in neuer Reihenfolge
    const ids = newOrder.map((f) => f._id);
    setFrames(newOrder); // Optimistic update
    try {
      await apiFetch(`${BASE(boardId)}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ order: ids }),
      });
    } catch (err) {
      setError(err.message);
      await loadFrames(); // Rollback bei Fehler
    }
  }, [boardId, loadFrames]);

  // ── Aktiven Frame per Tastatur wechseln ──
  const goToFrame = useCallback((index) => {
    setActiveIndex(Math.max(0, Math.min(index, frames.length - 1)));
  }, [frames.length]);

  const goNext = useCallback(() => goToFrame(activeIndex + 1), [activeIndex, goToFrame]);
  const goPrev = useCallback(() => goToFrame(activeIndex - 1), [activeIndex, goToFrame]);

  return {
    frames, activeFrame, activeIndex,
    loading, error,
    loadFrames, addFrame, updateFrame, deleteFrame, reorderFrames,
    goToFrame, goNext, goPrev,
    canGoNext: activeIndex < frames.length - 1,
    canGoPrev: activeIndex > 0,
    frameCount: frames.length,
  };
}

/**
 * useFrames – Frame State-Management
 *
 * Features:
 *   - Frames laden, hinzufügen, aktualisieren, löschen
 *   - Aktiven Frame wechseln
 *   - Drag & Drop Reihenfolge ändern
 *   - Neuen Frame aus aktuellem Zustand kopieren
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch.js';
import { ensureBall } from '../constants/fieldConfig.js';

const BASE = (boardId) => `/api/boards/${boardId}/frames`;

// ROADMAP-Backlog "beweglicher Ball": ältere, vor diesem Feature
// gespeicherte Frames haben noch keinen Ball-Eintrag in players –
// hier einmalig beim Laden ergänzen, statt an jeder Lesestelle
// (Live-Editing, Animation-Interpolation) separat abzufangen.
function withBall(frame, fieldType) {
  return { ...frame, players: ensureBall(frame.players ?? [], fieldType) };
}

// ROADMAP Phase 4 (boardName optional): dient nur der Anzeige im
// ConflictReviewDialog, keine funktionale Abhängigkeit.
export function useFrames(boardId, fieldType = 'large', boardName = '') {
  const [frames,       setFrames      ] = useState([]);
  const [activeIndex,  setActiveIndex ] = useState(0);
  const [loading,      setLoading     ] = useState(false);
  const [error,        setError       ] = useState(null);

  const activeFrame = frames[activeIndex] ?? null;

  // ROADMAP Phase 4: aktuellen Frame-Stand für die Konflikt-Baseline
  // lesen, ohne dass updateFrame/deleteFrame bei jeder Frame-Änderung
  // neu erzeugt werden müssen (kein `frames` in deren Dependency-Array).
  const framesRef = useRef(frames);
  useEffect(() => { framesRef.current = frames; }, [frames]);

  const frameLabel = useCallback((frameId) => {
    const frame = framesRef.current.find((f) => f._id === frameId);
    const position = `Frame ${(frame?.order ?? 0) + 1}`;
    return boardName ? `${boardName} – ${position}` : position;
  }, [boardName]);

  // ── Laden ──
  const loadFrames = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const data = await apiFetch(BASE(boardId));
      setFrames(data.map((f) => withBall(f, fieldType)));
      setActiveIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId, fieldType]);

  // ── Frame hinzufügen (kopiert aktuellen Zustand) ──
  const addFrame = useCallback(async (currentPlayers, currentElements, label = '') => {
    setLoading(true);
    try {
      const newFrame = await apiFetch(BASE(boardId), {
        method: 'POST',
        body: JSON.stringify({ players: currentPlayers, elements: currentElements, label }),
      });
      setFrames((prev) => [...prev, withBall(newFrame, fieldType)]);
      setActiveIndex((prev) => prev + 1); // Neuer Frame direkt aktiv
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId, fieldType]);

  // ── Frame aktualisieren (Spieler/Elemente speichern) ──
  const updateFrame = useCallback(async (frameId, patch) => {
    try {
      const baseline = framesRef.current.find((f) => f._id === frameId);
      const updated = await apiFetch(`${BASE(boardId)}/${frameId}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      }, {
        baselineUpdatedAt: baseline?.updatedAt ?? null,
        conflictCheckUrl:  BASE(boardId),
        resourceId:        frameId,
        label:             frameLabel(frameId),
      });
      setFrames((prev) => prev.map((f) => f._id === frameId ? withBall(updated, fieldType) : f));
    } catch (err) {
      setError(err.message);
    }
  }, [boardId, fieldType, frameLabel]);

  // ── Frame löschen ──
  const deleteFrame = useCallback(async (frameId) => {
    try {
      const baseline = framesRef.current.find((f) => f._id === frameId);
      await apiFetch(`${BASE(boardId)}/${frameId}`, { method: 'DELETE' }, {
        baselineUpdatedAt: baseline?.updatedAt ?? null,
        conflictCheckUrl:  BASE(boardId),
        resourceId:        frameId,
        label:             frameLabel(frameId),
      });
      setFrames((prev) => {
        const next = prev.filter((f) => f._id !== frameId);
        setActiveIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [boardId, frameLabel]);

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

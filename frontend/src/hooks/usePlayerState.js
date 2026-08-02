/**
 * usePlayerState – Verwaltet Spielerpositionen auf dem Feld
 *
 * Features:
 *   - Initialisierung aus fieldConfig-Defaults
 *   - Drag & Drop (Position updaten)
 *   - Auswahl (selectedId)
 *   - Einzeln oder alle zurücksetzen
 *   - Feldgrenzen-Clamping
 */
import { useState, useCallback } from 'react';
import { IFF_FIELDS, buildDefaultPlayers } from '../constants/fieldConfig.js';

export function usePlayerState(fieldType = 'large') {
  const field          = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const [players,     setPlayers]     = useState(() => buildDefaultPlayers(fieldType));
  const [selectedId,  setSelectedId]  = useState(null);
  // Issue #29 – Spielername auf Token
  const [showNames,    setShowNames]    = useState(false);
  const [namePosition, setNamePosition] = useState('unten'); // 'oben' | 'unten'

  const toggleShowNames = useCallback(() => setShowNames((v) => !v), []);

  // Spielfeld wechseln → Positionen neu initialisieren
  const resetForField = useCallback((newFieldType) => {
    setPlayers(buildDefaultPlayers(newFieldType));
    setSelectedId(null);
  }, []);

  // Drag-Ende: Position updaten + Feldgrenzen einhalten
  const updatePosition = useCallback((id, rawX, rawY) => {
    setPlayers((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const margin = 0.8; // Meter Abstand zur Bande
      return {
        ...p,
        x: Math.max(margin, Math.min(field.width  - margin, rawX)),
        y: Math.max(margin, Math.min(field.height - margin, rawY)),
      };
    }));
  }, [field]);

  // Einen Spieler zurücksetzen
  const resetPlayer = useCallback((id) => {
    const defaults = buildDefaultPlayers(fieldType);
    const original = defaults.find((p) => p.id === id);
    if (!original) return;
    setPlayers((prev) => prev.map((p) => p.id === id ? original : p));
  }, [fieldType]);

  // Alle Spieler zurücksetzen
  const resetAllPlayers = useCallback(() => {
    setPlayers(buildDefaultPlayers(fieldType));
    setSelectedId(null);
  }, [fieldType]);

  // Spielernamen zuweisen (Issue #29) – leerer Name entfernt das Label wieder
  const setPlayerName = useCallback((id, name) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name: name?.trim() ?? '' } : p)));
  }, []);

  // Auswahl
  const selectPlayer = useCallback((id) => {
    setSelectedId((prev) => prev === id ? null : id);
  }, []);

  const selectedPlayer = players.find((p) => p.id === selectedId) ?? null;

  return {
    players,
    selectedId,
    selectedPlayer,
    selectPlayer,
    updatePosition,
    resetPlayer,
    resetAllPlayers,
    resetForField,
    setPlayerName,
    showNames, setShowNames, toggleShowNames,
    namePosition, setNamePosition,
  };
}

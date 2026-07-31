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
import { IFF_FIELDS, DEFAULT_POSITIONS_LARGE } from '../constants/fieldConfig.js';

// Standard-Positionen je Feldtyp
const DEFAULT_POSITIONS = {
  large:        DEFAULT_POSITIONS_LARGE,
  small:        buildMirroredPositions(4, 14, 24),
  street:       buildMirroredPositions(3, 10, 20),
  threeVsThree: buildMirroredPositions(3, 9, 18),
};

function buildMirroredPositions(count, fieldHeight, fieldWidth) {
  const mid = fieldHeight / 2;
  const homeBase = [
    { id: 'h1', role: 'TW', x: fieldWidth * 0.07,  y: mid },
    { id: 'h2', role: 'V',  x: fieldWidth * 0.20,  y: mid - mid * 0.35 },
    { id: 'h3', role: 'V',  x: fieldWidth * 0.20,  y: mid + mid * 0.35 },
    { id: 'h4', role: 'M',  x: fieldWidth * 0.38,  y: mid },
    { id: 'h5', role: 'S',  x: fieldWidth * 0.50,  y: mid - mid * 0.3  },
    { id: 'h6', role: 'S',  x: fieldWidth * 0.50,  y: mid + mid * 0.3  },
  ].slice(0, count + 1); // +1 für TW

  const awayBase = homeBase.map((p) => ({
    ...p,
    id: p.id.replace('h', 'a'),
    x: fieldWidth - p.x,
  }));

  return { home: homeBase, away: awayBase };
}

// Spieler-Array aus Config aufbauen
function buildPlayers(fieldType) {
  const positions = DEFAULT_POSITIONS[fieldType] ?? DEFAULT_POSITIONS.large;
  const home = (positions.home ?? []).map((p) => ({ ...p, team: 'home' }));
  const away = (positions.away ?? []).map((p) => ({ ...p, team: 'away' }));
  return [...home, ...away];
}

export function usePlayerState(fieldType = 'large') {
  const field          = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const [players,     setPlayers]     = useState(() => buildPlayers(fieldType));
  const [selectedId,  setSelectedId]  = useState(null);

  // Spielfeld wechseln → Positionen neu initialisieren
  const resetForField = useCallback((newFieldType) => {
    setPlayers(buildPlayers(newFieldType));
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
    const defaults = buildPlayers(fieldType);
    const original = defaults.find((p) => p.id === id);
    if (!original) return;
    setPlayers((prev) => prev.map((p) => p.id === id ? original : p));
  }, [fieldType]);

  // Alle Spieler zurücksetzen
  const resetAllPlayers = useCallback(() => {
    setPlayers(buildPlayers(fieldType));
    setSelectedId(null);
  }, [fieldType]);

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
  };
}

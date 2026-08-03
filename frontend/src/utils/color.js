/**
 * color – Hilfsfunktionen für Team-/Ballfarben (Issue #33 – Fix zu #14)
 *
 * Team-Farben werden als einzelner Hex-String persistiert (analog zu
 * ballColor). Für Konva (FloorballField.jsx/FloorballFieldStatic.js)
 * brauchen wir zusätzlich eine Randfarbe – die wird hier abgeleitet statt
 * mitgespeichert zu werden.
 */

// Verdunkelt einen Hex-Farbwert um `amount` (0..1) – für die Randfarbe
export function darkenHex(hex, amount = 0.25) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return hex;
  const num = parseInt(m[1], 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Ältere/fehlerhafte Datensätze (Issue #33) können ein stringifiziertes
// {fill,stroke}-Objekt statt eines reinen Hex-Strings enthalten – defensiv
// abfangen und nur den fill-Wert übernehmen.
export function normalizeStoredColor(raw) {
  if (!raw) return null;
  if (typeof raw === 'string' && raw.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(raw);
      return obj.fill ?? null;
    } catch {
      return null;
    }
  }
  return raw;
}

// Baut das {fill, stroke}-Objekt, das FloorballField/FloorballFieldStatic/
// PlayerToken erwarten, aus einem persistierten (ggf. fehlerhaften) Wert.
export function teamColorToFillStroke(raw, fallback) {
  const fill = normalizeStoredColor(raw) ?? fallback;
  return { fill, stroke: darkenHex(fill) };
}

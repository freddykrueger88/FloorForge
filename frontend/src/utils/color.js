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

// Mischt zwei Hex-Farben (ratio=0 → reines hexA, ratio=1 → reines hexB) –
// Grundlage für lightenHex() unten und für abgeleitete Custom-Theme-Töne
// (UI/UX-Audit, Stufe 5), die je nach gewähltem Hintergrund heller ODER
// dunkler wirken müssen, nicht immer in dieselbe Richtung wie bei den
// festen Presets.
function mixHex(hexA, hexB, ratio) {
  const parse = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
    return m ? parseInt(m[1], 16) : null;
  };
  const a = parse(hexA);
  const b = parse(hexB);
  if (a === null || b === null) return hexA;
  const mix = (shift) => {
    const va = (a >> shift) & 0xff;
    const vb = (b >> shift) & 0xff;
    return Math.max(0, Math.min(255, Math.round(va + (vb - va) * ratio)));
  };
  const r = mix(16), g = mix(8), bl = mix(0);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

// Hellt einen Hex-Farbwert um `amount` (0..1) Richtung Weiß auf – Pendant
// zu darkenHex() oben (das nur verdunkelt, ein negativer amount dort würde
// bei hellen Ausgangsfarben über 255 hinaus überlaufen).
export function lightenHex(hex, amount = 0.25) {
  return mixHex(hex, '#ffffff', amount);
}

// Grobe Helligkeits-Einschätzung (0..1, relative Luminanz-Näherung) –
// entscheidet bei abgeleiteten Custom-Theme-Tönen, ob z.B. der Hover-Ton
// heller oder dunkler als der Hintergrund wirken soll.
export function isLightColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return false;
  const num = parseInt(m[1], 16);
  const r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
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

// UI/UX-Audit, Stufe 5 (Custom-Theme-Erstellung): leitet aus den vier vom
// Nutzer gewählten Basisfarben (primary/bg/surface/text) das komplette
// Set an CSS-Custom-Properties ab, das die vier festen Presets in
// tokens.css jeweils manuell definieren – bewusst NUR vier Farbwähler in
// der UI, nicht zwanzig. Semantische Farben (Fehler/Erfolg/Warnung/Info)
// werden NICHT aus der Nutzerfarbe abgeleitet (Rot soll immer Rot bleiben,
// unabhängig von der Markenfarbe) – stattdessen wird abhängig von der
// Helligkeit des gewählten Hintergrunds dasselbe Set wiederverwendet, das
// auch das "dark"- bzw. "light"-Preset in tokens.css nutzt.
export function deriveCustomThemeTokens({ primary, bg, surface, text }) {
  const bgIsLight = isLightColor(bg);
  const semantics = bgIsLight
    ? { error: '#d1242f', errorHover: '#e0353f', errorHighlight: '#fff0ee', success: '#1a7f37', warning: '#9a6700', warningHover: '#b17d00', info: '#0969da' }
    : { error: '#f85149', errorHover: '#ff6b63', errorHighlight: '#3d1f1f', success: '#3fb950', warning: '#d29922', warningHover: '#e6ac3d', info: '#58a6ff' };

  return {
    '--color-bg': bg,
    '--color-surface': surface,
    '--color-surface-2': mixHex(surface, text, 0.08),
    '--color-surface-offset': mixHex(surface, text, 0.16),
    '--color-surface-dynamic': mixHex(surface, text, 0.28),
    '--color-surface-offset-2': mixHex(surface, text, 0.22),
    '--color-divider': mixHex(surface, text, 0.12),
    '--color-border': mixHex(surface, text, 0.2),
    '--color-text': text,
    '--color-text-muted': mixHex(text, bg, 0.35),
    '--color-text-faint': mixHex(text, bg, 0.6),
    '--color-text-inverse': isLightColor(primary) ? '#1a1a1a' : '#ffffff',
    '--color-primary': primary,
    '--color-primary-hover': lightenHex(primary, 0.15),
    '--color-primary-active': darkenHex(primary, 0.15),
    '--color-primary-highlight': mixHex(primary, bg, 0.85),
    '--color-error':           semantics.error,
    '--color-error-hover':     semantics.errorHover,
    '--color-error-highlight': semantics.errorHighlight,
    '--color-success':         semantics.success,
    '--color-warning':         semantics.warning,
    '--color-warning-hover':   semantics.warningHover,
    '--color-info':            semantics.info,
  };
}

// Echtzeit-Co-Editing (ROADMAP-Backlog): deterministische, aber "zufällig"
// wirkende Farbe pro Nutzer-ID für Live-Cursor-Anzeigen – ohne Server-
// Zustand dafür zu brauchen, jeder Client leitet dieselbe Farbe für
// dieselbe userId unabhängig ab.
export function hashUserColor(userId) {
  let hash = 0;
  const str = String(userId ?? '');
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

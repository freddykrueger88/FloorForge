import { create } from 'zustand';
import { deriveCustomThemeTokens } from '../utils/color.js';

const THEMES = ['dark', 'light', 'vikings', 'iff', 'custom'];

// UI/UX-Audit, Stufe 5: Default-Startwerte fürs Farbwähler-Formular, bevor
// der Nutzer zum ersten Mal eigene Farben gewählt hat – bewusst identisch
// zum dark-Preset, damit "Eigenes Theme" ohne weiteres Zutun erstmal genau
// wie das Standard-Theme aussieht.
const DEFAULT_CUSTOM_COLORS = { primary: '#ff7a1a', bg: '#0f1117', surface: '#161b22', text: '#e6edf3' };

function readStoredCustomColors() {
  try {
    const raw = localStorage.getItem('openfloorball-custom-theme');
    return raw ? { ...DEFAULT_CUSTOM_COLORS, ...JSON.parse(raw) } : DEFAULT_CUSTOM_COLORS;
  } catch {
    return DEFAULT_CUSTOM_COLORS;
  }
}

const CUSTOM_TOKEN_KEYS = [
  '--color-bg', '--color-surface', '--color-surface-2', '--color-surface-offset',
  '--color-surface-dynamic', '--color-surface-offset-2', '--color-divider', '--color-border',
  '--color-text', '--color-text-muted', '--color-text-faint', '--color-text-inverse',
  '--color-primary', '--color-primary-hover', '--color-primary-active', '--color-primary-highlight',
  '--color-error', '--color-error-hover', '--color-error-highlight',
  '--color-success', '--color-warning', '--color-warning-hover', '--color-info',
];

// Trägt die abgeleiteten Custom-Farben als Inline-Styles auf <html> ein –
// Inline-Styles gewinnen gegen die [data-theme="..."]-Regeln in tokens.css,
// überschreiben also gezielt nur die Custom-Properties, alles andere
// (Radien, Schatten, Schrift, Spacing) bleibt vom regulären Token-System.
function applyCustomTokens(colors) {
  const tokens = deriveCustomThemeTokens(colors);
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function clearCustomTokens() {
  CUSTOM_TOKEN_KEYS.forEach((key) => document.documentElement.style.removeProperty(key));
}

const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('openfloorball-theme') || 'dark',
  themes: THEMES,
  customColors: readStoredCustomColors(),
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'custom') {
      applyCustomTokens(get().customColors);
    } else {
      // Sonst würden die Inline-Custom-Properties (höhere Spezifität als
      // die [data-theme]-Regeln) in ein anderes Theme "durchbluten".
      clearCustomTokens();
    }
    localStorage.setItem('openfloorball-theme', theme);
    set({ theme });
  },
  setCustomColors: (colors) => {
    const next = { ...get().customColors, ...colors };
    localStorage.setItem('openfloorball-custom-theme', JSON.stringify(next));
    set({ customColors: next });
    // Live-Vorschau: sofort anwenden, wenn "Eigenes Theme" gerade aktiv ist
    // (kein separater "Anwenden"-Klick nötig, konsistent mit dem
    // bestehenden sofort wirksamen Theme-Wechsel).
    if (get().theme === 'custom') applyCustomTokens(next);
  },
}));

export default useThemeStore;

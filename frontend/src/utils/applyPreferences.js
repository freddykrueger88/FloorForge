/**
 * applyPreferences – Wendet geladene User-Settings global als
 * document-Attribute an (Issue #18: Darstellung & Barrierefreiheit)
 */
import useThemeStore from '../store/themeStore.js';

export function applyGlobalPreferences(prefs = {}) {
  const root = document.documentElement;

  if (prefs.theme) useThemeStore.getState().setTheme(prefs.theme);

  root.setAttribute('data-font-size', prefs.fontSize || 'mittel');
  root.setAttribute('data-reduced-motion', String(!!prefs.reducedMotion));
  root.setAttribute('data-high-contrast', String(!!prefs.highContrast));
  root.setAttribute('data-adhd-mode', String(!!prefs.adhdMode));

  if (prefs.colorBlindMode && prefs.colorBlindMode !== 'keine') {
    root.setAttribute('data-colorblind-mode', prefs.colorBlindMode);
  } else {
    root.removeAttribute('data-colorblind-mode');
  }
}

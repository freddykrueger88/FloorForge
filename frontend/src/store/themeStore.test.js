import { describe, it, expect, beforeEach } from 'vitest';
import useThemeStore from './themeStore.js';

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('fällt ohne gespeicherten Wert auf das dunkle Theme zurück', () => {
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('kennt genau die vier unterstützten Themes', () => {
    expect(useThemeStore.getState().themes).toEqual(['dark', 'light', 'vikings', 'iff']);
  });

  it('setTheme persistiert in localStorage und setzt das data-theme-Attribut', () => {
    useThemeStore.getState().setTheme('iff');

    expect(useThemeStore.getState().theme).toBe('iff');
    expect(localStorage.getItem('openfloorball-theme')).toBe('iff');
    expect(document.documentElement.getAttribute('data-theme')).toBe('iff');
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import useThemeStore from './themeStore.js';

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
  });

  it('fällt ohne gespeicherten Wert auf das dunkle Theme zurück', () => {
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('kennt genau die fünf unterstützten Themes (inkl. custom)', () => {
    expect(useThemeStore.getState().themes).toEqual(['dark', 'light', 'vikings', 'iff', 'custom']);
  });

  it('setTheme persistiert in localStorage und setzt das data-theme-Attribut', () => {
    useThemeStore.getState().setTheme('iff');

    expect(useThemeStore.getState().theme).toBe('iff');
    expect(localStorage.getItem('openfloorball-theme')).toBe('iff');
    expect(document.documentElement.getAttribute('data-theme')).toBe('iff');
  });

  describe('Custom-Theme (UI/UX-Audit, Stufe 5)', () => {
    it('setCustomColors merged in den bestehenden Farbsatz und persistiert', () => {
      useThemeStore.getState().setCustomColors({ primary: '#123456' });
      expect(useThemeStore.getState().customColors.primary).toBe('#123456');
      expect(useThemeStore.getState().customColors.bg).toBeDefined(); // andere Felder bleiben erhalten

      const stored = JSON.parse(localStorage.getItem('openfloorball-custom-theme'));
      expect(stored.primary).toBe('#123456');
    });

    it('setTheme("custom") trägt abgeleitete Farb-Tokens als Inline-Styles auf <html> ein', () => {
      useThemeStore.getState().setCustomColors({ primary: '#123456', bg: '#000000', surface: '#111111', text: '#ffffff' });
      useThemeStore.getState().setTheme('custom');

      expect(document.documentElement.getAttribute('data-theme')).toBe('custom');
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#123456');
      expect(document.documentElement.style.getPropertyValue('--color-bg')).toBe('#000000');
    });

    it('wechselt man vom Custom-Theme weg, werden die Inline-Tokens wieder entfernt', () => {
      useThemeStore.getState().setTheme('custom');
      expect(document.documentElement.style.getPropertyValue('--color-primary')).not.toBe('');

      useThemeStore.getState().setTheme('dark');
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
    });

    it('setCustomColors aktualisiert die Live-Vorschau nur, wenn Custom gerade aktiv ist', () => {
      useThemeStore.getState().setTheme('dark');
      useThemeStore.getState().setCustomColors({ primary: '#abcdef' });
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');

      useThemeStore.getState().setTheme('custom');
      useThemeStore.getState().setCustomColors({ primary: '#abcdef' });
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#abcdef');
    });
  });
});

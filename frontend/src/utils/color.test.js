import { describe, it, expect } from 'vitest';
import { darkenHex, normalizeStoredColor, teamColorToFillStroke, hashUserColor } from './color.js';

describe('darkenHex', () => {
  it('verdunkelt eine Hex-Farbe um den angegebenen Anteil', () => {
    expect(darkenHex('#ffffff', 0.5)).toBe('#808080');
  });

  it('verdunkelt standardmäßig um 25%', () => {
    expect(darkenHex('#ffffff')).toBe('#bfbfbf');
  });

  it('funktioniert auch ohne führendes #', () => {
    expect(darkenHex('ffffff', 0.5)).toBe('#808080');
  });

  it('gibt den Originalwert unverändert zurück, wenn er kein gültiges Hex ist', () => {
    expect(darkenHex('not-a-color')).toBe('not-a-color');
    expect(darkenHex(undefined)).toBeUndefined();
  });
});

describe('normalizeStoredColor', () => {
  it('gibt einen reinen Hex-String unverändert zurück', () => {
    expect(normalizeStoredColor('#1d4e94')).toBe('#1d4e94');
  });

  it('extrahiert fill aus einem älteren, stringifizierten {fill,stroke}-Datensatz (Issue #33)', () => {
    expect(normalizeStoredColor('{"fill":"#1d4e94","stroke":"#0f2a52"}')).toBe('#1d4e94');
  });

  it('gibt null für leere/kaputte Werte zurück statt zu werfen', () => {
    expect(normalizeStoredColor(null)).toBeNull();
    expect(normalizeStoredColor('')).toBeNull();
    expect(normalizeStoredColor('{invalid json')).toBeNull();
  });
});

describe('teamColorToFillStroke', () => {
  it('baut ein {fill, stroke}-Objekt aus einem persistierten Hex-Wert', () => {
    expect(teamColorToFillStroke('#ffffff', '#000000')).toEqual({
      fill: '#ffffff',
      stroke: '#bfbfbf',
    });
  });

  it('fällt auf den Fallback zurück, wenn kein Wert gespeichert ist', () => {
    expect(teamColorToFillStroke(null, '#ffffff')).toEqual({
      fill: '#ffffff',
      stroke: '#bfbfbf',
    });
  });
});

describe('hashUserColor', () => {
  it('liefert für dieselbe userId immer dieselbe Farbe', () => {
    expect(hashUserColor('user-123')).toBe(hashUserColor('user-123'));
  });

  it('liefert für unterschiedliche userIds typischerweise unterschiedliche Farben', () => {
    expect(hashUserColor('user-123')).not.toBe(hashUserColor('user-456'));
  });

  it('gibt einen gültigen HSL-String zurück', () => {
    expect(hashUserColor('anna')).toMatch(/^hsl\(\d+, 70%, 55%\)$/);
  });
});

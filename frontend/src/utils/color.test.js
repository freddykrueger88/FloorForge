import { describe, it, expect } from 'vitest';
import { darkenHex, normalizeStoredColor, teamColorToFillStroke, hashUserColor, lightenHex, isLightColor, deriveCustomThemeTokens } from './color.js';

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

describe('lightenHex', () => {
  it('hellt eine Hex-Farbe um den angegebenen Anteil Richtung Weiß auf', () => {
    expect(lightenHex('#000000', 0.5)).toBe('#808080');
  });

  it('läuft nicht über #ffffff hinaus', () => {
    expect(lightenHex('#ffffff', 0.5)).toBe('#ffffff');
  });

  it('gibt den Originalwert unverändert zurück, wenn er kein gültiges Hex ist', () => {
    expect(lightenHex('not-a-color')).toBe('not-a-color');
  });
});

describe('isLightColor', () => {
  it('erkennt Weiß als hell', () => {
    expect(isLightColor('#ffffff')).toBe(true);
  });

  it('erkennt Schwarz als dunkel', () => {
    expect(isLightColor('#000000')).toBe(false);
  });

  it('gibt false für ungültige Werte zurück, statt zu werfen', () => {
    expect(isLightColor('not-a-color')).toBe(false);
  });
});

describe('deriveCustomThemeTokens', () => {
  it('übernimmt die vier Basisfarben unverändert für bg/surface/text/primary', () => {
    const tokens = deriveCustomThemeTokens({ primary: '#ff7a1a', bg: '#0f1117', surface: '#161b22', text: '#e6edf3' });
    expect(tokens['--color-bg']).toBe('#0f1117');
    expect(tokens['--color-surface']).toBe('#161b22');
    expect(tokens['--color-text']).toBe('#e6edf3');
    expect(tokens['--color-primary']).toBe('#ff7a1a');
  });

  it('wählt das dunkle Semantik-Set bei dunklem Hintergrund und das helle bei hellem Hintergrund', () => {
    const dark = deriveCustomThemeTokens({ primary: '#ff7a1a', bg: '#0f1117', surface: '#161b22', text: '#e6edf3' });
    const light = deriveCustomThemeTokens({ primary: '#c2410c', bg: '#ffffff', surface: '#f6f8fa', text: '#1f2328' });
    expect(dark['--color-error']).toBe('#f85149');
    expect(light['--color-error']).toBe('#d1242f');
  });

  it('leitet alle für die App nötigen Tokens ab (keine fehlenden Keys)', () => {
    const tokens = deriveCustomThemeTokens({ primary: '#ff7a1a', bg: '#0f1117', surface: '#161b22', text: '#e6edf3' });
    [
      '--color-bg', '--color-surface', '--color-surface-2', '--color-surface-offset',
      '--color-surface-dynamic', '--color-surface-offset-2', '--color-divider', '--color-border',
      '--color-text', '--color-text-muted', '--color-text-faint', '--color-text-inverse',
      '--color-primary', '--color-primary-hover', '--color-primary-active', '--color-primary-highlight',
      '--color-error', '--color-error-hover', '--color-error-highlight',
      '--color-success', '--color-warning', '--color-warning-hover', '--color-info',
    ].forEach((key) => expect(tokens[key]).toMatch(/^#[0-9a-f]{6}$/i));
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

import { describe, it, expect } from 'vitest';
import de from './de.json';
import en from './en.json';

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flattenKeys(value, path)
      : [path];
  });
}

describe('i18n locale parity (de.json <-> en.json)', () => {
  it('hat in beiden Sprachen exakt dieselben Übersetzungsschlüssel', () => {
    const deKeys = new Set(flattenKeys(de));
    const enKeys = new Set(flattenKeys(en));

    const missingInEn = [...deKeys].filter((k) => !enKeys.has(k));
    const missingInDe = [...enKeys].filter((k) => !deKeys.has(k));

    expect(missingInEn, `Schlüssel fehlen in en.json: ${missingInEn.join(', ')}`).toEqual([]);
    expect(missingInDe, `Schlüssel fehlen in de.json: ${missingInDe.join(', ')}`).toEqual([]);
  });

  it('enthält keine leeren Übersetzungswerte', () => {
    const emptyIn = (obj, label) =>
      flattenKeys(obj).filter((path) => {
        const value = path.split('.').reduce((o, k) => o?.[k], obj);
        return typeof value === 'string' && value.trim() === '';
      }).map((k) => `${label}:${k}`);

    expect([...emptyIn(de, 'de'), ...emptyIn(en, 'en')]).toEqual([]);
  });
});

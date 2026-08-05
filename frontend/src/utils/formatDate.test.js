import { describe, it, expect, afterEach } from 'vitest';
import i18n from '../i18n/i18n.js';
import { formatDate } from './formatDate.js';

describe('formatDate', () => {
  afterEach(async () => {
    await i18n.changeLanguage('de');
  });

  it('gibt einen leeren String für ein fehlendes Datum zurück, statt zu werfen', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('formatiert im deutschen Format (TT.MM.JJJJ), wenn die aktuelle Sprache Deutsch ist', async () => {
    await i18n.changeLanguage('de');
    expect(formatDate('2026-03-05T12:00:00.000Z')).toBe('05.03.2026');
  });

  it('formatiert im US-Format (MM/TT/JJJJ), wenn die aktuelle Sprache Englisch ist', async () => {
    await i18n.changeLanguage('en');
    expect(formatDate('2026-03-05T12:00:00.000Z')).toBe('03/05/2026');
  });
});

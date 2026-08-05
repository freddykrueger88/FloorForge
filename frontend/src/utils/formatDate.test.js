import { describe, it, expect, afterEach } from 'vitest';
import i18n from '../i18n/i18n.js';
import { formatDate, formatDateOnly } from './formatDate.js';

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

describe('formatDateOnly', () => {
  afterEach(async () => {
    await i18n.changeLanguage('de');
  });

  it('gibt einen leeren String für ein fehlendes Datum zurück, statt zu werfen', () => {
    expect(formatDateOnly(null)).toBe('');
    expect(formatDateOnly(undefined)).toBe('');
  });

  it('formatiert "YYYY-MM-DD" im deutschen Format, ohne Zeitzonen-Umrechnung', async () => {
    await i18n.changeLanguage('de');
    expect(formatDateOnly('2026-09-15')).toBe('15.09.2026');
  });

  it('formatiert "YYYY-MM-DD" im US-Format, ohne Zeitzonen-Umrechnung', async () => {
    await i18n.changeLanguage('en');
    expect(formatDateOnly('2026-09-15')).toBe('09/15/2026');
  });
});

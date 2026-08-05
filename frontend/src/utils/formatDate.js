/**
 * formatDate – Lokalisierte Datumsformatierung (Issue #25)
 * Nutzt die aktuelle i18next-Sprache statt eines hartkodierten Locales.
 */
import i18n from '../i18n/i18n.js';

export function formatDate(iso, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'de-DE', options);
}

// formatDateOnly – für reine Datumswerte ohne Uhrzeit (z.B. das geplante
// Datum einer Trainingseinheit, DATE-Spalte als "YYYY-MM-DD"). Bewusst
// KEIN new Date(str) + toLocaleDateString() wie oben – das würde den
// String als UTC-Mitternacht interpretieren und in Zeitzonen westlich
// von UTC einen Tag zu früh anzeigen. Stattdessen die Teile direkt aus
// dem String lesen, ganz ohne Zeitzonen-Umrechnung.
export function formatDateOnly(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return '';
  return i18n.language === 'en' ? `${month}/${day}/${year}` : `${day}.${month}.${year}`;
}

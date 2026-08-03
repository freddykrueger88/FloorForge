/**
 * formatDate – Lokalisierte Datumsformatierung (Issue #25)
 * Nutzt die aktuelle i18next-Sprache statt eines hartkodierten Locales.
 */
import i18n from '../i18n/i18n.js';

export function formatDate(iso, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'de-DE', options);
}

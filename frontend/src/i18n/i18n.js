import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    lng: 'de', // Deutsch als Standardsprache
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false, // React escaped automatisch
    },
    // Browser-Sprache beim ersten Start erkennen
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'floorforge-lang',
    },
  });

export default i18n;

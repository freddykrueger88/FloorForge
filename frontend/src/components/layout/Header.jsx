/**
 * Header – globale Kopfzeile: Marke, Hauptnavigation, Sprachauswahl,
 * Logout. Ersetzt die bisher pro Seite duplizierte Ad-hoc-Navigation
 * nicht, ergänzt sie als eine gemeinsame, immer sichtbare Leiste
 * (auch auf öffentlichen Seiten wie Login/Privacy/Rules/Share).
 */
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore.js';
import { apiFetch } from '../../utils/apiFetch.js';
import logo from '../../assets/openfloorball_logo_cropped.png';
import styles from './Header.module.css';

const LANGUAGES = ['de', 'en'];

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const changeLanguage = (lang) => {
    if (lang === i18n.language) return;
    i18n.changeLanguage(lang);
    if (user) {
      apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify({ language: lang }) }).catch(() => {});
    }
  };

  const navLinks = [
    { to: '/boards',    label: t('nav.boards') },
    { to: '/trainings', label: t('nav.trainings') },
    { to: '/roster',    label: t('nav.roster') },
    { to: '/settings',  label: t('nav.settings') },
  ];

  return (
    <header className={styles.header}>
      <a href="#main-content" className="sr-only sr-only-focusable">{t('accessibility.skipToContent')}</a>

      <Link to={user ? '/boards' : '/'} className={styles.brand} aria-label={t('nav.brandHome')}>
        <img src={logo} alt="OpenFloorball" className={styles.brandLogo} />
        <span className={styles.brandSlogan}>{t('auth.slogan')}</span>
      </Link>

      {user && (
        <nav className={styles.nav} aria-label={t('nav.mainNavigation')}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${location.pathname.startsWith(link.to) ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className={styles.actions}>
        <div className={styles.langToggle} role="group" aria-label={t('settings.language')}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className={styles.langBtn}
              aria-pressed={i18n.language === lang}
              aria-label={t(lang === 'de' ? 'settings.languageDe' : 'settings.languageEn')}
              onClick={() => changeLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {user && (
          <button type="button" className={styles.logoutBtn} onClick={() => useAuthStore.getState().logout()}>
            {t('nav.logout')}
          </button>
        )}
      </div>
    </header>
  );
}

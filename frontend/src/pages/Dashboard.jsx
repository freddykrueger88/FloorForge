import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore.js';
import styles from './Dashboard.module.css';

const GREETING_KEYS = [
  'dashboard.greeting1',
  'dashboard.greeting2',
  'dashboard.greeting3',
  'dashboard.greeting4',
  'dashboard.greeting5',
  'dashboard.greeting6',
  'dashboard.greeting7',
  'dashboard.greeting8',
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  // Einmal pro Seitenaufruf zufällig gewählt, bleibt danach stabil
  const [greetingKey] = useState(() => GREETING_KEYS[Math.floor(Math.random() * GREETING_KEYS.length)]);
  const displayName = user?.name || user?.email;

  return (
    <main className={styles.page} role="main">
      <a href="#main-content" className="sr-only sr-only-focusable">{t('accessibility.skipToContent')}</a>
      <div className={styles.card} id="main-content">
        <div className={styles.logo} aria-hidden="true">🏒</div>

        <p className={styles.greeting}>
          {t(greetingKey)}, <span className={styles.name}>{displayName}</span>!
        </p>
        <h1 className={styles.tagline}>{t('dashboard.tagline')}</h1>

        <div className={styles.actionsGrid}>
          <Link to="/boards" className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
            <span className={styles.actionIcon} aria-hidden="true">🏑</span>
            <span className={styles.actionTitle}>{t('nav.boards')}</span>
            <span className={styles.actionDesc}>{t('dashboard.boardsDesc')}</span>
          </Link>

          <Link to="/settings" className={styles.actionCard}>
            <span className={styles.actionIcon} aria-hidden="true">⚙️</span>
            <span className={styles.actionTitle}>{t('nav.settings')}</span>
            <span className={styles.actionDesc}>{t('dashboard.settingsDesc')}</span>
          </Link>
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          {t('nav.logout')}
        </button>
      </div>
    </main>
  );
}

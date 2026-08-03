import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import styles from './Dashboard.module.css';

const GREETINGS = [
  'Willkommen zurück',
  'Schön, dich zu sehen',
  'Moin',
  'Hey',
  'Servus',
  'Auf geht\'s',
  'Bereit für den nächsten Spielzug',
  'Gut, dass du da bist',
];

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  // Einmal pro Seitenaufruf zufällig gewählt, bleibt danach stabil
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const displayName = user?.name || user?.email;

  return (
    <main className={styles.page} role="main">
      <div className={styles.card}>
        <div className={styles.logo} aria-hidden="true">🏒</div>

        <p className={styles.greeting}>
          {greeting}, <span className={styles.name}>{displayName}</span>!
        </p>
        <h1 className={styles.tagline}>Bereit für den nächsten Spielzug?</h1>

        <div className={styles.actionsGrid}>
          <Link to="/boards" className={`${styles.actionCard} ${styles.actionCardPrimary}`}>
            <span className={styles.actionIcon} aria-hidden="true">🏑</span>
            <span className={styles.actionTitle}>Spielfelder</span>
            <span className={styles.actionDesc}>Neues Spielfeld erstellen oder bestehende bearbeiten</span>
          </Link>

          <Link to="/settings" className={styles.actionCard}>
            <span className={styles.actionIcon} aria-hidden="true">⚙️</span>
            <span className={styles.actionTitle}>Einstellungen</span>
            <span className={styles.actionDesc}>Theme, Barrierefreiheit, Konto &amp; mehr</span>
          </Link>
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          Abmelden
        </button>
      </div>
    </main>
  );
}

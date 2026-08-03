import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore.js';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <main role="main" style={{ padding: '2rem', color: 'var(--color-text)' }}>
      <h1>{t('nav.dashboard')}</h1>
      <p>Willkommen, {user?.name || user?.email}</p>
      <Link
        to="/boards"
        className="btn btn-primary"
        style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}
      >
        🏒 Zu meinen Spielfeldern
      </Link>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={logout}>
          {t('nav.logout')}
        </button>
      </div>
    </main>
  );
}

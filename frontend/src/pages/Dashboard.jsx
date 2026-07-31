import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore.js';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <main role="main" style={{ padding: '2rem', color: 'var(--color-text)' }}>
      <h1>{t('nav.dashboard')}</h1>
      <p>Willkommen, {user?.display_name || user?.email}</p>
      <button onClick={logout} style={{ marginTop: '1rem' }}>
        {t('nav.logout')}
      </button>
    </main>
  );
}

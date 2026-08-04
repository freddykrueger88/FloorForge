import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <main role="main" id="main-content" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)' }}>
      <h1>{t('notFound.title')}</h1>
      <p>{t('errors.notFound')}</p>
      <Link to="/">{t('notFound.homeLink')}</Link>
    </main>
  );
}

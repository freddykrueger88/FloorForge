import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '4rem' }} aria-hidden="true">🏒</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
        404 – {t('errors.notFound')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        {t('errors.notFoundHint')}
      </p>
      <Link
        to="/"
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-6)',
          background: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        {t('errors.backHome')}
      </Link>
    </main>
  );
}

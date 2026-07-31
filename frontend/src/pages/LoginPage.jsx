import { useTranslation } from 'react-i18next';

/**
 * Login-Seite
 * Vollständige Implementierung folgt in Issue #4 (Auth)
 */
export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--space-8)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
          🏒 FloorForge
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          {t('app.tagline')}
        </p>
        <p style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
          ⬤ {t('auth.login')} – Implementierung folgt in Issue #4
        </p>
      </div>
    </main>
  );
}

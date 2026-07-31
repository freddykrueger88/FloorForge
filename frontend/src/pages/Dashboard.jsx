import { useTranslation } from 'react-i18next';

/**
 * Dashboard – Übersicht aller Spielfelder
 * Vollständige Implementierung folgt in Issue #9 (Board-Verwaltung)
 */
export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <main id="main-content" style={{ padding: 'var(--space-8)', color: 'var(--color-text)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
        {t('dashboard.title')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        {t('dashboard.emptyHint')}
      </p>
      <p style={{ marginTop: 'var(--space-8)', color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>
        ⬤ Issue #9 – Board-Verwaltung wird hier implementiert
      </p>
    </main>
  );
}

/**
 * SettingsPage – Zentrale Einstellungsseite (Issue #18)
 *
 * UI/UX-Audit, Stufe 3: war vorher eine 1011-Zeilen-Datei mit Account/
 * Daten/Admin/Backups/Teams/Vereinen/Darstellung untereinander auf einer
 * langen Scroll-Seite. Jetzt eine schlanke Hülle, die per SettingsTabs
 * zwischen sechs eigenständigen Section-Komponenten umschaltet (siehe
 * components/settings/) – jede Section holt sich ihre Daten/Hooks selbst,
 * kein Prop-Drilling von hier aus nötig.
 */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import useAuthStore from '../store/authStore.js';
import { useSettings } from '../hooks/useSettings.js';
import SettingsTabs from '../components/settings/SettingsTabs.jsx';
import PreferencesSection from '../components/settings/PreferencesSection.jsx';
import AccountSection from '../components/settings/AccountSection.jsx';
import TeamsSection from '../components/settings/TeamsSection.jsx';
import OrganizationsSection from '../components/settings/OrganizationsSection.jsx';
import DataSection from '../components/settings/DataSection.jsx';
import AdminSection from '../components/settings/AdminSection.jsx';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { loading } = useSettings();
  const isAdmin = user?.role === 'admin';

  if (loading) return <p className={styles.loadingMsg}>{t('settings.loadingPage')}</p>;

  const tabs = [
    { id: 'appearance',    label: t('settings.nav.appearance'),    content: <PreferencesSection /> },
    { id: 'account',       label: t('settings.nav.account'),       content: <AccountSection /> },
    { id: 'teams',         label: t('settings.nav.teams'),         content: <TeamsSection /> },
    { id: 'organizations', label: t('settings.nav.organizations'), content: <OrganizationsSection /> },
    { id: 'data',          label: t('settings.nav.data'),          content: <DataSection /> },
    isAdmin && { id: 'admin', label: t('settings.nav.admin'), content: <AdminSection /> },
  ].filter(Boolean);

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <Link to="/boards" className={styles.backLink} aria-label={t('settings.backLink')}>←</Link>
        <h1 className={styles.title}>{t('settings.title')}</h1>
      </header>

      <SettingsTabs tabs={tabs} />
    </main>
  );
}

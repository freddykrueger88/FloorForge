/**
 * AdminSection – Nutzerverwaltung + automatische Backups, nur für Admins
 * (UI/UX-Audit, Stufe 3 – aus der vormals 1011-Zeilen-SettingsPage.jsx
 * ausgelagert, reines Verschieben ohne Logik-Änderung). Wird von
 * SettingsTabs nur als Tab angeboten, wenn isAdmin true ist – geht hier
 * aber trotzdem defensiv nochmal von einem vorhandenen Admin-User aus.
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import { apiFetch } from '../../utils/apiFetch.js';
import { formatDate } from '../../utils/formatDate.js';
import Button from '../common/Button.jsx';
import styles from '../../pages/SettingsPage.module.css';

export default function AdminSection() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [adminError, setAdminError] = useState(null);
  const loadUsers = useCallback(async () => {
    try { setUsers(await apiFetch('/api/admin/users')); } catch (err) { setAdminError(err.message); }
  }, []);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  const [backupConfig, setBackupConfig] = useState(null);
  const [backupConfigError, setBackupConfigError] = useState(null);
  const loadBackupConfig = useCallback(async () => {
    try { setBackupConfig(await apiFetch('/api/admin/backup-config')); } catch (err) { setBackupConfigError(err.message); }
  }, []);
  useEffect(() => { loadBackupConfig(); }, [loadBackupConfig]);

  const patchBackupConfig = async (fields) => {
    setBackupConfigError(null);
    const next = { ...backupConfig, ...fields };
    try {
      setBackupConfig(await apiFetch('/api/admin/backup-config', { method: 'PUT', body: JSON.stringify(next) }));
    } catch (err) {
      setBackupConfigError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    setAdminError(null);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleToggleRole = async (u) => {
    setAdminError(null);
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await apiFetch(`/api/admin/users/${u.id}/role`, {
        method: 'PUT', body: JSON.stringify({ role: nextRole }),
      });
      setUsers((prev) => prev.map((row) => row.id === u.id ? updated : row));
    } catch (err) {
      setAdminError(err.message);
    }
  };

  return (
    <section className={styles.section}>
      <h2>{t('settings.adminTitle')}</h2>
      {adminError && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {adminError}</p>}
      <table className={styles.userTable}>
        <thead>
          <tr><th>{t('settings.colEmail')}</th><th>{t('settings.colRole')}</th><th>{t('settings.colRegistered')}</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{formatDate(u.created_at)}</td>
              <td className={styles.userActions}>
                {u.id !== user.id && (
                  <>
                    <Button variant="secondary" size="sm" className={styles.smallBtn} onClick={() => handleToggleRole(u)}>
                      {u.role === 'admin' ? t('settings.demoteBtn') : t('settings.promoteBtn')}
                    </Button>
                    <Button variant="danger" size="sm" className={styles.smallBtnDanger} onClick={() => handleDeleteUser(u.id)}>
                      {t('settings.deleteBtn')}
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.subForm}>
        <h3 className={styles.subTitle}>{t('settings.autoBackupsTitle')}</h3>
        {backupConfigError && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {backupConfigError}</p>}
        {backupConfig && (
          <>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!backupConfig.enabled}
                onChange={(e) => patchBackupConfig({ enabled: e.target.checked })}
              />
              {t('settings.enableBackups')}
            </label>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="backup-schedule">{t('settings.schedule')}</label>
              <select
                id="backup-schedule"
                className={styles.select}
                value={backupConfig.schedule}
                onChange={(e) => patchBackupConfig({ schedule: e.target.value })}
              >
                <option value="daily">{t('settings.scheduleDaily')}</option>
                <option value="weekly">{t('settings.scheduleWeekly')}</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="backup-retention">{t('settings.retention')}</label>
              <input
                id="backup-retention"
                type="number"
                className={styles.textInput}
                min={1}
                max={90}
                value={backupConfig.retention}
                onChange={(e) => patchBackupConfig({ retention: parseInt(e.target.value, 10) || 1 })}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

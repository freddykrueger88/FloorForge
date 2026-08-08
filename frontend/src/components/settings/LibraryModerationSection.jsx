/**
 * LibraryModerationSection – gemeldete Bibliothekseinträge, nur für Admins
 * (EPIC 010 MVP). Struktur/Styles analog AdminSection.jsx (styles.userTable).
 * Post-Moderation: Einträge sind sofort live, Admin kann gemeldete Einträge
 * nachträglich entfernen (Hard-Delete, kein Freigabe-Workflow).
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../utils/apiFetch.js';
import { formatDate } from '../../utils/formatDate.js';
import Button from '../common/Button.jsx';
import styles from '../../pages/SettingsPage.module.css';

export default function LibraryModerationSection() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  const loadReports = useCallback(async () => {
    try { setReports(await apiFetch('/api/admin/library-reports')); } catch (err) { setError(err.message); }
  }, []);
  useEffect(() => { loadReports(); }, [loadReports]);

  const handleRemove = async (entry) => {
    if (!window.confirm(t('library.removeConfirm'))) return;
    setError(null);
    try {
      await apiFetch(`/api/library/${entry._id}`, { method: 'DELETE' });
      setReports((prev) => prev.filter((r) => r._id !== entry._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={styles.section}>
      <h2>{t('library.moderation.title')}</h2>
      {error && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {error}</p>}
      {reports.length === 0 ? (
        <p>{t('library.moderation.empty')}</p>
      ) : (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>{t('library.moderation.columnName')}</th>
              <th>{t('library.moderation.columnCategory')}</th>
              <th>{t('library.moderation.columnAuthor')}</th>
              <th>{t('library.moderation.columnReports')}</th>
              <th>{t('library.moderation.columnLastReported')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.category ? t(`exerciseCategory.${r.category}`) : '–'}</td>
                <td>{r.ownerDisplayName ?? t('library.authorFallback')}</td>
                <td>{r.reportCount}</td>
                <td>{formatDate(r.lastReportedAt)}</td>
                <td>
                  <Button variant="danger" size="sm" className={styles.smallBtnDanger} onClick={() => handleRemove(r)}>
                    {t('library.remove')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

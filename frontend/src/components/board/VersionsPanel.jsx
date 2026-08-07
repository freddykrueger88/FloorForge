/**
 * VersionsPanel – Verlauf automatischer Board-Versionen (ROADMAP Phase 2).
 * Zeitstempel-Liste + Wiederherstellen-Button, bewusst ohne visuelles
 * Vorschau-Thumbnail in diesem ersten Wurf (siehe Plan).
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useVersions } from '../../hooks/useVersions.js';
import { formatDate } from '../../utils/formatDate.js';
import Button from '../common/Button.jsx';
import styles from './VersionsPanel.module.css';

export default function VersionsPanel({ boardId, canRestore, onRestored }) {
  const { t } = useTranslation();
  const { versions, loading, error, fetchVersions, restoreVersion } = useVersions(boardId);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => { fetchVersions().catch(() => {}); }, [fetchVersions]);

  const handleRestore = async (versionId) => {
    setRestoringId(versionId);
    try {
      const frames = await restoreVersion(versionId);
      onRestored?.(frames);
      await fetchVersions();
    } catch { /* error via hook */ } finally {
      setRestoringId(null);
    }
  };

  return (
    <section className={styles.panel} aria-label={t('versions.ariaLabel')}>
      <h3 className={styles.heading}>{t('versions.title')}</h3>
      <p className={styles.hint}>{t('versions.intro')}</p>

      {error && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {error}</p>}

      {loading && versions.length === 0 ? (
        <p className={styles.hint}>{t('versions.loading')}</p>
      ) : versions.length === 0 ? (
        <p className={styles.hint}>{t('versions.empty')}</p>
      ) : (
        <ul className={styles.list} role="list">
          {versions.map((v) => (
            <li key={v._id} className={styles.item}>
              <span className={styles.timestamp}>
                {formatDate(v.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              {canRestore && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRestore(v._id)}
                  disabled={restoringId === v._id}
                  aria-label={t('versions.restoreAriaLabel')}
                >
                  {restoringId === v._id ? t('versions.restoring') : t('versions.restoreBtn')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

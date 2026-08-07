/**
 * ConflictReviewDialog – ROADMAP Phase 4: Liste der Offline-Änderungen
 * (nur Frames/Boards, siehe offlineSync.js), bei denen beim Sync ein
 * Konflikt erkannt wurde (Ressource wurde zwischenzeitlich anderswo
 * geändert). Weder lokale noch Server-Version wird automatisch
 * übernommen – der Nutzer kann den veralteten Eintrag hier verwerfen
 * und die Änderung bei Bedarf manuell am Board erneut vornehmen.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { getQueuedWrites, removeQueuedWrite, getQueueCounts } from '../../utils/offlineQueue.js';
import useOfflineStore from '../../store/offlineStore.js';
import { formatDate } from '../../utils/formatDate.js';
import Button from '../common/Button.jsx';
import styles from './ConflictReviewDialog.module.css';

export default function ConflictReviewDialog({ onClose }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  const [conflicts, setConflicts] = useState([]);
  const [loading,   setLoading  ] = useState(true);

  useEffect(() => {
    getQueuedWrites().then((all) => {
      setConflicts(all.filter((entry) => entry.status === 'conflict'));
      setLoading(false);
    });
  }, []);

  const handleDiscard = async (id) => {
    await removeQueuedWrite(id);
    setConflicts((prev) => prev.filter((c) => c.id !== id));
    const counts = await getQueueCounts();
    useOfflineStore.getState().setConflictCount(counts.conflict);
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="conflict-review-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.dialog}>
        <header className={styles.header}>
          <h2 id="conflict-review-title" className={styles.title}>{t('dialogs.conflictReview.title')}</h2>
          <Button variant="secondary" size="sm" iconOnly onClick={onClose} aria-label={t('dialogs.conflictReview.close')}><X size={18} aria-hidden="true" /></Button>
        </header>

        <p className={styles.hint}>{t('dialogs.conflictReview.hint')}</p>

        {!loading && conflicts.length === 0 ? (
          <p className={styles.empty}>{t('dialogs.conflictReview.emptyState')}</p>
        ) : (
          <ul className={styles.list} role="list">
            {conflicts.map((c) => (
              <li key={c.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemLabel}>{c.label || t('dialogs.conflictReview.unknownLabel')}</span>
                  <span className={styles.itemMeta}>
                    {t('dialogs.conflictReview.queuedAt', { date: formatDate(c.queuedAt, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) })}
                  </span>
                </div>
                <Button variant="danger" size="sm" className={styles.discardBtn} onClick={() => handleDiscard(c.id)}>
                  {t('dialogs.conflictReview.discardBtn')}
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" size="md" onClick={onClose}>{t('dialogs.conflictReview.close')}</Button>
        </div>
      </div>
    </div>
  );
}

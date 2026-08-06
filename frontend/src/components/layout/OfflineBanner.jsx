/**
 * OfflineBanner – schmaler, sticky Hinweis bei fehlender Verbindung
 * bzw. während gepufferte Änderungen synchronisiert werden (Issue #49)
 *
 * ROADMAP Phase 4: zeigt zusätzlich einen Hinweis, wenn beim Sync
 * Konflikte erkannt wurden (siehe offlineSync.js) – ein Klick öffnet
 * den ConflictReviewDialog zur manuellen Prüfung.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useOfflineStore from '../../store/offlineStore.js';
import ConflictReviewDialog from './ConflictReviewDialog.jsx';
import styles from './OfflineBanner.module.css';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline      = useOfflineStore((s) => s.isOnline);
  const queueLength   = useOfflineStore((s) => s.queueLength);
  const conflictCount = useOfflineStore((s) => s.conflictCount);
  const syncing        = useOfflineStore((s) => s.syncing);
  const [showConflicts, setShowConflicts] = useState(false);

  if (isOnline && queueLength === 0 && !syncing && conflictCount === 0) return null;

  const showQueueMessage = !isOnline || queueLength > 0 || syncing;
  const message = !isOnline
    ? t('offline.offlineBanner', { count: queueLength })
    : t('offline.syncingBanner', { count: queueLength });

  return (
    <>
      <div className={styles.banner} role="status" aria-live="polite">
        {showQueueMessage && (
          <span>
            <span aria-hidden="true">{isOnline ? '🔄' : '📡'}</span> {message}
          </span>
        )}
        {conflictCount > 0 && (
          <button type="button" className={styles.conflictBtn} onClick={() => setShowConflicts(true)}>
            <span aria-hidden="true">⚠️</span> {t('offline.conflictBannerBtn', { count: conflictCount })}
          </button>
        )}
      </div>
      {showConflicts && <ConflictReviewDialog onClose={() => setShowConflicts(false)} />}
    </>
  );
}

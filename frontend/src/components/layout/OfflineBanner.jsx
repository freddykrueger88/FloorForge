/**
 * OfflineBanner – schmaler, sticky Hinweis bei fehlender Verbindung
 * bzw. während gepufferte Änderungen synchronisiert werden (Issue #49)
 */
import { useTranslation } from 'react-i18next';
import useOfflineStore from '../../store/offlineStore.js';
import styles from './OfflineBanner.module.css';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline    = useOfflineStore((s) => s.isOnline);
  const queueLength = useOfflineStore((s) => s.queueLength);
  const syncing      = useOfflineStore((s) => s.syncing);

  if (isOnline && queueLength === 0 && !syncing) return null;

  const message = !isOnline
    ? t('offline.offlineBanner', { count: queueLength })
    : t('offline.syncingBanner', { count: queueLength });

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span aria-hidden="true">{isOnline ? '🔄' : '📡'}</span> {message}
    </div>
  );
}

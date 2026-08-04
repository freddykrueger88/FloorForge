/**
 * offlineSync – synchronisiert gepufferte Schreibzugriffe (Issue #49),
 * sobald die Verbindung wieder da ist. Last-Write-Wins ist bereits
 * durch offlineQueue.enqueueWrite() sichergestellt (ein Eintrag pro
 * Ressource) – hier wird nur noch abgespielt.
 */
import { getQueuedWrites, removeQueuedWrite } from './offlineQueue.js';
import useOfflineStore from '../store/offlineStore.js';
import useAnnounceStore from '../store/announceStore.js';
import i18n from '../i18n/i18n.js';

export async function syncOfflineQueue() {
  const queued = await getQueuedWrites();
  if (queued.length === 0) return;

  useOfflineStore.getState().setSyncing(true);
  let failed = 0;

  for (const entry of queued) {
    try {
      const res = await fetch(entry.url, {
        method: entry.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: entry.body,
      });
      if (res.ok) {
        await removeQueuedWrite(entry.id);
      } else {
        // Serverseitige Ablehnung (z.B. 404/422) – erneuter Versuch
        // würde denselben Fehler wiederholen, Eintrag verwerfen statt
        // endlos zu puffern
        await removeQueuedWrite(entry.id);
        failed += 1;
      }
    } catch {
      // Immer noch offline / Netzwerkfehler – Eintrag bleibt gepuffert,
      // nächster online-Event versucht es erneut
      break;
    }
  }

  const remaining = await getQueuedWrites();
  useOfflineStore.getState().setQueueLength(remaining.length);
  useOfflineStore.getState().setSyncing(false);

  if (remaining.length === 0 && queued.length > 0) {
    useAnnounceStore.getState().announce(
      failed > 0 ? i18n.t('offline.syncedWithErrors') : i18n.t('offline.synced')
    );
  }
}

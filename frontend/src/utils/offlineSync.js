/**
 * offlineSync – synchronisiert gepufferte Schreibzugriffe (Issue #49),
 * sobald die Verbindung wieder da ist. Last-Write-Wins ist bereits
 * durch offlineQueue.enqueueWrite() sichergestellt (ein Eintrag pro
 * Ressource) – hier wird nur noch abgespielt.
 *
 * ROADMAP Phase 4 – Konflikterkennung (nur Frames + Boards, siehe
 * useFrames.js/useBoardsApi.js): Einträge mit `conflictCheckUrl` werden
 * vor dem Abschicken serverseitig gegengeprüft (updatedAt-Vergleich).
 * Wurde die Ressource zwischenzeitlich anderswo geändert, wird NICHT
 * automatisch überschrieben – der Eintrag wird als Konflikt markiert
 * und beim nächsten Lauf übersprungen, bis der Nutzer ihn im
 * ConflictReviewDialog manuell verwirft.
 */
import { getQueuedWrites, removeQueuedWrite, markQueuedWriteConflict, getQueueCounts } from './offlineQueue.js';
import useOfflineStore from '../store/offlineStore.js';
import useAnnounceStore from '../store/announceStore.js';
import i18n from '../i18n/i18n.js';

// Reine Entscheidungslogik, bewusst getrennt von der fetch()-I/O
// gehalten – so lässt sie sich ohne Netzwerk-/IndexedDB-Mocking direkt
// testen (siehe offlineSync.test.js). Nimmt eine bereits abgeschlossene
// Antwort (Status + geparste Daten) entgegen.
// Rückgabe: 'ok' (unverändert, normal abschicken), 'conflict' (nicht
// abschicken, markieren), 'resolved' (Ziel bereits erreicht, z.B. DELETE
// auf bereits gelöschte Ressource – ohne Konflikt verwerfen).
export function resolveConflictVerdict({ status, data }, entry) {
  if (status === 404) {
    // Ziel bereits weg: bei DELETE ist das Ziel erreicht (kein Konflikt),
    // bei PUT kann nicht mehr editiert werden, was nicht mehr existiert.
    return entry.method === 'DELETE' ? 'resolved' : 'conflict';
  }

  // Bei Frames liefert conflictCheckUrl die volle Liste (kein Einzel-
  // Endpunkt vorhanden) – das passende Frame per resourceId heraussuchen.
  const current = Array.isArray(data) ? data.find((item) => item._id === entry.resourceId) : data;
  if (!current) return entry.method === 'DELETE' ? 'resolved' : 'conflict';

  return current.updatedAt === entry.baselineUpdatedAt ? 'ok' : 'conflict';
}

// Prüft, ob sich die Ressource seit dem Enqueuen serverseitig geändert
// hat. Wirft bei echtem Netzwerkfehler weiter (Aufrufer bricht dann wie
// gewohnt ab und versucht es beim nächsten online-Event erneut).
async function checkForConflict(entry) {
  const res = await fetch(entry.conflictCheckUrl, { credentials: 'include' });

  if (res.status !== 404 && !res.ok) {
    // Unerwarteter Serverfehler – sicherheitshalber wie "noch nicht
    // geklärt" behandeln statt blind abzuschicken.
    throw new Error(`Konfliktprüfung fehlgeschlagen: HTTP ${res.status}`);
  }

  const data = res.status === 404 ? null : (await res.json()).data;
  return resolveConflictVerdict({ status: res.status, data }, entry);
}

export async function syncOfflineQueue() {
  // Konflikt-markierte Einträge werden nie automatisch erneut versucht –
  // die bleiben bis zur manuellen Entscheidung im ConflictReviewDialog liegen.
  const queued = (await getQueuedWrites()).filter((entry) => entry.status !== 'conflict');
  if (queued.length === 0) return;

  useOfflineStore.getState().setSyncing(true);
  let failed = 0;
  let conflicted = 0;

  for (const entry of queued) {
    try {
      if (entry.conflictCheckUrl) {
        const verdict = await checkForConflict(entry);
        if (verdict === 'conflict') {
          await markQueuedWriteConflict(entry.id);
          conflicted += 1;
          continue;
        }
        if (verdict === 'resolved') {
          await removeQueuedWrite(entry.id);
          continue;
        }
      }

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
      // Immer noch offline / Netzwerkfehler (auch bei der Konfliktprüfung
      // selbst) – Eintrag bleibt gepuffert, nächster online-Event
      // versucht es erneut
      break;
    }
  }

  const counts = await getQueueCounts();
  useOfflineStore.getState().setQueueLength(counts.pending);
  useOfflineStore.getState().setConflictCount(counts.conflict);
  useOfflineStore.getState().setSyncing(false);

  if (counts.pending === 0 && queued.length > 0) {
    if (conflicted > 0) {
      useAnnounceStore.getState().announce(i18n.t('offline.syncedWithConflicts', { count: conflicted }));
    } else {
      useAnnounceStore.getState().announce(
        failed > 0 ? i18n.t('offline.syncedWithErrors') : i18n.t('offline.synced')
      );
    }
  }
}

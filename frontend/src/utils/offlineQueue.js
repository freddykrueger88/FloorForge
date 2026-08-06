/**
 * offlineQueue – IndexedDB-Puffer für Schreibzugriffe, die wegen
 * fehlender Verbindung nicht sofort an die API gesendet werden konnten
 * (Issue #49). Bewusst ohne zusätzliche Library (idb o.ä.) – die
 * benötigte Fläche (append/list/remove) ist klein genug für eine
 * direkte IndexedDB-Nutzung.
 *
 * Last-Write-Wins pro Ressource: ein neuer `enqueueWrite`-Aufruf für
 * dieselbe `method`+`url` ersetzt einen bereits gepufferten, noch
 * nicht synchronisierten Schreibzugriff auf dieselbe Ressource (keine
 * mehrfache Wiedergabe veralteter Zwischenstände beim Sync).
 *
 * ROADMAP Phase 4 – Konflikterkennung (nur Frames + Boards, siehe
 * offlineSync.js): Aufrufer können optional baselineUpdatedAt/
 * conflictCheckUrl/resourceId/label mitgeben, damit offlineSync.js vor
 * dem erneuten Abschicken prüfen kann, ob die Ressource zwischenzeitlich
 * anderswo geändert wurde. Ressourcen ohne diese Felder verhalten sich
 * unverändert wie bisher (blindes Last-Write-Wins beim Sync).
 */
const DB_NAME    = 'openfloorball-offline';
const DB_VERSION = 1;
const STORE_NAME = 'writeQueue';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB nicht verfügbar'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('resourceKey', 'resourceKey', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = fn(store);
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror    = () => { db.close(); reject(tx.error); };
  });
}

export async function enqueueWrite({
  url, method, body,
  baselineUpdatedAt = null, conflictCheckUrl = null, resourceId = null, label = null,
}) {
  const resourceKey = `${method} ${url}`;
  try {
    // Zwei getrennte, nacheinander abgewartete Transaktionen statt einer
    // gemeinsamen: verhindert, dass der Lösch-Cursor den soeben neu
    // hinzugefügten Eintrag (gleicher resourceKey) versehentlich mit
    // erfasst, falls beide Requests innerhalb derselben Transaktion
    // interleaven würden.
    await withStore('readwrite', (store) => new Promise((resolve, reject) => {
      const index = store.index('resourceKey');
      const req = index.openCursor(IDBKeyRange.only(resourceKey));
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) { cursor.delete(); cursor.continue(); } else { resolve(); }
      };
      req.onerror = () => reject(req.error);
    }));
    await withStore('readwrite', (store) =>
      store.add({
        resourceKey, url, method, body, queuedAt: Date.now(),
        status: 'pending', baselineUpdatedAt, conflictCheckUrl, resourceId, label,
      }));
  } catch {
    // IndexedDB nicht verfügbar (z.B. privater Modus) – Schreibzugriff
    // geht verloren, aber die App bleibt nutzbar (best effort)
  }
}

// ROADMAP Phase 4: markiert einen Eintrag als Konflikt statt ihn zu
// löschen oder erneut zu versuchen – bleibt bis zur manuellen Prüfung
// durch den Nutzer (ConflictReviewDialog) in der Queue liegen.
export async function markQueuedWriteConflict(id) {
  try {
    await withStore('readwrite', (store) => new Promise((resolve, reject) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const entry = getReq.result;
        if (!entry) { resolve(); return; }
        entry.status = 'conflict';
        const putReq = store.put(entry);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    }));
  } catch { /* best effort */ }
}

export async function getQueuedWrites() {
  try {
    return await withStore('readonly', (store) => new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    }));
  } catch {
    return [];
  }
}

// ROADMAP Phase 4: getrennte Zählung – `pending` sind Einträge, die beim
// nächsten Sync-Lauf noch abgeschickt werden, `conflict`-Einträge werden
// dabei übersprungen und warten auf eine manuelle Entscheidung
// (ConflictReviewDialog).
export async function getQueueCounts() {
  const all = await getQueuedWrites();
  return {
    pending:  all.filter((e) => e.status !== 'conflict').length,
    conflict: all.filter((e) => e.status === 'conflict').length,
  };
}

export async function removeQueuedWrite(id) {
  try {
    await withStore('readwrite', (store) => store.delete(id));
  } catch { /* best effort */ }
}

export async function clearQueue() {
  try {
    await withStore('readwrite', (store) => store.clear());
  } catch { /* best effort */ }
}

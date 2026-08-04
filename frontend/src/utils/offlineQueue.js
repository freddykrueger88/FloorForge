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
 */
const DB_NAME    = 'floorforge-offline';
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

export async function enqueueWrite({ url, method, body }) {
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
      store.add({ resourceKey, url, method, body, queuedAt: Date.now() }));
  } catch {
    // IndexedDB nicht verfügbar (z.B. privater Modus) – Schreibzugriff
    // geht verloren, aber die App bleibt nutzbar (best effort)
  }
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

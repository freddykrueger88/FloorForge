/**
 * offlineStore – globaler Online-/Sync-Status (Issue #49)
 * `navigator.onLine` + `online`/`offline`-Events werden einmalig in
 * App.jsx registriert; `queueLength`/`syncing` spiegeln den Zustand
 * der offlineQueue (utils/offlineQueue.js) für die UI (OfflineBanner).
 *
 * `conflictCount` (ROADMAP Phase 4): Einträge, bei denen offlineSync.js
 * eine Änderung der Ressource durch ein anderes Gerät/Kollaborator
 * erkannt hat – getrennt von `queueLength` (nur noch zu synchronisierende
 * Einträge), da Konflikte NICHT automatisch erneut versucht werden,
 * sondern eine manuelle Entscheidung im ConflictReviewDialog brauchen.
 */
import { create } from 'zustand';

const useOfflineStore = create((set) => ({
  isOnline:      typeof navigator === 'undefined' ? true : navigator.onLine,
  queueLength:   0,
  conflictCount: 0,
  syncing:       false,
  setOnline:        (isOnline)      => set({ isOnline }),
  setQueueLength:   (queueLength)   => set({ queueLength }),
  setConflictCount: (conflictCount) => set({ conflictCount }),
  setSyncing:       (syncing)       => set({ syncing }),
}));

export default useOfflineStore;

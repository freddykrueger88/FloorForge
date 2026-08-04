/**
 * offlineStore – globaler Online-/Sync-Status (Issue #49)
 * `navigator.onLine` + `online`/`offline`-Events werden einmalig in
 * App.jsx registriert; `queueLength`/`syncing` spiegeln den Zustand
 * der offlineQueue (utils/offlineQueue.js) für die UI (OfflineBanner).
 */
import { create } from 'zustand';

const useOfflineStore = create((set) => ({
  isOnline:    typeof navigator === 'undefined' ? true : navigator.onLine,
  queueLength: 0,
  syncing:     false,
  setOnline:      (isOnline)    => set({ isOnline }),
  setQueueLength: (queueLength) => set({ queueLength }),
  setSyncing:     (syncing)     => set({ syncing }),
}));

export default useOfflineStore;

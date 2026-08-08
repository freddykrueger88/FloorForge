/**
 * tourStore – Zustand der Onboarding-Tour (ISSUE 023, "Einfach starten",
 * CLAUDE.md §15). Reiner UI-State, analog announceStore.js/offlineStore.js
 * – kennt keine API-Aufrufe. Das Persistieren von `tourCompleted` (über
 * die bestehende Settings-API) übernimmt TourOverlay.jsx beim Aufruf von
 * skip()/finish().
 */
import { create } from 'zustand';

const useTourStore = create((set, get) => ({
  active: false,
  stepIndex: 0,
  start: () => set({ active: true, stepIndex: 0 }),
  next: () => set({ stepIndex: get().stepIndex + 1 }),
  prev: () => set({ stepIndex: Math.max(0, get().stepIndex - 1) }),
  skip: () => set({ active: false, stepIndex: 0 }),
  finish: () => set({ active: false, stepIndex: 0 }),
}));

export default useTourStore;

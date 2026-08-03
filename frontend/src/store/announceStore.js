/**
 * announceStore – Zentrale Screenreader-Ankündigungen (Issue #19, Teil 2)
 * `announce()` ist von überall aufrufbar (auch aus Nicht-Komponenten-Hooks
 * wie useDrawing.js), nicht nur aus React-Components. Ein unsichtbares
 * Zero-Width-Space wird abwechselnd angehängt, damit auch zwei identische
 * Meldungen hintereinander erneut vorgelesen werden (aria-live reagiert nur
 * auf tatsächliche Textänderungen).
 */
import { create } from 'zustand';

const ZWSP = '​';

const useAnnounceStore = create((set, get) => ({
  message: '',
  announce: (msg) => {
    const toggled = get().message.endsWith(ZWSP);
    set({ message: toggled ? msg : `${msg}${ZWSP}` });
  },
}));

export default useAnnounceStore;

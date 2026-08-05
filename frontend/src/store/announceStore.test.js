import { describe, it, expect, beforeEach } from 'vitest';
import useAnnounceStore from './announceStore.js';

const ZWSP = '​';

describe('useAnnounceStore', () => {
  beforeEach(() => {
    useAnnounceStore.setState({ message: '' });
  });

  it('setzt die Nachricht auf den übergebenen Text', () => {
    useAnnounceStore.getState().announce('Spieler platziert');
    expect(useAnnounceStore.getState().message.replace(ZWSP, '')).toBe('Spieler platziert');
  });

  it('hängt bei zwei identischen Meldungen hintereinander ein Zero-Width-Space an, damit aria-live erneut vorliest', () => {
    useAnnounceStore.getState().announce('Gespeichert');
    const first = useAnnounceStore.getState().message;
    expect(first.endsWith(ZWSP)).toBe(true);

    useAnnounceStore.getState().announce('Gespeichert');
    const second = useAnnounceStore.getState().message;

    // Der sichtbare Text ist identisch, aber aria-live erkennt die
    // tatsächliche String-Änderung am fehlenden/vorhandenen ZWSP.
    expect(second).not.toBe(first);
    expect(second.replace(ZWSP, '')).toBe('Gespeichert');
  });
});

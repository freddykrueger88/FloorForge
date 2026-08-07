import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePresence } from './usePresence.js';

class FakeWebSocket {
  constructor(url) {
    FakeWebSocket.instances.push(this);
    this.url = url;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
  }
  send() {}
  close() {
    this.onclose?.();
  }
  emitMessage(payload) {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }
}
FakeWebSocket.instances = [];

describe('usePresence', () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    globalThis.WebSocket = FakeWebSocket;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('verbindet sich mit der richtigen boardId in der URL', () => {
    renderHook(() => usePresence('board-42'));
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(FakeWebSocket.instances[0].url).toContain('/api/ws/presence?boardId=board-42');
  });

  it('übernimmt die Nutzerliste aus einer presence-Nachricht', async () => {
    const { result } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'presence', users: [{ userId: 'u1', displayName: 'Anna' }] });
    });

    await waitFor(() => {
      expect(result.current).toEqual([{ userId: 'u1', displayName: 'Anna' }]);
    });
  });

  it('leert die Liste, wenn die Verbindung schließt', async () => {
    const { result, unmount } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'presence', users: [{ userId: 'u1', displayName: 'Anna' }] });
    });
    await waitFor(() => expect(result.current).toHaveLength(1));

    act(() => { ws.close(); });
    await waitFor(() => expect(result.current).toHaveLength(0));

    // close() plant einen Reconnect-Versuch (setTimeout) – Hook sauber
    // unmounten, damit dieser Timer nicht nach Testende noch feuert.
    unmount();
  });

  it('verbindet sich nicht, wenn keine boardId übergeben wird', () => {
    renderHook(() => usePresence(null));
    expect(FakeWebSocket.instances).toHaveLength(0);
  });
});

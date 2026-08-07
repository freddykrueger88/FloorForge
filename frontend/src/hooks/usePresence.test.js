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
    this.readyState = FakeWebSocket.OPEN;
    this.sent = [];
  }
  send(data) {
    this.sent.push(JSON.parse(data));
  }
  close() {
    this.onclose?.();
  }
  emitMessage(payload) {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }
}
FakeWebSocket.OPEN = 1;
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
      expect(result.current.users).toEqual([{ userId: 'u1', displayName: 'Anna' }]);
    });
  });

  it('leert die Liste, wenn die Verbindung schließt', async () => {
    const { result, unmount } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'presence', users: [{ userId: 'u1', displayName: 'Anna' }] });
    });
    await waitFor(() => expect(result.current.users).toHaveLength(1));

    act(() => { ws.close(); });
    await waitFor(() => expect(result.current.users).toHaveLength(0));

    // close() plant einen Reconnect-Versuch (setTimeout) – Hook sauber
    // unmounten, damit dieser Timer nicht nach Testende noch feuert.
    unmount();
  });

  it('verbindet sich nicht, wenn keine boardId übergeben wird', () => {
    renderHook(() => usePresence(null));
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('baut die Cursor-Map aus cursor-Nachrichten auf und entfernt Einträge bei cursorLeave', async () => {
    const { result } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'cursor', userId: 'u2', displayName: 'Max', x: 3, y: 4 });
    });
    await waitFor(() => {
      expect(result.current.cursors).toEqual({ u2: { displayName: 'Max', x: 3, y: 4 } });
    });

    act(() => {
      ws.emitMessage({ type: 'cursorLeave', userId: 'u2' });
    });
    await waitFor(() => expect(result.current.cursors).toEqual({}));
  });

  it('entfernt Cursor von Nutzern, die laut einer neuen presence-Liste nicht mehr da sind', async () => {
    const { result } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'cursor', userId: 'u2', displayName: 'Max', x: 1, y: 1 });
    });
    await waitFor(() => expect(result.current.cursors).toHaveProperty('u2'));

    act(() => {
      ws.emitMessage({ type: 'presence', users: [{ userId: 'u1', displayName: 'Anna' }] });
    });
    await waitFor(() => expect(result.current.cursors).toEqual({}));
  });

  it('sendCursor schickt eine cursor-Nachricht und drosselt schnell aufeinanderfolgende Aufrufe', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => { result.current.sendCursor(1, 2); });
    act(() => { result.current.sendCursor(3, 4); }); // sofort danach – sollte gedrosselt werden

    expect(ws.sent).toHaveLength(1);
    expect(ws.sent[0]).toEqual({ type: 'cursor', x: 1, y: 2 });

    act(() => { vi.advanceTimersByTime(100); });
    act(() => { result.current.sendCursor(5, 6); });
    expect(ws.sent).toHaveLength(2);
    expect(ws.sent[1]).toEqual({ type: 'cursor', x: 5, y: 6 });

    vi.useRealTimers();
  });

  it('sendCursorLeave/sendOp schicken die erwartete Nachricht', () => {
    const { result } = renderHook(() => usePresence('board-1'));
    const ws = FakeWebSocket.instances[0];

    act(() => { result.current.sendCursorLeave(); });
    expect(ws.sent).toContainEqual({ type: 'cursorLeave' });

    act(() => { result.current.sendOp('frame-1', { kind: 'movePlayer', id: 'p1', x: 1, y: 2 }); });
    expect(ws.sent).toContainEqual({ type: 'op', frameId: 'frame-1', op: { kind: 'movePlayer', id: 'p1', x: 1, y: 2 } });
  });

  it('ruft onOp bei eingehenden op-Nachrichten auf', async () => {
    const onOp = vi.fn();
    renderHook(() => usePresence('board-1', { onOp }));
    const ws = FakeWebSocket.instances[0];

    act(() => {
      ws.emitMessage({ type: 'op', userId: 'u2', frameId: 'frame-1', op: { kind: 'clearAll' } });
    });

    await waitFor(() => {
      expect(onOp).toHaveBeenCalledWith({ frameId: 'frame-1', op: { kind: 'clearAll' }, userId: 'u2' });
    });
  });
});

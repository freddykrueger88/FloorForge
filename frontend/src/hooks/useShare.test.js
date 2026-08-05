import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../utils/apiFetch.js', () => ({ apiFetch: vi.fn() }));

import { apiFetch } from '../utils/apiFetch.js';
import { useShare } from './useShare.js';

describe('useShare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('erzeugt einen Board-Share-Link relativ zum aktuellen Origin', async () => {
    apiFetch.mockResolvedValueOnce({ token: 'abc123', expiresAt: '2026-01-01T00:00:00.000Z' });
    const { result } = renderHook(() => useShare('board-1'));

    await act(async () => {
      await result.current.createShareLink();
    });

    expect(apiFetch).toHaveBeenCalledWith('/api/boards/board-1/share', { method: 'POST' });
    expect(result.current.shareUrl).toBe(`${window.location.origin}/share/abc123`);
    expect(result.current.expiresAt).toBe('2026-01-01T00:00:00.000Z');
    expect(result.current.error).toBeNull();
  });

  it('setzt error und wirft weiter, wenn das Erzeugen des Board-Links fehlschlägt', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Netzwerkfehler'));
    const { result } = renderHook(() => useShare('board-1'));

    await act(async () => {
      await expect(result.current.createShareLink()).rejects.toThrow('Netzwerkfehler');
    });

    expect(result.current.error).toBe('Netzwerkfehler');
    expect(result.current.shareUrl).toBeNull();
  });

  it('erzeugt einen Frame-Share-Link unter dem eigenen /api/share/frame/-Pfad (ROADMAP-Backlog)', async () => {
    apiFetch.mockResolvedValueOnce({ token: 'frame42', expiresAt: '2026-02-01T00:00:00.000Z' });
    const { result } = renderHook(() => useShare('board-1'));

    await act(async () => {
      await result.current.createFrameShare('data:image/png;base64,xyz');
    });

    expect(apiFetch).toHaveBeenCalledWith('/api/export/frame-share', {
      method: 'POST',
      body: JSON.stringify({ boardId: 'board-1', image: 'data:image/png;base64,xyz' }),
    });
    expect(result.current.frameShareUrl).toBe(`${window.location.origin}/api/share/frame/frame42`);
  });

  it('reset und resetFrameShare löschen jeweils nur ihren eigenen Zustand, nicht den anderen', async () => {
    apiFetch.mockResolvedValueOnce({ token: 'a', expiresAt: 't1' });
    apiFetch.mockResolvedValueOnce({ token: 'b', expiresAt: 't2' });
    const { result } = renderHook(() => useShare('board-1'));

    await act(async () => {
      await result.current.createShareLink();
      await result.current.createFrameShare('img');
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.shareUrl).toBeNull();
    });
    expect(result.current.frameShareUrl).toBe(`${window.location.origin}/api/share/frame/b`);
  });
});

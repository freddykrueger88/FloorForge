import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExport } from './useExport.js';

const frames = [{ id: 'f1' }, { id: 'f2' }];
const renderFrame = vi.fn().mockResolvedValue('data:image/png;base64,xyz');

describe('useExport – Status-Polling', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('surfaced einen Fehler und stoppt das Polling, wenn der Status-Endpunkt nicht-OK antwortet (z.B. Job nach Backend-Neustart verloren)', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ jobId: 'job-1' }) })
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({ message: 'Job nicht gefunden.' }) });

    const { result } = renderHook(() => useExport());

    await act(async () => {
      await result.current.startExport({ frames, renderFrame });
    });
    expect(result.current.status).toBe('processing');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1300));
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Job nicht gefunden.');

    // Nach dem Fehler darf nicht weiter gepollt werden
    const callsAfterError = fetchMock.mock.calls.length;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1300));
    });
    expect(fetchMock.mock.calls.length).toBe(callsAfterError);
  });

  it('stoppt das Polling beim Unmounten der Komponente (kein Hintergrund-Leak)', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ jobId: 'job-2' }) })
      .mockResolvedValue({ ok: true, json: async () => ({ status: 'processing', progress: 10 }) });

    const { result, unmount } = renderHook(() => useExport());

    await act(async () => {
      await result.current.startExport({ frames, renderFrame });
    });

    unmount();
    const callsAtUnmount = fetchMock.mock.calls.length;

    await new Promise((resolve) => setTimeout(resolve, 1300));
    expect(fetchMock.mock.calls.length).toBe(callsAtUnmount);
  });
});

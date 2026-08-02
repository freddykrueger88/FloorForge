/**
 * useExport – GIF-Export Hook
 * Issue #15 – v0.5.0
 *
 * Rendert alle Board-Frames als PNG via Konva Stage.toDataURL(),
 * schickt sie ans Backend und pollt den Job-Status.
 */
import { useState, useCallback, useRef } from 'react';

const API = import.meta.env.VITE_API_URL ?? '';
const POLL_INTERVAL_MS = 1200;

export function useExport() {
  const [status,   setStatus  ] = useState('idle'); // idle | rendering | uploading | processing | done | error
  const [progress, setProgress] = useState(0);
  const [gifUrl,   setGifUrl  ] = useState(null);
  const [error,    setError   ] = useState(null);
  const pollRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(pollRef.current);
    setStatus('idle');
    setProgress(0);
    setGifUrl(null);
    setError(null);
  }, []);

  /**
   * stageRef: React ref zu einer Konva Stage-Instanz (per board frame)
   * frames:   Array der Board-Frames (mit .players und .elements)
   * opts:     { fps, width, loop }
   *
   * Weil alle Frames in der gleichen Stage gerendert werden müssen,
   * nimmt der Hook eine render-Funktion entgegen:
   * renderFrame(frame) => Promise<string>  (data:image/png;base64,...)
   */
  const startExport = useCallback(async ({ frames, renderFrame, fps = 4, width = 720, loop = true }) => {
    if (!frames?.length || frames.length < 2) {
      setError('Mindestens 2 Frames benötigt.');
      setStatus('error');
      return;
    }

    reset();
    setStatus('rendering');

    try {
      // 1. Alle Frames als PNG rendern
      const pngs = [];
      for (let i = 0; i < frames.length; i++) {
        const dataUrl = await renderFrame(frames[i]);
        pngs.push(dataUrl);
        setProgress(Math.round(((i + 1) / frames.length) * 40)); // 0-40%
      }

      // 2. PNGs ans Backend senden
      setStatus('uploading');
      setProgress(45);
      const res = await fetch(`${API}/api/export/gif`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ frames: pngs, fps, width, loop }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }

      const { jobId } = await res.json();
      setStatus('processing');
      setProgress(50);

      // 3. Status pollen
      pollRef.current = setInterval(async () => {
        try {
          const pr = await fetch(`${API}/api/export/status/${jobId}`, { credentials: 'include' });
          const data = await pr.json();
          setProgress(50 + Math.round((data.progress ?? 0) * 0.5)); // 50-100%
          if (data.status === 'done') {
            clearInterval(pollRef.current);
            setGifUrl(`${API}/api/export/download/${jobId}`);
            setStatus('done');
            setProgress(100);
          } else if (data.status === 'error') {
            clearInterval(pollRef.current);
            throw new Error(data.message ?? 'Export fehlgeschlagen.');
          }
        } catch (pollErr) {
          clearInterval(pollRef.current);
          setError(pollErr.message);
          setStatus('error');
        }
      }, POLL_INTERVAL_MS);

    } catch (err) {
      clearInterval(pollRef.current);
      setError(err.message);
      setStatus('error');
    }
  }, [reset]);

  return { status, progress, gifUrl, error, startExport, reset };
}

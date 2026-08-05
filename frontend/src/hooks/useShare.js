/**
 * useShare – Öffentliche Share-Links erzeugen (Issue #16 – v0.5.0)
 * + Einzel-Frame-Share (ROADMAP-Backlog: schnelles Teilen eines Frames
 * als Bild ohne Login, z.B. für WhatsApp)
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useShare(boardId) {
  const [loading,   setLoading  ] = useState(false);
  const [error,     setError    ] = useState(null);
  const [shareUrl,  setShareUrl ] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const [frameLoading,   setFrameLoading  ] = useState(false);
  const [frameError,     setFrameError    ] = useState(null);
  const [frameShareUrl,  setFrameShareUrl ] = useState(null);
  const [frameExpiresAt, setFrameExpiresAt] = useState(null);

  const createShareLink = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/boards/${boardId}/share`, { method: 'POST' });
      const url = `${window.location.origin}/share/${data.token}`;
      setShareUrl(url);
      setExpiresAt(data.expiresAt);
      return { url, expiresAt: data.expiresAt };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createFrameShare = useCallback(async (image) => {
    setFrameLoading(true);
    setFrameError(null);
    try {
      const data = await apiFetch('/api/export/frame-share', {
        method: 'POST',
        body: JSON.stringify({ boardId, image }),
      });
      const url = `${window.location.origin}/api/share/frame/${data.token}`;
      setFrameShareUrl(url);
      setFrameExpiresAt(data.expiresAt);
      return { url, expiresAt: data.expiresAt };
    } catch (err) {
      setFrameError(err.message);
      throw err;
    } finally {
      setFrameLoading(false);
    }
  }, [boardId]);

  const reset = useCallback(() => {
    setShareUrl(null);
    setExpiresAt(null);
    setError(null);
  }, []);

  const resetFrameShare = useCallback(() => {
    setFrameShareUrl(null);
    setFrameExpiresAt(null);
    setFrameError(null);
  }, []);

  return {
    loading, error, shareUrl, expiresAt, createShareLink, reset,
    frameLoading, frameError, frameShareUrl, frameExpiresAt,
    createFrameShare, resetFrameShare,
  };
}

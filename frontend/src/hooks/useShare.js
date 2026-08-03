/**
 * useShare – Öffentliche Share-Links erzeugen (Issue #16 – v0.5.0)
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useShare(boardId) {
  const [loading,   setLoading  ] = useState(false);
  const [error,     setError    ] = useState(null);
  const [shareUrl,  setShareUrl ] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

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

  const reset = useCallback(() => {
    setShareUrl(null);
    setExpiresAt(null);
    setError(null);
  }, []);

  return { loading, error, shareUrl, expiresAt, createShareLink, reset };
}

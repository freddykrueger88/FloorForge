/**
 * useVersions – Board-Versionierung (ROADMAP Phase 2). Automatische
 * Snapshots entstehen serverseitig bei jedem Speichern (siehe
 * backend/src/controllers/framesController.js), dieser Hook liest die
 * Liste, ruft einzelne Snapshots ab und stellt sie wieder her.
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useVersions(boardId) {
  const [versions, setVersions] = useState([]);
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState(null);

  const basePath = `/api/boards/${boardId}/versions`;

  const fetchVersions = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const data = await apiFetch(basePath);
      setVersions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [basePath, boardId]);

  const fetchVersion = useCallback(async (versionId) => {
    try {
      return await apiFetch(`${basePath}/${versionId}`);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [basePath]);

  const restoreVersion = useCallback(async (versionId) => {
    try {
      const frames = await apiFetch(`${basePath}/${versionId}/restore`, { method: 'POST' });
      return frames;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [basePath]);

  return {
    versions, loading, error,
    fetchVersions, fetchVersion, restoreVersion,
  };
}

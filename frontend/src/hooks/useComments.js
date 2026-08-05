/**
 * useComments – Kommentare auf Boards und Trainingseinheiten (ROADMAP
 * Phase 2). Struktur analog useBoardCollaborators.js, parametrisiert
 * über resourceKind ('boards' | 'trainings') + resourceId, da beide
 * Ressourcentypen dieselbe API-Form unter unterschiedlichen
 * Mountpunkten teilen (siehe backend/src/routes/comments.js).
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useComments(resourceKind, resourceId) {
  const [comments, setComments] = useState([]);
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState(null);

  const basePath = `/api/${resourceKind}/${resourceId}/comments`;

  const fetchComments = useCallback(async () => {
    if (!resourceId) return;
    setLoading(true);
    try {
      const data = await apiFetch(basePath);
      setComments(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [basePath, resourceId]);

  const addComment = useCallback(async (text) => {
    try {
      const comment = await apiFetch(basePath, { method: 'POST', body: JSON.stringify({ text }) });
      setComments((prev) => [...prev, comment]);
      return comment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [basePath]);

  const updateComment = useCallback(async (commentId, text) => {
    try {
      const updated = await apiFetch(`${basePath}/${commentId}`, { method: 'PUT', body: JSON.stringify({ text }) });
      setComments((prev) => prev.map((c) => c._id === commentId ? updated : c));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [basePath]);

  const deleteComment = useCallback(async (commentId) => {
    try {
      await apiFetch(`${basePath}/${commentId}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [basePath]);

  return {
    comments, loading, error,
    fetchComments, addComment, updateComment, deleteComment,
  };
}

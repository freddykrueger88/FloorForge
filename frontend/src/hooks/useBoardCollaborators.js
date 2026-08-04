/**
 * useBoardCollaborators – Board-Sharing (Issue #51 MVP)
 * Owner-only API-Hook für die Kollaboratoren eines Boards.
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

export function useBoardCollaborators() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading,       setLoading      ] = useState(false);
  const [error,         setError        ] = useState(null);

  const fetchCollaborators = useCallback(async (boardId) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/boards/${boardId}/collaborators`);
      setCollaborators(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCollaborator = useCallback(async (boardId, { email, permission }) => {
    try {
      const newCollaborator = await apiFetch(`/api/boards/${boardId}/collaborators`, {
        method: 'POST',
        body: JSON.stringify({ email, permission }),
      });
      setCollaborators((prev) => [...prev, newCollaborator]);
      return newCollaborator;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updatePermission = useCallback(async (boardId, collaboratorId, permission) => {
    try {
      const updated = await apiFetch(`/api/boards/${boardId}/collaborators/${collaboratorId}`, {
        method: 'PUT',
        body: JSON.stringify({ permission }),
      });
      setCollaborators((prev) => prev.map((c) => c._id === collaboratorId ? updated : c));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeCollaborator = useCallback(async (boardId, collaboratorId) => {
    try {
      await apiFetch(`/api/boards/${boardId}/collaborators/${collaboratorId}`, { method: 'DELETE' });
      setCollaborators((prev) => prev.filter((c) => c._id !== collaboratorId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    collaborators, loading, error,
    fetchCollaborators, addCollaborator, updatePermission, removeCollaborator,
  };
}

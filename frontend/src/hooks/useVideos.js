/**
 * useVideos – Video-Integration MVP (ROADMAP-Backlog)
 * Upload/Liste/Löschen von Videoclips an einem Board.
 *
 * uploadVideo nutzt bewusst KEIN apiFetch: apiFetch setzt immer
 * Content-Type: application/json, das würde einen multipart/form-data-
 * Upload zerstören (der Browser muss die Boundary selbst setzen).
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch.js';

const BASE = (boardId) => `/api/boards/${boardId}/videos`;

export function useVideos(boardId) {
  const [videos,    setVideos   ] = useState([]);
  const [loading,   setLoading  ] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError    ] = useState(null);

  const fetchVideos = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(BASE(boardId));
      setVideos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const uploadVideo = useCallback(async (file, title) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('video', file);
      if (title) form.append('title', title);

      const res = await fetch(BASE(boardId), {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);

      setVideos((prev) => [...prev, json.data]);
      return json.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [boardId]);

  const deleteVideo = useCallback(async (videoId) => {
    try {
      await apiFetch(`${BASE(boardId)}/${videoId}`, { method: 'DELETE' });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [boardId]);

  const streamUrl = useCallback((videoId) => `${BASE(boardId)}/${videoId}/stream`, [boardId]);

  return { videos, loading, uploading, error, fetchVideos, uploadVideo, deleteVideo, streamUrl };
}

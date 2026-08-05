/**
 * useBackup – Daten-Export/Import (Issue #21)
 * Export lädt ein ZIP direkt herunter (Blob + versteckter <a>-Link),
 * Import schickt die Datei als multipart/form-data – daher fetch direkt
 * statt apiFetch (das immer Content-Type: application/json setzt).
 */
import { useState, useCallback } from 'react';

function filenameFromDisposition(header, fallback) {
  const match = /filename="([^"]+)"/.exec(header ?? '');
  return match?.[1] ?? fallback;
}

export function useBackup() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const exportData = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch('/api/user/export', { credentials: 'include' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const filename = filenameFromDisposition(res.headers.get('Content-Disposition'), 'openfloorball-backup.zip');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  const importData = useCallback(async (file) => {
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/user/import', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message ?? `HTTP ${res.status}`);
      }
      setImportResult(json.data);
      return json.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setImporting(false);
    }
  }, []);

  return { exporting, importing, error, importResult, exportData, importData };
}

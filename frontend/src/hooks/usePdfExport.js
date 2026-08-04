/**
 * usePdfExport – PDF-Taktikblatt-Export (Issue #24)
 * Synchroner POST (kein Job-Polling, anders als GIF/MP4 – pdfkit-Erzeugung
 * aus bereits gerenderten PNGs ist schnell genug für eine direkte Antwort).
 * Gleiches Blob-Download-Muster wie useBackup.js.
 */
import { useState, useCallback } from 'react';

function filenameFromDisposition(header, fallback) {
  const match = /filename="([^"]+)"/.exec(header ?? '');
  return match?.[1] ?? fallback;
}

export function usePdfExport() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportPdf = useCallback(async ({ boardName, frames, framesPerPage, paperSize, language }) => {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardName, frames, framesPerPage, paperSize, language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const filename = filenameFromDisposition(res.headers.get('Content-Disposition'), 'floorforge-taktikblatt.pdf');

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

  return { exporting, error, exportPdf };
}

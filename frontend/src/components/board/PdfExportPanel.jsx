/**
 * PdfExportPanel – PDF-Taktikblatt-Export UI
 * Issue #24 – v0.8.0
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePdfExport } from '../../hooks/usePdfExport.js';
import styles from './PdfExportPanel.module.css';

const FRAMES_PER_PAGE_OPTIONS = [1, 2, 4];
const GRID_COLS = { 1: 1, 2: 1, 4: 2 };

export default function PdfExportPanel({ frames, renderFrame, boardName }) {
  const { t, i18n } = useTranslation();
  const [framesPerPage, setFramesPerPage] = useState(2);
  const [paperSize,     setPaperSize    ] = useState('a4');
  const [notes,         setNotes        ] = useState([]);
  const [renderedFrames, setRenderedFrames] = useState(null);
  const [showPreview,   setShowPreview  ] = useState(false);
  const [rendering,     setRendering    ] = useState(false);
  const [error,         setError        ] = useState(null);

  const { exporting, error: exportError, exportPdf } = usePdfExport();

  // Notiz-Array an die aktuelle Frame-Anzahl anpassen, bestehenden Text je Index behalten
  useEffect(() => {
    setNotes((prev) => frames.map((_, i) => prev[i] ?? ''));
    setRenderedFrames(null);
    setShowPreview(false);
  }, [frames.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderAll = useCallback(async () => {
    setRendering(true);
    setError(null);
    try {
      const pngs = [];
      for (const frame of frames) {
        pngs.push(await renderFrame(frame));
      }
      setRenderedFrames(pngs);
      return pngs;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setRendering(false);
    }
  }, [frames, renderFrame]);

  const handlePreviewToggle = async () => {
    if (showPreview) { setShowPreview(false); return; }
    try {
      if (!renderedFrames) await renderAll();
      setShowPreview(true);
    } catch { /* Fehler wird bereits über error angezeigt */ }
  };

  const handleExport = async () => {
    try {
      const pngs = renderedFrames ?? await renderAll();
      await exportPdf({
        boardName,
        frames: pngs.map((image, i) => ({ image, note: notes[i] })),
        framesPerPage,
        paperSize,
        language: i18n.language,
      });
    } catch { /* Fehler wird bereits über error/exportError angezeigt */ }
  };

  const canExport = frames?.length >= 1 && !rendering && !exporting;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{t('pdfExport.title')}</h3>

      {frames?.length < 1 && (
        <p className={styles.hint}>{t('pdfExport.minFramesHint')}</p>
      )}

      <div className={styles.options}>
        <label className={styles.optLabel}>
          {t('pdfExport.framesPerPage')}
          <select
            className={styles.select}
            value={framesPerPage}
            onChange={(e) => { setFramesPerPage(Number(e.target.value)); setRenderedFrames(null); setShowPreview(false); }}
          >
            {FRAMES_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className={styles.optLabel}>
          {t('pdfExport.paperSize')}
          <select
            className={styles.select}
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
          >
            <option value="a4">A4</option>
            <option value="letter">{t('pdfExport.letter')}</option>
          </select>
        </label>
      </div>

      {frames?.length > 0 && (
        <div className={styles.notesList}>
          {frames.map((frame, i) => (
            <label key={frame._id ?? i} className={styles.noteRow}>
              <span className={styles.noteFrameLabel}>{t('frames.frameLabel', { number: i + 1 })}</span>
              <input
                type="text"
                className={styles.noteInput}
                value={notes[i] ?? ''}
                onChange={(e) => setNotes((prev) => prev.map((n, idx) => idx === i ? e.target.value : n))}
                placeholder={t('pdfExport.notePlaceholder')}
                maxLength={120}
              />
            </label>
          ))}
        </div>
      )}

      {(error || exportError) && (
        <p className={`${styles.statusMsg} ${styles.statusError}`}>⚠️ {error ?? exportError}</p>
      )}

      {showPreview && renderedFrames && (
        <div
          className={styles.previewGrid}
          style={{ gridTemplateColumns: `repeat(${GRID_COLS[framesPerPage]}, 1fr)` }}
        >
          {renderedFrames.map((png, i) => (
            <div key={i} className={styles.previewCell}>
              <img src={png} alt={t('frames.frameLabel', { number: i + 1 })} className={styles.previewImg} />
              {notes[i] && <p className={styles.previewNote}>{notes[i]}</p>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.resetBtn}
          onClick={handlePreviewToggle}
          disabled={!canExport}
        >
          {rendering ? t('pdfExport.rendering') : (showPreview ? t('pdfExport.hidePreview') : t('pdfExport.preview'))}
        </button>
        <button
          className={styles.exportBtn}
          onClick={handleExport}
          disabled={!canExport}
          aria-disabled={!canExport}
        >
          {exporting ? t('pdfExport.exporting') : t('pdfExport.create')}
        </button>
      </div>
    </div>
  );
}

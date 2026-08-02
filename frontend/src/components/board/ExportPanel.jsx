/**
 * ExportPanel – GIF-Export UI
 * Issue #15 – v0.5.0
 */
import { useState } from 'react';
import { useExport } from '../../hooks/useExport.js';
import styles from './ExportPanel.module.css';

const FPS_OPTIONS    = [1, 2, 3, 4, 5, 8, 10];
const WIDTH_OPTIONS  = [
  { value: 480,  label: '480p' },
  { value: 720,  label: '720p (Standard)' },
  { value: 1280, label: '1080p' },
];

export default function ExportPanel({ frames, renderFrame }) {
  const [fps,   setFps  ] = useState(4);
  const [width, setWidth] = useState(720);
  const [loop,  setLoop ] = useState(true);

  const { status, progress, gifUrl, error, startExport, reset } = useExport();

  const busy    = ['rendering', 'uploading', 'processing'].includes(status);
  const canExport = frames?.length >= 2 && !busy;

  const handleExport = () => {
    startExport({ frames, renderFrame, fps, width, loop });
  };

  const statusLabel = {
    idle:       null,
    rendering:  `🎨 Rendere Frames… ${progress}%`,
    uploading:  `☁️ Lade hoch…`,
    processing: `⚙️ FFmpeg läuft… ${progress}%`,
    done:       '✅ Export fertig!',
    error:      `⚠️ ${error}`,
  }[status];

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>📤 GIF-Export</h3>

      {frames?.length < 2 && (
        <p className={styles.hint}>Mindestens 2 Frames benötigt.</p>
      )}

      <div className={styles.options}>
        <label className={styles.optLabel}>
          FPS
          <select
            className={styles.select}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
            disabled={busy}
          >
            {FPS_OPTIONS.map((f) => (
              <option key={f} value={f}>{f} fps</option>
            ))}
          </select>
        </label>

        <label className={styles.optLabel}>
          Auflösung
          <select
            className={styles.select}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            disabled={busy}
          >
            {WIDTH_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            disabled={busy}
          />
          Loop
        </label>
      </div>

      {busy && (
        <div className={styles.progressBar} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      {statusLabel && (
        <p className={`${styles.statusMsg} ${status === 'error' ? styles.statusError : ''}`}>
          {statusLabel}
        </p>
      )}

      <div className={styles.actions}>
        {status === 'done' ? (
          <>
            <a
              href={gifUrl}
              download="floorforge.gif"
              className={styles.downloadBtn}
            >
              ⬇️ GIF herunterladen
            </a>
            <button className={styles.resetBtn} onClick={reset}>Neu exportieren</button>
          </>
        ) : (
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={!canExport}
            aria-disabled={!canExport}
          >
            {busy ? 'Exportiert…' : '🎬 GIF erstellen'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ExportPanel – GIF-Export UI
 * Issue #15 – v0.5.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { useExport } from '../../hooks/useExport.js';
import { useShare } from '../../hooks/useShare.js';
import styles from './ExportPanel.module.css';

const FPS_OPTIONS    = [1, 2, 3, 4, 5, 8, 10];
const WIDTH_OPTIONS  = [
  { value: 480,  label: '480p',  standard: false },
  { value: 720,  label: '720p',  standard: true  },
  { value: 1280, label: '1080p', standard: false },
];

function formatExpiry(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ExportPanel({ boardId, frames, renderFrame }) {
  const { t } = useTranslation();
  const [fps,   setFps  ] = useState(4);
  const [width, setWidth] = useState(720);
  const [loop,  setLoop ] = useState(true);

  const { status, progress, gifUrl, error, startExport, reset } = useExport();

  // Issue #16 – Share-Link
  const share = useShare(boardId);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied,    setCopied   ] = useState(false);

  const handleCreateShareLink = async () => {
    setCopied(false);
    try {
      const { url } = await share.createShareLink();
      setQrDataUrl(await QRCode.toDataURL(url, { width: 240, margin: 1 }));
    } catch {
      // Fehler wird über share.error angezeigt
    }
  };

  const handleCopy = async () => {
    if (!share.shareUrl) return;
    try {
      await navigator.clipboard.writeText(share.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Zwischenablage evtl. ohne Berechtigung – Link steht trotzdem im Feld zum manuellen Kopieren
    }
  };

  const busy    = ['rendering', 'uploading', 'processing'].includes(status);
  const canExport = frames?.length >= 2 && !busy;

  const handleExport = () => {
    startExport({ frames, renderFrame, fps, width, loop });
  };

  const statusLabel = {
    idle:       null,
    rendering:  t('export.rendering', { progress }),
    uploading:  t('export.uploading'),
    processing: t('export.processing', { progress }),
    done:       t('export.done'),
    error:      t('export.error', { error }),
  }[status];

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{t('export.title')}</h3>

      {frames?.length < 2 && (
        <p className={styles.hint}>{t('export.minFramesHint')}</p>
      )}

      <div className={styles.options}>
        <label className={styles.optLabel}>
          {t('export.fps')}
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
          {t('export.resolution')}
          <select
            className={styles.select}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            disabled={busy}
          >
            {WIDTH_OPTIONS.map(({ value, label, standard }) => (
              <option key={value} value={value}>{label}{standard ? ` (${t('export.standard')})` : ''}</option>
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
          {t('export.loop')}
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
              {t('export.download')}
            </a>
            <button className={styles.resetBtn} onClick={reset}>{t('export.exportAgain')}</button>
          </>
        ) : (
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={!canExport}
            aria-disabled={!canExport}
          >
            {busy ? t('export.exporting') : t('export.create')}
          </button>
        )}
      </div>

      <hr className={styles.divider} />

      {/* Issue #16 – Share-Link ohne Login */}
      <h3 className={styles.title}>{t('export.shareTitle')}</h3>
      <p className={styles.hint}>
        {t('export.shareHint')}
        {share.expiresAt && ` ${t('export.shareExpiry', { date: formatExpiry(share.expiresAt) })}`}
      </p>

      {share.error && (
        <p className={`${styles.statusMsg} ${styles.statusError}`}>{t('export.error', { error: share.error })}</p>
      )}

      {share.shareUrl ? (
        <>
          <div className={styles.shareRow}>
            <input
              type="text"
              readOnly
              value={share.shareUrl}
              className={styles.urlInput}
              onFocus={(e) => e.target.select()}
              aria-label={t('export.shareLinkAriaLabel')}
            />
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? t('export.copied') : t('export.copy')}
            </button>
          </div>
          {qrDataUrl && (
            <div className={styles.qrWrap}>
              <img src={qrDataUrl} alt={t('export.qrAlt')} />
            </div>
          )}
          <button className={styles.resetBtn} onClick={() => { share.reset(); setQrDataUrl(null); }}>
            {t('export.newLink')}
          </button>
        </>
      ) : (
        <button
          className={styles.exportBtn}
          onClick={handleCreateShareLink}
          disabled={share.loading || !frames?.length}
        >
          {share.loading ? t('export.creating') : t('export.createLink')}
        </button>
      )}
    </div>
  );
}

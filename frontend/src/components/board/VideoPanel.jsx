/**
 * VideoPanel – Video-Integration MVP (ROADMAP-Backlog)
 *
 * Upload + Liste + nativer Player für an ein Board angehängte Videoclips.
 * Bewusst KEIN Zeichnen über dem Video, kein Schnitt – siehe
 * videoController.js für die Umfangs-Begründung.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVideos } from '../../hooks/useVideos.js';
import styles from './VideoPanel.module.css';

const MAX_VIDEOS = 5;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoPanel({ boardId, canEdit }) {
  const { t } = useTranslation();
  const { videos, loading, uploading, error, fetchVideos, uploadVideo, deleteVideo, streamUrl } = useVideos(boardId);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadVideo(file, title.trim() || null);
      setTitle('');
    } catch {
      // Fehler wird über `error` angezeigt
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{t('video.title')}</h3>
      <p className={styles.hint}>{t('video.hint')}</p>

      {error && <p className={styles.errorMsg} role="alert">⚠️ {error}</p>}

      {canEdit && (
        <div className={styles.uploadRow}>
          <input
            type="text"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('video.titlePlaceholder')}
            maxLength={80}
            disabled={uploading || videos.length >= MAX_VIDEOS}
            aria-label={t('video.titlePlaceholder')}
          />
          <label className={styles.uploadBtn}>
            {uploading ? t('video.uploading') : t('video.upload')}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              disabled={uploading || videos.length >= MAX_VIDEOS}
              className={styles.fileInput}
            />
          </label>
        </div>
      )}
      {videos.length >= MAX_VIDEOS && (
        <p className={styles.hint}>{t('video.maxReached', { max: MAX_VIDEOS })}</p>
      )}

      {loading && videos.length === 0 ? (
        <p className={styles.hint}>{t('video.loading')}</p>
      ) : videos.length === 0 ? (
        <p className={styles.hint}>{t('video.empty')}</p>
      ) : (
        <ul className={styles.list} role="list">
          {videos.map((v) => (
            <li key={v._id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{v.title || v.filename}</span>
                <span className={styles.itemMeta}>{formatSize(v.sizeBytes)}</span>
                {canEdit && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteVideo(v._id)}
                    aria-label={t('video.deleteAriaLabel', { title: v.title || v.filename })}
                    title={t('video.delete')}
                  >
                    🗑
                  </button>
                )}
              </div>
              <video className={styles.player} controls preload="metadata" src={streamUrl(v._id)}>
                {t('video.notSupported')}
              </video>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

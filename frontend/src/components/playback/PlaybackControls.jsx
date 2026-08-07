/**
 * PlaybackControls – Play/Pause/Stop, Geschwindigkeit, Loop, Fortschritt
 * (Issue #11 – v0.3.0)
 */
import { useTranslation } from 'react-i18next';
import { Square, Pause, Play, Repeat } from 'lucide-react';
import useAnnounceStore from '../../store/announceStore.js';
import Button from '../common/Button.jsx';
import styles from './PlaybackControls.module.css';

export default function PlaybackControls({
  playing,
  canPlay,
  togglePlay,
  stop,
  speed,
  speeds = [0.5, 1, 2, 3],
  setSpeed,
  loop,
  setLoop,
  activeIndex,
  frameCount,
  progress = 0,
}) {
  const { t } = useTranslation();
  const announce = useAnnounceStore((s) => s.announce);

  const handleStop = () => { announce(t('playback.announceStop')); stop(); };
  const handleTogglePlay = () => { announce(playing ? t('playback.announcePause') : t('playback.announcePlay')); togglePlay(); };
  const handleSetSpeed = (s) => { announce(t('playback.announceSpeed', { speed: s })); setSpeed(s); };
  const handleToggleLoop = () => { announce(loop ? t('playback.announceLoopOff') : t('playback.announceLoopOn')); setLoop((v) => !v); };

  return (
    <div className={styles.controls} role="group" aria-label={t('playback.controlsLabel')}>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={handleStop}
        disabled={!playing && activeIndex === 0}
        aria-label={t('playback.stopAriaLabel')}
        title={t('playback.stop')}
      >
        <Square size={16} aria-hidden="true" />
      </Button>

      <Button
        variant="primary"
        size="sm"
        iconOnly
        onClick={handleTogglePlay}
        disabled={!canPlay}
        aria-label={playing ? t('playback.pause') : t('playback.play')}
        title={playing ? t('playback.pauseTitle') : t('playback.playTitle')}
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </Button>

      {/* Fortschrittsbalken */}
      <div className={styles.progressWrap} aria-hidden="true">
        <div
          className={styles.progressBar}
          style={{ width: `${((activeIndex + progress) / Math.max(1, frameCount - 1)) * 100}%` }}
        />
      </div>

      {/* Geschwindigkeit */}
      <div className={styles.speedGroup} role="radiogroup" aria-label={t('playback.speedGroupLabel')}>
        {speeds.map((s) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${s === speed ? styles.speedActive : ''}`}
            onClick={() => handleSetSpeed(s)}
            role="radio"
            aria-checked={s === speed}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Loop */}
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        className={loop ? styles.loopActive : ''}
        onClick={handleToggleLoop}
        aria-pressed={loop}
        aria-label={t('playback.loopAriaLabel')}
        title={t('playback.loop')}
      >
        <Repeat size={16} aria-hidden="true" />
      </Button>

      <span className={styles.frameLabel} aria-live="polite">
        {t('playback.frameLabel', { current: Math.min(activeIndex + 1, frameCount), total: frameCount })}
      </span>
    </div>
  );
}

/**
 * PlaybackControls – Play/Pause/Stop, Geschwindigkeit, Loop, Fortschritt
 * (Issue #11 – v0.3.0)
 */
import useAnnounceStore from '../../store/announceStore.js';
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
  const announce = useAnnounceStore((s) => s.announce);

  const handleStop = () => { announce('Zurück zu Frame 1'); stop(); };
  const handleTogglePlay = () => { announce(playing ? 'Wiedergabe pausiert' : 'Wiedergabe gestartet'); togglePlay(); };
  const handleSetSpeed = (s) => { announce(`Geschwindigkeit ${s}x`); setSpeed(s); };
  const handleToggleLoop = () => { announce(loop ? 'Wiederholung deaktiviert' : 'Wiederholung aktiviert'); setLoop((v) => !v); };

  return (
    <div className={styles.controls} role="group" aria-label="Wiedergabe-Steuerung">
      <button
        className={styles.iconBtn}
        onClick={handleStop}
        disabled={!playing && activeIndex === 0}
        aria-label="Stopp – zurück zu Frame 1"
        title="Stopp"
      >
        <span aria-hidden="true">⏹</span>
      </button>

      <button
        className={`${styles.iconBtn} ${styles.playBtn}`}
        onClick={handleTogglePlay}
        disabled={!canPlay}
        aria-label={playing ? 'Pausieren' : 'Abspielen'}
        title={playing ? 'Pausieren (Leertaste)' : 'Abspielen (Leertaste)'}
      >
        <span aria-hidden="true">{playing ? '⏸' : '▶'}</span>
      </button>

      {/* Fortschrittsbalken */}
      <div className={styles.progressWrap} aria-hidden="true">
        <div
          className={styles.progressBar}
          style={{ width: `${((activeIndex + progress) / Math.max(1, frameCount - 1)) * 100}%` }}
        />
      </div>

      {/* Geschwindigkeit */}
      <div className={styles.speedGroup} role="radiogroup" aria-label="Wiedergabegeschwindigkeit">
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
      <button
        className={`${styles.iconBtn} ${loop ? styles.loopActive : ''}`}
        onClick={handleToggleLoop}
        aria-pressed={loop}
        aria-label="Wiederholung ein-/ausschalten"
        title="Loop"
      >
        <span aria-hidden="true">🔁</span>
      </button>

      <span className={styles.frameLabel} aria-live="polite">
        Frame {Math.min(activeIndex + 1, frameCount)} / {frameCount}
      </span>
    </div>
  );
}

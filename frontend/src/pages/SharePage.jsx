/**
 * SharePage – Öffentliche, read-only Ansicht eines geteilten Spielzugs
 * (Issue #16 – v0.5.0). Kein Login nötig, kein Editieren möglich.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FieldContainer from '../components/field/FieldContainer.jsx';
import { PlaybackControls } from '../components/playback/index.js';
import { useAnimation } from '../hooks/useAnimation.js';
import { teamColorToFillStroke } from '../utils/color.js';
import styles from './SharePage.module.css';

export default function SharePage() {
  const { token } = useParams();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/share/${token}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message ?? 'Link ungültig oder abgelaufen');
        return json.data;
      })
      .then((data) => { if (!cancelled) setBoard(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const frames = board?.frames ?? [];
  const anim = useAnimation({ frames, activeIndex, goToFrame: setActiveIndex });
  const displayedPlayers = anim.playing ? anim.displayPlayers : (frames[activeIndex]?.players ?? []);

  if (loading) {
    return (
      <main className={styles.page} role="main" aria-busy="true">
        <p className={styles.centerMsg}>Wird geladen…</p>
      </main>
    );
  }

  if (error || !board) {
    return (
      <main className={styles.page} role="main">
        <p className={styles.centerMsg} role="alert">⚠️ {error ?? 'Link ungültig oder abgelaufen'}</p>
      </main>
    );
  }

  const homeColor = teamColorToFillStroke(board.homeColor, '#1d4ed8');
  const awayColor = teamColorToFillStroke(board.awayColor, '#dc2626');

  return (
    <main className={styles.page} role="main">
      <header className={styles.header}>
        <h1 className={styles.title}>{board.name}</h1>
        <span className={styles.badge}>👁 Nur-Lese-Ansicht — geteilt ohne Login</span>
      </header>

      <PlaybackControls
        playing={anim.playing}
        canPlay={anim.canPlay}
        togglePlay={anim.togglePlay}
        stop={anim.stop}
        speed={anim.speed}
        speeds={anim.speeds}
        setSpeed={anim.setSpeed}
        loop={anim.loop}
        setLoop={anim.setLoop}
        activeIndex={activeIndex}
        frameCount={frames.length}
        progress={anim.progress}
      />

      <div className={styles.fieldArea}>
        <FieldContainer
          fieldType={board.fieldType}
          theme={board.theme ?? 'dark'}
          readonly
          players={displayedPlayers}
          homeColor={homeColor}
          awayColor={awayColor}
          ballColor={board.ballColor}
          showNames={board.showNames}
          namePosition={board.namePosition}
          drawingElements={frames[activeIndex]?.elements ?? []}
        />
      </div>
    </main>
  );
}

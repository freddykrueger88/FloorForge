/**
 * BoardEditorPage – Die Taktik-Ansicht eines einzelnen Boards
 *
 * Verbindet:
 *  - FieldContainer (Spielfeld + Spieler + Zeichnungen)
 *  - FrameTimeline (Frame-Verwaltung)
 *  - PlaybackControls + useAnimation (Issue #11)
 *  - useAutoSave (Positionsänderungen des aktiven Frames sichern)
 */
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import FieldContainer from '../components/field/FieldContainer.jsx';
import FieldToolbar from '../components/field/FieldToolbar.jsx';
import PlayerInfoPanel from '../components/field/PlayerInfoPanel.jsx';
import { FrameTimeline } from '../components/frames/index.js';
import { PlaybackControls } from '../components/playback/index.js';
import { NotesPanel } from '../components/board/index.js';

import { useBoardsApi } from '../hooks/useBoardsApi.js';
import { useFrames } from '../hooks/useFrames.js';
import { useField } from '../hooks/useField.js';
import { useDrawing } from '../hooks/useDrawing.js';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { useAnimation } from '../hooks/useAnimation.js';

import styles from './BoardEditorPage.module.css';

export default function BoardEditorPage() {
  const { id: boardId } = useParams();
  const { t } = useTranslation();

  const { fetchBoard, updateBoard } = useBoardsApi();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState('');

  const field = useField('large');
  const {
    frames, activeFrame, activeIndex, loading: framesLoading,
    loadFrames, addFrame, updateFrame, deleteFrame, reorderFrames, goToFrame,
  } = useFrames(boardId);

  const drawing = useDrawing();

  // Live-Spielerpositionen des aktiven Frames (editierbar per Drag & Drop)
  const [livePlayers, setLivePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  // Spielername auf Token (Issue #29)
  const [showNames, setShowNames] = useState(false);
  const [namePosition, setNamePosition] = useState('unten');

  const handleNameChange = useCallback((id, name) => {
    setLivePlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  // Animation (Issue #11)
  const anim = useAnimation({ frames, activeIndex, goToFrame });

  // Board + Frames initial laden
  useEffect(() => {
    if (!boardId) return;
    fetchBoard(boardId).then((b) => { setBoard(b); setNotes(b?.notes ?? ''); }).catch(() => {});
    loadFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Auto-Save der Notizen (Issue #30) – unabhängig vom Frame-Autosave
  const saveNotes = useCallback(async (nextNotes) => {
    if (!boardId) return;
    await updateBoard(boardId, { notes: nextNotes });
  }, [boardId, updateBoard]);

  useAutoSave(notes, saveNotes, !!board);

  // Wenn sich der aktive Frame ändert (und nicht gerade animiert wird), Live-Zustand übernehmen
  useEffect(() => {
    if (anim.playing) return;
    setLivePlayers(activeFrame?.players ?? []);
    drawing.loadElements(activeFrame?.elements ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFrame?._id, anim.playing]);

  // Auto-Save: Positionsänderungen des aktiven Frames zurückschreiben
  const saveActiveFrame = useCallback(async (players) => {
    if (!activeFrame?._id) return;
    await updateFrame(activeFrame._id, { players, elements: drawing.elements });
  }, [activeFrame, updateFrame, drawing.elements]);

  const { status: saveStatus } = useAutoSave(
    livePlayers,
    saveActiveFrame,
    !!activeFrame && !anim.playing,
  );

  const handleDragEndPlayer = useCallback((id, x, y) => {
    setLivePlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  }, []);

  const displayedPlayers = anim.playing ? anim.displayPlayers : livePlayers;

  return (
    <main className={styles.page} role="main">
      <header className={styles.header}>
        <Link to="/boards" className={styles.backLink} aria-label="Zurück zur Board-Übersicht">←</Link>
        <h1 className={styles.title}>{board?.name ?? t('board.untitled', 'Unbenanntes Board')}</h1>
        <span className={styles.saveStatus} aria-live="polite">
          {saveStatus === 'saving' && '💾 Speichert…'}
          {saveStatus === 'saved'  && '✓ Gespeichert'}
          {saveStatus === 'error'  && '⚠ Fehler beim Speichern'}
        </span>
        <FieldToolbar
          showNames={showNames}
          onToggleShowNames={() => setShowNames((v) => !v)}
          namePosition={namePosition}
          onSetNamePosition={setNamePosition}
        />
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

      <div className={styles.body}>
        <div className={styles.fieldArea}>
          <FieldContainer
            fieldType={field.fieldType}
            showGrid={field.showGrid}
            gridSize={field.gridSize}
            theme="dark"
            readonly={anim.playing}
            players={displayedPlayers}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            onDragEndPlayer={handleDragEndPlayer}
            drawingElements={anim.playing ? (activeFrame?.elements ?? []) : drawing.elements}
            selectedDrawingId={drawing.selectedId}
            activeTool={drawing.activeTool}
            showNames={showNames}
            namePosition={namePosition}
          />

          {!anim.playing && selectedPlayerId && (
            <div className={styles.infoPanelWrap}>
              <PlayerInfoPanel
                player={livePlayers.find((p) => p.id === selectedPlayerId)}
                onClose={() => setSelectedPlayerId(null)}
                onNameChange={handleNameChange}
              />
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <NotesPanel value={notes} onChange={setNotes} />
        </div>
      </div>

      <FrameTimeline
        frames={frames}
        activeIndex={activeIndex}
        onSelect={goToFrame}
        onAdd={() => addFrame(livePlayers, drawing.elements)}
        onDelete={deleteFrame}
        onReorder={reorderFrames}
        loading={framesLoading}
        currentPlayers={livePlayers}
        currentElements={drawing.elements}
      />
    </main>
  );
}

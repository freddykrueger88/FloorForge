/**
 * BoardEditorPage – Die Taktik-Ansicht eines einzelnen Boards
 *
 * Verbindet:
 *  - FieldContainer (Spielfeld + Spieler + Zeichnungen)
 *  - FrameTimeline (Frame-Verwaltung)
 *  - PlaybackControls + useAnimation (Issue #11)
 *  - useAutoSave (Positionsränderungen des aktiven Frames sichern)
 *  - TeamColorPanel (Issue #14 – v0.4.0)
 *  - ExportPanel (Issue #15 – v0.5.0)
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { buildDefaultPlayers, IFF_FIELDS, DEFAULT_TEAM_COLORS, IFF_BALL_COLORS } from '../constants/fieldConfig.js';
import { rescalePlayers, rescaleElements } from '../utils/fieldRescale.js';

import FieldContainer from '../components/field/FieldContainer.jsx';
import FieldToolbar from '../components/field/FieldToolbar.jsx';
import FieldTypeChangeDialog from '../components/field/FieldTypeChangeDialog.jsx';
import PlayerInfoPanel from '../components/field/PlayerInfoPanel.jsx';
import TeamColorPanel from '../components/field/TeamColorPanel.jsx';
import PlayerAccessibleList from '../components/field/PlayerAccessibleList.jsx';
import { DrawingToolbar } from '../components/drawing/index.js';
import { FrameTimeline } from '../components/frames/index.js';
import { PlaybackControls } from '../components/playback/index.js';
import { NotesPanel, ExportPanel } from '../components/board/index.js';
import { LinesPanel } from '../components/lines/index.js';

import { useBoardsApi } from '../hooks/useBoardsApi.js';
import { useFrames } from '../hooks/useFrames.js';
import { useLines } from '../hooks/useLines.js';
import { useField } from '../hooks/useField.js';
import { useDrawing } from '../hooks/useDrawing.js';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { useAnimation } from '../hooks/useAnimation.js';

import styles from './BoardEditorPage.module.css';

const PLAYER_MARGIN_M = 0.8;
const DEFAULT_BALL_COLOR = IFF_BALL_COLORS.find((c) => c.id === 'orange')?.hex ?? '#f97316';
const EXPORT_W = 1280;
const EXPORT_H = 720;

export default function BoardEditorPage() {
  const { id: boardId } = useParams();
  const { t } = useTranslation();

  const { fetchBoard, updateBoard } = useBoardsApi();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState('');

  // Issue #14 – Teamfarben & Ball
  const [homeColor, setHomeColor] = useState({ fill: DEFAULT_TEAM_COLORS.home.fill, stroke: DEFAULT_TEAM_COLORS.home.stroke });
  const [awayColor, setAwayColor] = useState({ fill: DEFAULT_TEAM_COLORS.away.fill, stroke: DEFAULT_TEAM_COLORS.away.stroke });
  const [ballColor, setBallColor] = useState(DEFAULT_BALL_COLOR);

  const handleChangeHomeColor = useCallback((color) => {
    setHomeColor(color);
    updateBoard(boardId, { homeColor: color }).catch(() => {});
  }, [boardId, updateBoard]);

  const handleChangeAwayColor = useCallback((color) => {
    setAwayColor(color);
    updateBoard(boardId, { awayColor: color }).catch(() => {});
  }, [boardId, updateBoard]);

  const handleChangeBallColor = useCallback((hex) => {
    setBallColor(hex);
    updateBoard(boardId, { ballColor: hex }).catch(() => {});
  }, [boardId, updateBoard]);

  const field = useField('large');
  const {
    frames, activeFrame, activeIndex, loading: framesLoading,
    loadFrames, addFrame, updateFrame, deleteFrame, reorderFrames, goToFrame,
  } = useFrames(boardId);

  const drawing = useDrawing();
  const lines = useLines(boardId);

  const [livePlayers, setLivePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const [showNames, setShowNames] = useState(false);
  const [namePosition, setNamePosition] = useState('unten');

  // Positions-Hinweise bei Hover (Issue #27)
  const [showHints, setShowHints] = useState(
    () => localStorage.getItem('floorforge:showHints') !== 'false'
  );
  const toggleShowHints = useCallback(() => {
    setShowHints((v) => {
      const next = !v;
      localStorage.setItem('floorforge:showHints', String(next));
      return next;
    });
  }, []);

  const handleNameChange = useCallback((id, name) => {
    setLivePlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  const anim = useAnimation({ frames, activeIndex, goToFrame });

  useEffect(() => {
    if (!boardId) return;
    fetchBoard(boardId).then((b) => {
      setBoard(b);
      setNotes(b?.notes ?? '');
      if (b?.fieldType) field.setFieldType(b.fieldType);
      if (b?.homeColor) setHomeColor(b.homeColor);
      if (b?.awayColor) setAwayColor(b.awayColor);
      if (b?.ballColor) setBallColor(b.ballColor);
      lines.loadLines(b?.activeLineId ?? null);
    }).catch(() => {});
    loadFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const seededRef = useRef(null);
  useEffect(() => { seededRef.current = null; }, [boardId]);
  useEffect(() => {
    if (!board || framesLoading || frames.length > 0) return;
    if (seededRef.current === boardId) return;
    seededRef.current = boardId;
    addFrame(buildDefaultPlayers(board.fieldType), []);
  }, [board, framesLoading, frames.length, boardId, addFrame]);

  const saveNotes = useCallback(async (nextNotes) => {
    if (!boardId) return;
    await updateBoard(boardId, { notes: nextNotes });
  }, [boardId, updateBoard]);

  useAutoSave(notes, saveNotes, !!board);

  useEffect(() => {
    if (anim.playing) return;
    setLivePlayers(activeFrame?.players ?? []);
    drawing.loadElements(activeFrame?.elements ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFrame?._id, anim.playing]);

  const saveActiveFrame = useCallback(async (players) => {
    if (!activeFrame?._id) return;
    await updateFrame(activeFrame._id, { players, elements: drawing.elements });
  }, [activeFrame, updateFrame, drawing.elements]);

  const { status: saveStatus } = useAutoSave(
    livePlayers,
    saveActiveFrame,
    !!activeFrame && !anim.playing,
  );

  const handleDragEndPlayer = useCallback((id, rawX, rawY) => {
    const currentField = IFF_FIELDS[field.fieldType] ?? IFF_FIELDS.large;
    const x = Math.max(PLAYER_MARGIN_M, Math.min(currentField.width  - PLAYER_MARGIN_M, rawX));
    const y = Math.max(PLAYER_MARGIN_M, Math.min(currentField.height - PLAYER_MARGIN_M, rawY));
    setLivePlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  }, [field.fieldType]);

  const displayedPlayers = anim.playing ? anim.displayPlayers : livePlayers;

  const [pendingFieldType, setPendingFieldType] = useState(null);
  const [changingField, setChangingField] = useState(false);

  const handleRequestFieldTypeChange = useCallback((newType) => {
    if (newType === field.fieldType) return;
    setPendingFieldType(newType);
  }, [field.fieldType]);

  const handleConfirmFieldTypeChange = useCallback(async () => {
    if (!pendingFieldType) return;
    const oldField = IFF_FIELDS[field.fieldType] ?? IFF_FIELDS.large;
    const newField = IFF_FIELDS[pendingFieldType] ?? IFF_FIELDS.large;
    const scaleX = newField.width / oldField.width;
    const scaleY = newField.height / oldField.height;

    setChangingField(true);
    try {
      await updateBoard(boardId, { fieldType: pendingFieldType });

      const rescaledLive = rescalePlayers(livePlayers, scaleX, scaleY);
      const rescaledElements = rescaleElements(drawing.elements, scaleX, scaleY);
      setLivePlayers(rescaledLive);
      drawing.loadElements(rescaledElements);
      if (activeFrame?._id) {
        await updateFrame(activeFrame._id, { players: rescaledLive, elements: rescaledElements });
      }

      await Promise.all(
        frames
          .filter((f) => f._id !== activeFrame?._id)
          .map((f) => updateFrame(f._id, {
            players:  rescalePlayers(f.players, scaleX, scaleY),
            elements: rescaleElements(f.elements, scaleX, scaleY),
          }))
      );

      field.setFieldType(pendingFieldType);
      setBoard((b) => ({ ...b, fieldType: pendingFieldType }));
    } finally {
      setChangingField(false);
      setPendingFieldType(null);
    }
  }, [pendingFieldType, field, boardId, updateBoard, livePlayers, drawing, activeFrame, updateFrame, frames]);

  // Issue #15 – renderFrame: rendert einen Frame offline als PNG via Konva
  // Nutzt Konva.Stage direkt (kein React), um ein unsichtbares Canvas zu erstellen
  const renderFrame = useCallback(async (frame) => {
    const { default: FloorballFieldStatic } = await import('../components/field/FloorballFieldStatic.js');
    return FloorballFieldStatic({
      fieldType: field.fieldType,
      width: EXPORT_W,
      height: EXPORT_H,
      players: frame.players ?? [],
      elements: frame.elements ?? [],
      homeColor,
      awayColor,
      ballColor,
    });
  }, [field.fieldType, homeColor, awayColor, ballColor]);

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
        <div className={styles.headerControls}>
          <TeamColorPanel
            homeColor={homeColor}
            awayColor={awayColor}
            ballColor={ballColor}
            onChangeHomeColor={handleChangeHomeColor}
            onChangeAwayColor={handleChangeAwayColor}
            onChangeBallColor={handleChangeBallColor}
          />
          <FieldToolbar
            showNames={showNames}
            onToggleShowNames={() => setShowNames((v) => !v)}
            namePosition={namePosition}
            onSetNamePosition={setNamePosition}
            fieldType={field.fieldType}
            availableFields={field.availableFields}
            onRequestFieldTypeChange={handleRequestFieldTypeChange}
            showHints={showHints}
            onToggleShowHints={toggleShowHints}
          />
        </div>
      </header>

      {pendingFieldType && (
        <FieldTypeChangeDialog
          targetLabel={IFF_FIELDS[pendingFieldType]?.label ?? pendingFieldType}
          onConfirm={handleConfirmFieldTypeChange}
          onCancel={() => setPendingFieldType(null)}
          loading={changingField}
        />
      )}

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
        <DrawingToolbar
          activeTool={drawing.activeTool}
          setActiveTool={drawing.setActiveTool}
          activeColor={drawing.activeColor}
          setActiveColor={drawing.setActiveColor}
          strokeWidth={drawing.strokeWidth}
          setStrokeWidth={drawing.setStrokeWidth}
          onUndo={drawing.undo}
          onRedo={drawing.redo}
          onClear={drawing.clearAll}
          canUndo={drawing.canUndo}
          canRedo={drawing.canRedo}
          elementCount={drawing.elements.length}
        />
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
            homeColor={homeColor}
            awayColor={awayColor}
            ballColor={ballColor}
            drawingElements={anim.playing ? (activeFrame?.elements ?? []) : drawing.elements}
            selectedDrawingId={drawing.selectedId}
            activeTool={drawing.activeTool}
            isDrawing={drawing.isDrawing}
            onPointerDown={drawing.handlePointerDown}
            onPointerMove={drawing.handlePointerMove}
            onPointerUp={drawing.handlePointerUp}
            onElementClick={drawing.handleElementClick}
            showNames={showNames}
            namePosition={namePosition}
            showHints={showHints}
            activeLinePlayerIds={lines.activeLine?.playerIds ?? null}
            activeLineColor={lines.activeLine?.color ?? null}
          />

          {!anim.playing && (
            <PlayerAccessibleList
              players={livePlayers}
              selectedPlayerId={selectedPlayerId}
              onSelectPlayer={setSelectedPlayerId}
            />
          )}

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
          <LinesPanel
            lines={lines.lines}
            activeLineId={lines.activeLineId}
            players={livePlayers}
            onAddLine={lines.addLine}
            onRenameLine={(id, name) => lines.updateLine(id, { name })}
            onDeleteLine={lines.deleteLine}
            onSetActiveLine={lines.setActiveLine}
            onTogglePlayer={lines.togglePlayerInLine}
            canAddLine={lines.canAddLine}
          />
          <ExportPanel boardId={boardId} frames={frames} renderFrame={renderFrame} />
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

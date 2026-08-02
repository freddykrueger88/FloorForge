/**
 * FloorballField – IFF-konformes 2D Floorball-Spielfeld
 * Spielfeld-Layer + Spieler-Layer + Zeichen-Layer
 */
import { useMemo } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import { IFF_FIELDS } from '../../constants/fieldConfig.js';
import { FIELD_COLORS } from '../../constants/fieldTheme.js';
import PlayerLayer from './PlayerLayer.jsx';
import { DrawingLayer } from '../drawing/index.js';

export { FIELD_COLORS };

function computeScale(field, canvasW, canvasH, padding = 40) {
  const scale  = Math.min((canvasW - padding * 2) / field.width, (canvasH - padding * 2) / field.height);
  const fieldW = field.width  * scale;
  const fieldH = field.height * scale;
  return { scale, fieldW, fieldH, offsetX: (canvasW - fieldW) / 2, offsetY: (canvasH - fieldH) / 2 };
}

export default function FloorballField({
  fieldType = 'large',
  width     = 800,
  height    = 500,
  showGrid  = false,
  gridSize  = 1.0,
  theme     = 'dark',
  readonly  = false,
  // Spieler
  players       = [],
  selectedPlayerId = null,
  onSelectPlayer,
  onDragEndPlayer,
  homeColor  = { fill: '#1d4ed8', stroke: '#1e3a8a' },
  awayColor  = { fill: '#dc2626', stroke: '#991b1b' },
  snapToGrid = 0,
  showNames    = false,
  namePosition = 'unten',
  activeLinePlayerIds = null,
  activeLineColor     = null,
  // Zeichnen
  drawingElements  = [],
  selectedDrawingId = null,
  activeTool,
  isDrawing,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onElementClick,
}) {
  const field  = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const colors = FIELD_COLORS[theme]   ?? FIELD_COLORS.dark;
  const { scale, fieldW, fieldH, offsetX, offsetY } = useMemo(
    () => computeScale(field, width, height),
    [field, width, height]
  );

  const px  = (m) => m * scale;
  const ox = offsetX, oy = offsetY, cx = ox + fieldW / 2, cy = oy + fieldH / 2;
  const lw = Math.max(1, scale * 0.05), lw2 = lw * 2;
  const goalAreaW = px(field.goalAreaWidth), goalAreaD = px(field.goalAreaDepth);
  const keeperW = px(field.keeperWidth),     keeperD = px(field.keeperDepth);
  const goalW_px = px(field.goalWidth),      goalD_px = px(field.goalDepth);

  const gridLines = useMemo(() => {
    if (!showGrid || gridSize <= 0) return [];
    const lines = [];
    for (let m = gridSize; m < field.width;  m += gridSize) { const x = ox + px(m); lines.push(<Line key={`gv${m}`} points={[x, oy, x, oy + fieldH]} stroke={colors.grid} strokeWidth={0.5} dash={[3,4]} listening={false}/>); }
    for (let m = gridSize; m < field.height; m += gridSize) { const y = oy + px(m); lines.push(<Line key={`gh${m}`} points={[ox, y, ox + fieldW, y]} stroke={colors.grid} strokeWidth={0.5} dash={[3,4]} listening={false}/>); }
    return lines;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGrid, gridSize, field, scale, offsetX, offsetY]);

  return (
    <Stage width={width} height={height} role="img" aria-label={`Floorball-Spielfeld: ${field.label}`}>
      {/* Layer 1: Spielfeld */}
      <Layer listening={false}>
        <Rect x={ox} y={oy} width={fieldW} height={fieldH} fill={colors.surface} cornerRadius={px(field.cornerRadius)} stroke={colors.board} strokeWidth={lw2*2} shadowColor="#000" shadowBlur={12} shadowOpacity={0.3}/>
        {gridLines}
        <Rect x={ox} y={cy-goalAreaD/2} width={goalAreaW} height={goalAreaD} fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}/>
        {keeperD>0 && <Rect x={ox} y={cy-keeperD/2} width={keeperW} height={keeperD} fill={colors.keeperArea} stroke={colors.line} strokeWidth={lw}/>}
        <Rect x={ox+fieldW-goalAreaW} y={cy-goalAreaD/2} width={goalAreaW} height={goalAreaD} fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}/>
        {keeperD>0 && <Rect x={ox+fieldW-keeperW} y={cy-keeperD/2} width={keeperW} height={keeperD} fill={colors.keeperArea} stroke={colors.line} strokeWidth={lw}/>}
        <Line points={[cx,oy,cx,oy+fieldH]} stroke={colors.line} strokeWidth={lw}/>
        <Circle x={cx} y={cy} radius={px(field.centerCircleRadius)} fill={colors.center} stroke={colors.line} strokeWidth={lw}/>
        <Circle x={cx} y={cy} radius={lw*2.5} fill={colors.line}/>
        <Rect x={ox-goalD_px} y={cy-goalW_px/2} width={goalD_px} height={goalW_px} fill="transparent" stroke={colors.goal} strokeWidth={lw2}/>
        <Rect x={ox+fieldW} y={cy-goalW_px/2} width={goalD_px} height={goalW_px} fill="transparent" stroke={colors.goal} strokeWidth={lw2}/>
        <Text x={ox} y={oy-20} width={fieldW} align="center" text={field.label} fontSize={Math.max(10,px(0.6))} fill={colors.text} fontFamily="Inter, system-ui, sans-serif"/>
      </Layer>

      {/* Layer 2: Zeichen-Elemente (unter Spielern) */}
      <DrawingLayer
        elements={drawingElements}
        scale={scale}
        offsetX={ox} offsetY={oy}
        fieldW={fieldW} fieldH={fieldH}
        selectedId={selectedDrawingId}
        activeTool={activeTool}
        isDrawing={isDrawing}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onElementClick={onElementClick}
        readonly={readonly}
      />

      {/* Layer 3: Spieler (immer oben) */}
      <PlayerLayer
        players={players}
        scale={scale}
        offsetX={ox} offsetY={oy}
        homeColor={homeColor} awayColor={awayColor}
        selectedId={selectedPlayerId}
        onSelect={onSelectPlayer}
        onDragEnd={onDragEndPlayer}
        snapToGrid={snapToGrid}
        readonly={readonly}
        showNames={showNames}
        namePosition={namePosition}
        activeLinePlayerIds={activeLinePlayerIds}
        activeLineColor={activeLineColor}
      />
    </Stage>
  );
}

/**
 * FloorballField – IFF-konformes 2D Floorball-Spielfeld
 * Kombiniert Spielfeld-Layer + Spieler-Layer
 */
import { useMemo } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import { IFF_FIELDS } from '../../constants/fieldConfig.js';
import PlayerLayer from './PlayerLayer.jsx';

const FIELD_COLORS = {
  dark:    { surface: '#1a2a1a', line: '#ffffff', board: '#374151', goal: '#9ca3af', goalArea: 'rgba(255,255,255,0.06)', keeperArea: 'rgba(255,255,255,0.10)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.4)' },
  light:   { surface: '#e8f5e9', line: '#1a1a1a', board: '#374151', goal: '#4b5563', goalArea: 'rgba(0,0,0,0.05)',       keeperArea: 'rgba(0,0,0,0.08)',          center: 'rgba(0,0,0,0.03)',          grid: 'rgba(0,0,0,0.08)',          text: 'rgba(0,0,0,0.35)'          },
  vikings: { surface: '#00193f', line: '#ffffff', board: '#0039a6', goal: '#a8c4e8', goalArea: 'rgba(255,255,255,0.07)', keeperArea: 'rgba(255,255,255,0.12)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' },
  iff:     { surface: '#0a1a0a', line: '#ffffff', board: '#e30613', goal: '#e30613', goalArea: 'rgba(255,255,255,0.06)', keeperArea: 'rgba(255,255,255,0.10)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.4)' },
};

function computeScale(field, canvasW, canvasH, padding = 40) {
  const scale  = Math.min((canvasW - padding * 2) / field.width, (canvasH - padding * 2) / field.height);
  const fieldW = field.width  * scale;
  const fieldH = field.height * scale;
  return { scale, fieldW, fieldH, offsetX: (canvasW - fieldW) / 2, offsetY: (canvasH - fieldH) / 2 };
}

export default function FloorballField({
  fieldType    = 'large',
  width        = 800,
  height       = 500,
  showGrid     = false,
  gridSize     = 1.0,
  theme        = 'dark',
  readonly     = false,
  // Spieler-Props
  players      = [],
  selectedId   = null,
  onSelectPlayer,
  onDragEndPlayer,
  homeColor    = { fill: '#1d4ed8', stroke: '#1e3a8a' },
  awayColor    = { fill: '#dc2626', stroke: '#991b1b' },
  snapToGrid   = 0,
}) {
  const field  = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const colors = FIELD_COLORS[theme]   ?? FIELD_COLORS.dark;
  const { scale, fieldW, fieldH, offsetX, offsetY } = useMemo(
    () => computeScale(field, width, height),
    [field, width, height]
  );

  const px  = (m) => m * scale;
  const ox  = offsetX;
  const oy  = offsetY;
  const cx  = ox + fieldW / 2;
  const cy  = oy + fieldH / 2;
  const lw  = Math.max(1, scale * 0.05);
  const lw2 = lw * 2;

  const goalAreaW = px(field.goalAreaWidth);
  const goalAreaD = px(field.goalAreaDepth);
  const keeperW   = px(field.keeperWidth);
  const keeperD   = px(field.keeperDepth);
  const goalW_px  = px(field.goalWidth);
  const goalD_px  = px(field.goalDepth);

  const gridLines = useMemo(() => {
    if (!showGrid || gridSize <= 0) return [];
    const lines = [];
    for (let m = gridSize; m < field.width;  m += gridSize) { const x = ox + px(m); lines.push(<Line key={`gv${m}`} points={[x, oy, x, oy + fieldH]} stroke={colors.grid} strokeWidth={0.5} dash={[3, 4]} listening={false} />); }
    for (let m = gridSize; m < field.height; m += gridSize) { const y = oy + px(m); lines.push(<Line key={`gh${m}`} points={[ox, y, ox + fieldW, y]} stroke={colors.grid} strokeWidth={0.5} dash={[3, 4]} listening={false} />); }
    return lines;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGrid, gridSize, field, scale, offsetX, offsetY]);

  return (
    <Stage width={width} height={height} role="img" aria-label={`Floorball-Spielfeld: ${field.label}`}>
      {/* Layer 1: Spielfeld */}
      <Layer listening={false}>
        <Rect x={ox} y={oy} width={fieldW} height={fieldH} fill={colors.surface} cornerRadius={px(field.cornerRadius)} stroke={colors.board} strokeWidth={lw2 * 2} shadowColor="#000" shadowBlur={12} shadowOpacity={0.3} />
        {gridLines}
        {/* Torraum links */}
        <Rect x={ox} y={cy - goalAreaD / 2} width={goalAreaW} height={goalAreaD} fill={colors.goalArea} stroke={colors.line} strokeWidth={lw} />
        {keeperD > 0 && <Rect x={ox} y={cy - keeperD / 2} width={keeperW} height={keeperD} fill={colors.keeperArea} stroke={colors.line} strokeWidth={lw} />}
        {/* Torraum rechts */}
        <Rect x={ox + fieldW - goalAreaW} y={cy - goalAreaD / 2} width={goalAreaW} height={goalAreaD} fill={colors.goalArea} stroke={colors.line} strokeWidth={lw} />
        {keeperD > 0 && <Rect x={ox + fieldW - keeperW} y={cy - keeperD / 2} width={keeperW} height={keeperD} fill={colors.keeperArea} stroke={colors.line} strokeWidth={lw} />}
        {/* Mittellinie + Mittelkreis */}
        <Line points={[cx, oy, cx, oy + fieldH]} stroke={colors.line} strokeWidth={lw} />
        <Circle x={cx} y={cy} radius={px(field.centerCircleRadius)} fill={colors.center} stroke={colors.line} strokeWidth={lw} />
        <Circle x={cx} y={cy} radius={lw * 2.5} fill={colors.line} />
        {/* Tore */}
        <Rect x={ox - goalD_px} y={cy - goalW_px / 2} width={goalD_px} height={goalW_px} fill="transparent" stroke={colors.goal} strokeWidth={lw2} />
        <Rect x={ox + fieldW} y={cy - goalW_px / 2} width={goalD_px} height={goalW_px} fill="transparent" stroke={colors.goal} strokeWidth={lw2} />
        {/* Feldbezeichnung */}
        <Text x={ox + fieldW / 2 - 30} y={oy - 20} text={field.label} fontSize={Math.max(10, px(0.6))} fill={colors.text} fontFamily="Inter, system-ui, sans-serif" />
      </Layer>

      {/* Layer 2: Spieler */}
      <PlayerLayer
        players={players}
        scale={scale}
        offsetX={ox}
        offsetY={oy}
        homeColor={homeColor}
        awayColor={awayColor}
        selectedId={selectedId}
        onSelect={onSelectPlayer}
        onDragEnd={onDragEndPlayer}
        snapToGrid={snapToGrid}
        readonly={readonly}
      />
    </Stage>
  );
}

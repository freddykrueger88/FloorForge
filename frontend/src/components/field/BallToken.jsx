/**
 * BallToken – Der Ball auf dem Konva-Canvas (ROADMAP-Backlog: beweglicher
 * Ball). Bewusst schlanker als PlayerToken: keine Rolle/Torwart-Form, kein
 * Namenslabel, kein Positions-Hinweis-Tooltip – der Ball ist nur ein
 * verschiebbares, auswählbares Objekt.
 *
 * Props:
 *   ball        – { id, team: 'ball', x, y }
 *   scale       – px pro Meter
 *   offsetX/Y   – Feldversatz in px
 *   color       – Hex-Farbe des Balls
 *   isSelected  – boolean
 *   onSelect    – (id) => void
 *   onDragEnd   – (id, newX_m, newY_m) => void
 *   snapToGrid  – Raster-Schrittgröße in Metern (0 = kein Snapping)
 *   readonly    – boolean
 */
import { Circle, Group, Ring } from 'react-konva';

const BALL_RADIUS_M = 0.115; // IFF: Floorball-Durchmesser ca. 72mm → Radius ~0.115m

export default function BallToken({
  ball,
  scale,
  offsetX,
  offsetY,
  color      = '#f97316',
  isSelected = false,
  onSelect,
  onDragEnd,
  snapToGrid = 0,
  readonly   = false,
}) {
  // Physikalisch korrekter Radius (BALL_RADIUS_M * scale) läge oft im
  // Sub-Pixel-Bereich – als rein dekoratives, unbewegliches Element war das
  // vorher unkritisch (fixer 4px-Floor), als Drag&Drop-/Touch-Ziel aber zu
  // klein. Bewusst größer als physikalisch exakt, deutlich kleiner als ein
  // Spieler-Token (Math.max(12, ...) dort).
  const radius = Math.max(9, BALL_RADIUS_M * scale * 2);

  const toCanvasX = (m) => offsetX + m * scale;
  const toCanvasY = (m) => offsetY + m * scale;
  const toMeters = (px, offset) => {
    const m = (px - offset) / scale;
    if (snapToGrid > 0) return Math.round(m / snapToGrid) * snapToGrid;
    return m;
  };

  const handleDragEnd = (e) => {
    if (readonly || !onDragEnd) return;
    const node = e.target;
    onDragEnd(ball.id, toMeters(node.x(), offsetX), toMeters(node.y(), offsetY));
  };

  return (
    <Group
      x={toCanvasX(ball.x)}
      y={toCanvasY(ball.y)}
      draggable={!readonly}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect?.(ball.id)}
      onTap={() => onSelect?.(ball.id)}
      onMouseEnter={(e) => { e.target.getStage().container().style.cursor = readonly ? 'default' : 'grab'; }}
      onMouseLeave={(e) => { e.target.getStage().container().style.cursor = 'default'; }}
      id={`player-${ball.id}`}
    >
      {isSelected && (
        <Ring innerRadius={radius + 2} outerRadius={radius + 6} fill="#facc15" opacity={0.9} />
      )}
      <Circle radius={radius} fill="#000" opacity={0.25} offsetX={-1} offsetY={1} />
      <Circle
        radius={radius}
        fill={color}
        stroke={isSelected ? '#facc15' : 'rgba(0,0,0,0.4)'}
        strokeWidth={isSelected ? 3 : Math.max(1, radius * 0.12)}
        shadowColor="#000"
        shadowBlur={isSelected ? 12 : 4}
        shadowOpacity={isSelected ? 0.5 : 0.2}
      />
    </Group>
  );
}

/**
 * PlayerToken – Ein einzelner Spieler auf dem Konva-Canvas
 *
 * Props:
 *   player       – { id, role, team, x, y, label }
 *   scale        – px pro Meter
 *   offsetX/Y    – Feldversatz in px
 *   color        – Hex-Farbe des Teams
 *   strokeColor  – Rand-Farbe
 *   isSelected   – boolean
 *   isDragging   – boolean
 *   onSelect     – (id) => void
 *   onDragEnd    – (id, newX_m, newY_m) => void
 *   snapToGrid   – Raster-Schrittgröße in Metern (0 = kein Snapping)
 *   readonly     – boolean
 */
import { useRef } from 'react';
import { Circle, Group, Text, Ring } from 'react-konva';

// Token-Größe relativ zur Spielfeldbreite (konstant egal wie groß der Canvas)
const TOKEN_RADIUS_M = 0.75; // Meter
const LABEL_FONT_RATIO = 0.9; // Schriftgröße relativ zum Radius in px

export default function PlayerToken({
  player,
  scale,
  offsetX,
  offsetY,
  color        = '#1d4ed8',
  strokeColor  = '#1e3a8a',
  isSelected   = false,
  onSelect,
  onDragEnd,
  snapToGrid   = 0,
  readonly     = false,
}) {
  const groupRef = useRef(null);
  const radius   = Math.max(12, TOKEN_RADIUS_M * scale);
  const fontSize = Math.max(8, radius * LABEL_FONT_RATIO);

  // Meter → px
  const toCanvasX = (m) => offsetX + m * scale;
  const toCanvasY = (m) => offsetY + m * scale;

  // px → Meter (mit optionalem Snapping)
  const toMeters = (px, offset) => {
    const m = (px - offset) / scale;
    if (snapToGrid > 0) return Math.round(m / snapToGrid) * snapToGrid;
    return m;
  };

  const handleDragEnd = (e) => {
    if (readonly || !onDragEnd) return;
    const node = e.target;
    const newX = toMeters(node.x(), offsetX);
    const newY = toMeters(node.y(), offsetY);
    // Sicherstellen dass Spieler auf dem Feld bleibt (wird im Hook geclampt)
    onDragEnd(player.id, newX, newY);
  };

  return (
    <Group
      ref={groupRef}
      x={toCanvasX(player.x)}
      y={toCanvasY(player.y)}
      draggable={!readonly}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect?.(player.id)}
      onTap={() => onSelect?.(player.id)}
      // Accessibility
      id={`player-${player.id}`}
    >
      {/* Auswahl-Ring */}
      {isSelected && (
        <Ring
          innerRadius={radius + 2}
          outerRadius={radius + 6}
          fill="#facc15"
          opacity={0.9}
        />
      )}

      {/* Schatten-Kreis (Tiefeneffekt) */}
      <Circle
        radius={radius}
        fill="#000"
        opacity={0.25}
        offsetX={-2}
        offsetY={2}
      />

      {/* Haupt-Kreis */}
      <Circle
        radius={radius}
        fill={color}
        stroke={isSelected ? '#facc15' : strokeColor}
        strokeWidth={isSelected ? 3 : 2}
        shadowColor="#000"
        shadowBlur={isSelected ? 12 : 4}
        shadowOpacity={isSelected ? 0.5 : 0.2}
      />

      {/* Positions-Label */}
      <Text
        text={player.role}
        fontSize={fontSize}
        fontFamily="Inter, system-ui, sans-serif"
        fontStyle="bold"
        fill="#ffffff"
        align="center"
        verticalAlign="middle"
        width={radius * 2}
        height={radius * 2}
        offsetX={radius}
        offsetY={radius}
        listening={false}
      />
    </Group>
  );
}

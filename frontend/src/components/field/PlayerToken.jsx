/**
 * PlayerToken – Ein einzelner Spieler auf dem Konva-Canvas
 *
 * Props:
 *   player       – { id, role, team, x, y, name? }
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
 *   showName     – boolean – Spielername ein-/ausblenden (Issue #29)
 *   namePosition – 'oben' | 'unten' – Position des Namens relativ zum Token
 */
import { useRef } from 'react';
import { Circle, Group, Text, Ring, Rect } from 'react-konva';

// Token-Größe relativ zur Spielfeldbreite (konstant egal wie groß der Canvas)
const TOKEN_RADIUS_M = 0.75; // Meter
const LABEL_FONT_RATIO = 0.9; // Schriftgröße relativ zum Radius in px
const NAME_MAX_CHARS = 8;

function truncateName(name) {
  if (!name) return '';
  return name.length > NAME_MAX_CHARS ? `${name.slice(0, NAME_MAX_CHARS - 1)}…` : name;
}

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
  showName     = false,
  namePosition = 'unten',
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

  // Name-Label vorbereiten (Issue #29): kein Name → kein Label
  const displayName = showName ? truncateName(player.name) : '';
  const nameFontSize = Math.max(10, radius * 0.55);
  const nameChipW = Math.max(radius * 1.9, displayName.length * nameFontSize * 0.62 + 10);
  const nameChipH = nameFontSize + 6;
  const nameGap = 4;
  const nameY = namePosition === 'oben'
    ? -radius - nameGap - nameChipH
    : radius + nameGap;

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

      {/* Spielername (Issue #29) – nur wenn vorhanden & sichtbar geschaltet */}
      {displayName && (
        <Group x={-nameChipW / 2} y={nameY} listening={false}>
          <Rect
            width={nameChipW}
            height={nameChipH}
            cornerRadius={nameChipH / 2}
            fill="rgba(15, 17, 23, 0.72)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={1}
          />
          <Text
            text={displayName}
            fontSize={nameFontSize}
            fontFamily="Inter, system-ui, sans-serif"
            fontStyle="600"
            fill="#ffffff"
            align="center"
            verticalAlign="middle"
            width={nameChipW}
            height={nameChipH}
          />
        </Group>
      )}
    </Group>
  );
}

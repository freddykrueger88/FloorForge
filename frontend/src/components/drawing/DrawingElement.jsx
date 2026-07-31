/**
 * DrawingElement – Rendert ein einzelnes Zeichen-Element auf dem Canvas
 * Unterstützt: move (Pfeil), pass (gestrichelter Pfeil), shot (dicker Pfeil), freehand
 */
import { Arrow, Line, Group } from 'react-konva';

export default function DrawingElement({
  element,
  scale,
  offsetX,
  offsetY,
  isSelected = false,
  onClick,
}) {
  const toX = (m) => offsetX + m * scale;
  const toY = (m) => offsetY + m * scale;

  const selectedGlow = isSelected
    ? { shadowColor: '#facc15', shadowBlur: 12, shadowOpacity: 0.8 }
    : {};

  const clickProps = {
    onClick:  () => onClick?.(element.id),
    onTap:    () => onClick?.(element.id),
    hitStrokeWidth: Math.max(16, (element.strokeWidth ?? 3) + 10),
  };

  if (element.type === 'freehand') {
    // Freihand: Punkte sind in Metern gespeichert → in px umrechnen
    const pts = [];
    for (let i = 0; i < element.points.length; i += 2) {
      pts.push(toX(element.points[i]), toY(element.points[i + 1]));
    }
    return (
      <Line
        points={pts}
        stroke={element.color}
        strokeWidth={element.strokeWidth ?? 2}
        tension={0.4}
        lineCap="round"
        lineJoin="round"
        {...selectedGlow}
        {...clickProps}
      />
    );
  }

  // Pfeil-Typen: move, pass, shot
  const pts = [toX(element.x1), toY(element.y1), toX(element.x2), toY(element.y2)];
  const sw  = element.strokeWidth ?? 3;
  // Pfeilspitze proportional zur Linienstärke
  const pointerLen    = Math.max(12, sw * 4);
  const pointerWidth  = Math.max(10, sw * 3);

  return (
    <Group>
      {/* Auswahl-Highlight (breitere transparente Linie dahinter) */}
      {isSelected && (
        <Line
          points={pts}
          stroke="#facc15"
          strokeWidth={sw + 8}
          opacity={0.3}
          lineCap="round"
          listening={false}
        />
      )}
      <Arrow
        points={pts}
        stroke={element.color}
        strokeWidth={sw}
        fill={element.color}
        dash={element.dash ?? []}
        lineCap="round"
        lineJoin="round"
        pointerLength={element.arrowHead ? pointerLen   : 0}
        pointerWidth ={element.arrowHead ? pointerWidth : 0}
        {...selectedGlow}
        {...clickProps}
      />
    </Group>
  );
}

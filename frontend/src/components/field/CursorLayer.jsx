/**
 * CursorLayer – Live-Cursor anderer Nutzer (ROADMAP-Backlog
 * "Echtzeit-Co-Editing"), oberste Konva-Ebene in FloorballField.jsx.
 * Rein dekorativ (listening={false}) – fängt keine eigenen Klicks ab.
 *
 * Props:
 *   cursors   – { [userId]: { displayName, x, y } } (x/y in Metern)
 *   scale     – px pro Meter
 *   offsetX/Y – Feldversatz in px
 */
import { Layer, Group, Circle, Text } from 'react-konva';
import { hashUserColor } from '../../utils/color.js';

const RADIUS_PX = 6;

export default function CursorLayer({ cursors = {}, scale, offsetX, offsetY }) {
  const entries = Object.entries(cursors);
  if (entries.length === 0) return null;

  return (
    <Layer listening={false}>
      {entries.map(([userId, { displayName, x, y }]) => {
        const px = offsetX + x * scale;
        const py = offsetY + y * scale;
        const color = hashUserColor(userId);
        return (
          <Group key={userId}>
            <Circle x={px} y={py} radius={RADIUS_PX} fill={color} stroke="#fff" strokeWidth={1.5} />
            <Text
              x={px + RADIUS_PX + 4}
              y={py - 8}
              text={displayName}
              fontSize={12}
              fontFamily="Inter, system-ui, sans-serif"
              fill="#fff"
              padding={2}
              shadowColor="#000"
              shadowBlur={2}
              shadowOpacity={0.6}
            />
          </Group>
        );
      })}
    </Layer>
  );
}

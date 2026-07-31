/**
 * PlayerLayer – Rendert alle Spieler beider Teams als Konva-Layer
 *
 * Props:
 *   players      – Array<PlayerState> (aus usePlayerState)
 *   scale        – px pro Meter
 *   offsetX/Y    – Feldversatz
 *   homeColor    – { fill, stroke }
 *   awayColor    – { fill, stroke }
 *   selectedId   – aktuell ausgewählter Spieler-ID
 *   onSelect     – (id) => void
 *   onDragEnd    – (id, x_m, y_m) => void
 *   snapToGrid   – Meter
 *   readonly     – boolean
 */
import { Layer } from 'react-konva';
import PlayerToken from './PlayerToken.jsx';

export default function PlayerLayer({
  players     = [],
  scale,
  offsetX,
  offsetY,
  homeColor   = { fill: '#1d4ed8', stroke: '#1e3a8a' },
  awayColor   = { fill: '#dc2626', stroke: '#991b1b' },
  selectedId  = null,
  onSelect,
  onDragEnd,
  snapToGrid  = 0,
  readonly    = false,
}) {
  return (
    <Layer>
      {players.map((p) => {
        const color = p.team === 'home' ? homeColor : awayColor;
        return (
          <PlayerToken
            key={p.id}
            player={p}
            scale={scale}
            offsetX={offsetX}
            offsetY={offsetY}
            color={color.fill}
            strokeColor={color.stroke}
            isSelected={p.id === selectedId}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
            snapToGrid={snapToGrid}
            readonly={readonly}
          />
        );
      })}
    </Layer>
  );
}

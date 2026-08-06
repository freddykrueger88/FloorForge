/**
 * FieldMiniature – Leichtgewichtige, hochkantige SVG-Vorschau eines Spielfelds
 * (Issue #30 – Board-Postkarte)
 *
 * Bewusst KEIN Konva/Canvas – reines SVG, da hier nur eine statische
 * Übersichts-Miniatur benötigt wird (readonly, keine Pfeile/Zeichnungen).
 * Das Spielfeld wird um 90° gedreht dargestellt (Querformat → Hochformat),
 * damit es ins Postkarten-Layout passt.
 *
 * Optional: `players` (aus board.players, Meter-Koordinaten wie im
 * Haupt-Spielfeld – siehe PlayerLayer.jsx) werden als kleine Punkte in
 * derselben 90°-Drehung eingezeichnet, damit die Postkarten-Galerie schon
 * die hinterlegte Taktik statt nur eines leeren Feldes zeigt.
 */
import { useTranslation } from 'react-i18next';
import { IFF_FIELDS } from '../../constants/fieldConfig.js';
import { FIELD_COLORS } from '../../constants/fieldTheme.js';

export default function FieldMiniature({
  fieldType = 'large',
  theme     = 'dark',
  width     = 140,
  height    = 200,
  players   = null,
  homeColor = '#1d4ed8',
  awayColor = '#dc2626',
  ballColor = '#f97316',
}) {
  const { t } = useTranslation();
  const field  = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const colors = FIELD_COLORS[theme]   ?? FIELD_COLORS.dark;

  // Feld ist im Querformat (width > height) definiert – für die Postkarte
  // drehen wir gedanklich 90°: Feld-Breite → Canvas-Höhe, Feld-Höhe → Canvas-Breite
  const padding = 6;
  const availW  = width  - padding * 2;
  const availH  = height - padding * 2;
  const scale   = Math.min(availW / field.height, availH / field.width);
  const fieldW  = field.height * scale; // gedreht
  const fieldH  = field.width  * scale;
  const ox = (width  - fieldW) / 2;
  const oy = (height - fieldH) / 2;
  const lw = Math.max(0.75, scale * 0.05);

  // Nach der Drehung liegt die Mittellinie horizontal statt vertikal
  const cx = ox + fieldW / 2;
  const cy = oy + fieldH / 2;
  const goalAreaD = field.goalAreaDepth * scale; // jetzt Höhe an den Enden
  const goalAreaW = field.goalAreaWidth * scale; // jetzt Breite
  const goalInset = field.goalLineInset * scale; // Abstand Torraum ↔ Bande

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={t('field.miniaturePreview', { label: field.label })}
    >
      <rect
        x={ox} y={oy} width={fieldW} height={fieldH}
        rx={Math.min(8, field.cornerRadius * scale)}
        fill={colors.surface}
        stroke={colors.board}
        strokeWidth={lw * 2}
      />
      {/* Torraum oben – beginnt goalInset von der Bande entfernt, nicht
          direkt an ihr (Raum "hinter dem Tor" bleibt bespielbar) */}
      <rect
        x={cx - goalAreaW / 2} y={oy + goalInset}
        width={goalAreaW} height={goalAreaD}
        fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}
      />
      {/* Torraum unten */}
      <rect
        x={cx - goalAreaW / 2} y={oy + fieldH - goalInset - goalAreaD}
        width={goalAreaW} height={goalAreaD}
        fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}
      />
      {/* Mittellinie + Anspielpunkt (kein Mittelkreis – Floorball nutzt
          Punkte statt Kreis, anders als Fußball) */}
      <line x1={ox} y1={cy} x2={ox + fieldW} y2={cy} stroke={colors.line} strokeWidth={lw} />
      <circle cx={cx} cy={cy} r={lw * 1.5} fill={colors.line} />

      {/* Taktik-Vorschau: Spielerpositionen, in derselben 90°-Drehung wie
          das Feld (Meter-x → Canvas-y, Meter-y → Canvas-x, siehe Kommentar
          oben) – dieselbe Zuordnung, die scale/fieldW/fieldH bereits nutzen. */}
      {players?.length > 0 && (() => {
        const dotR = Math.max(2, Math.min(4.5, scale * 0.8));
        return players.map((p) => {
          if (typeof p.x !== 'number' || typeof p.y !== 'number') return null;
          const px = ox + p.y * scale;
          const py = oy + p.x * scale;
          if (p.team === 'ball') {
            return <circle key={p.id} cx={px} cy={py} r={dotR * 0.7} fill={ballColor} />;
          }
          const fill = p.team === 'home' ? homeColor : awayColor;
          return (
            <circle
              key={p.id}
              cx={px} cy={py} r={dotR}
              fill={fill}
              stroke={colors.surface}
              strokeWidth={Math.max(0.5, lw * 0.6)}
            />
          );
        });
      })()}
    </svg>
  );
}

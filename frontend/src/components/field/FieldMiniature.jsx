/**
 * FieldMiniature – Leichtgewichtige, hochkantige SVG-Vorschau eines Spielfelds
 * (Issue #30 – Board-Postkarte)
 *
 * Bewusst KEIN Konva/Canvas – reines SVG, da hier nur eine statische
 * Übersichts-Miniatur benötigt wird (readonly, keine Spieler, keine Pfeile).
 * Das Spielfeld wird um 90° gedreht dargestellt (Querformat → Hochformat),
 * damit es ins Postkarten-Layout passt.
 */
import { useTranslation } from 'react-i18next';
import { IFF_FIELDS } from '../../constants/fieldConfig.js';
import { FIELD_COLORS } from '../../constants/fieldTheme.js';

export default function FieldMiniature({
  fieldType = 'large',
  theme     = 'dark',
  width     = 140,
  height    = 200,
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
      {/* Torraum oben */}
      <rect
        x={cx - goalAreaW / 2} y={oy}
        width={goalAreaW} height={goalAreaD}
        fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}
      />
      {/* Torraum unten */}
      <rect
        x={cx - goalAreaW / 2} y={oy + fieldH - goalAreaD}
        width={goalAreaW} height={goalAreaD}
        fill={colors.goalArea} stroke={colors.line} strokeWidth={lw}
      />
      {/* Mittellinie */}
      <line x1={ox} y1={cy} x2={ox + fieldW} y2={cy} stroke={colors.line} strokeWidth={lw} />
      {/* Mittelkreis */}
      <circle
        cx={cx} cy={cy}
        r={field.centerCircleRadius * scale}
        fill={colors.center} stroke={colors.line} strokeWidth={lw}
      />
      <circle cx={cx} cy={cy} r={lw * 1.5} fill={colors.line} />
    </svg>
  );
}

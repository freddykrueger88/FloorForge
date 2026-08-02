/**
 * FloorballFieldStatic – Offscreen-Rendering via Konva für GIF-Export
 * Issue #15 – v0.5.0
 *
 * Erstellt eine unsichtbare Konva-Stage, rendert alle Layer und gibt
 * einen PNG-DataURL-String zurück (Promise<string>).
 *
 * HINWEIS: Läuft nur im Browser (window.document muss verfügbar sein).
 */
import Konva from 'konva';
import { IFF_FIELDS } from '../../constants/fieldConfig.js';
import { FIELD_COLORS } from '../../constants/fieldTheme.js';

const BALL_RADIUS_M = 0.115;

function computeScale(field, w, h, padding = 40) {
  const scale  = Math.min((w - padding * 2) / field.width, (h - padding * 2) / field.height);
  const fieldW = field.width  * scale;
  const fieldH = field.height * scale;
  return { scale, fieldW, fieldH, offsetX: (w - fieldW) / 2, offsetY: (h - fieldH) / 2 };
}

export default async function renderFieldFrame({
  fieldType = 'large',
  width     = 1280,
  height    = 720,
  theme     = 'dark',
  players   = [],
  elements  = [],
  homeColor = { fill: '#1d4ed8', stroke: '#1e3a8a' },
  awayColor = { fill: '#dc2626', stroke: '#991b1b' },
  ballColor = '#f97316',
}) {
  const field  = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;
  const colors = FIELD_COLORS[theme]   ?? FIELD_COLORS.dark;
  const { scale, fieldW, fieldH, offsetX: ox, offsetY: oy } = computeScale(field, width, height);
  const cx = ox + fieldW / 2;
  const cy = oy + fieldH / 2;

  const px = (m) => m * scale;
  const lw = Math.max(1, scale * 0.05);
  const lw2 = lw * 2;
  const goalAreaW = px(field.goalAreaWidth);
  const goalAreaD = px(field.goalAreaDepth);
  const keeperW   = px(field.keeperWidth);
  const keeperD   = px(field.keeperDepth);
  const goalW_px  = px(field.goalWidth);
  const goalD_px  = px(field.goalDepth);
  const ballR     = Math.max(4, px(BALL_RADIUS_M));

  // Unsichtbarer Container-Div
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;';
  document.body.appendChild(container);

  const stage = new Konva.Stage({ container, width, height });
  const layer = new Konva.Layer();
  stage.add(layer);

  // ── Spielfeld ──
  layer.add(new Konva.Rect({
    x: ox, y: oy, width: fieldW, height: fieldH,
    fill: colors.surface, cornerRadius: px(field.cornerRadius),
    stroke: colors.board, strokeWidth: lw2 * 2,
    shadowColor: '#000', shadowBlur: 12, shadowOpacity: 0.3,
  }));

  // Goal-Areas
  for (const side of ['left', 'right']) {
    const gx = side === 'left' ? ox : ox + fieldW - goalAreaW;
    layer.add(new Konva.Rect({ x: gx, y: cy - goalAreaD / 2, width: goalAreaW, height: goalAreaD, fill: colors.goalArea, stroke: colors.line, strokeWidth: lw }));
    if (keeperD > 0) {
      const kx = side === 'left' ? ox : ox + fieldW - keeperW;
      layer.add(new Konva.Rect({ x: kx, y: cy - keeperD / 2, width: keeperW, height: keeperD, fill: colors.keeperArea, stroke: colors.line, strokeWidth: lw }));
    }
    const goalX = side === 'left' ? ox - goalD_px : ox + fieldW;
    layer.add(new Konva.Rect({ x: goalX, y: cy - goalW_px / 2, width: goalD_px, height: goalW_px, fill: 'transparent', stroke: colors.goal, strokeWidth: lw2 }));
  }

  // Mittellinie + Mittelkreis
  layer.add(new Konva.Line({ points: [cx, oy, cx, oy + fieldH], stroke: colors.line, strokeWidth: lw }));
  layer.add(new Konva.Circle({ x: cx, y: cy, radius: px(field.centerCircleRadius), fill: colors.center, stroke: colors.line, strokeWidth: lw }));
  layer.add(new Konva.Circle({ x: cx, y: cy, radius: lw * 2.5, fill: colors.line }));

  // Ball
  layer.add(new Konva.Circle({ x: cx, y: cy, radius: ballR, fill: ballColor, stroke: 'rgba(0,0,0,0.4)', strokeWidth: Math.max(1, lw * 0.8) }));

  // Spieler
  for (const p of players) {
    const px_ = ox + p.x * scale;
    const py_ = oy + p.y * scale;
    const r   = Math.max(8, scale * 0.45);
    const col = p.team === 'home' ? homeColor : awayColor;
    layer.add(new Konva.Circle({ x: px_, y: py_, radius: r, fill: col.fill, stroke: col.stroke ?? col.fill, strokeWidth: Math.max(1.5, lw) }));
    if (p.number !== undefined) {
      layer.add(new Konva.Text({ x: px_ - r, y: py_ - r, width: r * 2, height: r * 2, text: String(p.number), align: 'center', verticalAlign: 'middle', fontSize: Math.max(8, r * 0.9), fill: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontStyle: 'bold' }));
    }
  }

  // Zeichnungs-Elemente (nur Linien / Pfeile – vereinfacht)
  for (const el of elements) {
    if (el.type === 'line' || el.type === 'arrow') {
      const pts = el.points.flatMap(([x, y]) => [ox + x * scale, oy + y * scale]);
      layer.add(new Konva.Line({ points: pts, stroke: el.color ?? '#facc15', strokeWidth: Math.max(1.5, (el.strokeWidth ?? 2) * scale * 0.3), lineCap: 'round', lineJoin: 'round' }));
    }
  }

  layer.draw();
  const dataUrl = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 1 });

  // Cleanup
  stage.destroy();
  document.body.removeChild(container);

  return dataUrl;
}

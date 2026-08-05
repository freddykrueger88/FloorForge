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
const FACEOFF_INSET_M = 1.5; // IFF: Anspiel-Punkte 1,5m von den Langseiten entfernt

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
  // Torraum + Torwartfläche sind laut IFF-Regelwerk schmal-lang – rein
  // optisch für die Darstellung kompakter gekappt UND insgesamt
  // verkleinert (×0.65). Tiefe (x) bleibt kleiner als Breite (y) –
  // "quadratischer" Eindruck soll von oben nach unten entstehen.
  const AREA_SCALE = 0.65;
  const goalAreaDisplayW = goalAreaW * AREA_SCALE;
  const goalAreaDisplayD = Math.min(goalAreaD, goalAreaW * 0.8) * AREA_SCALE;
  const keeperDisplayW = keeperW * AREA_SCALE;
  const keeperDisplayD = Math.min(keeperD, keeperW * 0.8) * AREA_SCALE;
  const goalW_px  = px(field.goalWidth);
  const goalD_px  = px(field.goalDepth);
  const goalInset = px(field.goalLineInset);
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

  // Torraum (4×5m) + Torwartfläche (1×2,5m) + Tor – beginnen goalInset
  // (2,85m Großfeld) von der Bande entfernt, sodass der Raum "hinter dem
  // Tor" bespielbar bleibt (anders als beim Fußball)
  for (const side of ['left', 'right']) {
    const gx = side === 'left' ? ox + goalInset : ox + fieldW - goalInset - goalAreaDisplayD;
    layer.add(new Konva.Rect({ x: gx, y: cy - goalAreaDisplayW / 2, width: goalAreaDisplayD, height: goalAreaDisplayW, fill: colors.goalArea, stroke: colors.line, strokeWidth: lw }));
    if (keeperD > 0) {
      const kx = side === 'left' ? ox + goalInset : ox + fieldW - goalInset - keeperDisplayD;
      layer.add(new Konva.Rect({ x: kx, y: cy - keeperDisplayW / 2, width: keeperDisplayD, height: keeperDisplayW, fill: colors.keeperArea, stroke: colors.line, strokeWidth: lw }));
    }
    const goalX = side === 'left' ? ox + goalInset - goalD_px : ox + fieldW - goalInset;
    layer.add(new Konva.Rect({ x: goalX, y: cy - goalW_px / 2, width: goalD_px, height: goalW_px, fill: 'transparent', stroke: colors.goal, strokeWidth: lw2 }));
  }

  // Mittellinie + Anspiel-Punkte (IFF: Mittelpunkt + 6 weitere Punkte auf
  // Mittellinie/Torlinien-Verlängerungen, je 1,5m von den Langseiten)
  layer.add(new Konva.Line({ points: [cx, oy, cx, oy + fieldH], stroke: colors.line, strokeWidth: lw }));
  layer.add(new Konva.Circle({ x: cx, y: cy, radius: lw * 2.5, fill: colors.line }));
  const faceoffNearY = oy + px(FACEOFF_INSET_M);
  const faceoffFarY  = oy + fieldH - px(FACEOFF_INSET_M);
  for (const d of [
    { x: cx,          y: faceoffNearY },
    { x: cx,          y: faceoffFarY  },
    { x: ox,          y: faceoffNearY },
    { x: ox,          y: faceoffFarY  },
    { x: ox + fieldW, y: faceoffNearY },
    { x: ox + fieldW, y: faceoffFarY  },
  ]) {
    layer.add(new Konva.Circle({ x: d.x, y: d.y, radius: lw * 2.5, fill: colors.line }));
  }

  // Spieler + Ball (ROADMAP-Backlog "beweglicher Ball": der Ball ist ein
  // Eintrag mit team:'ball' im selben players-Array, siehe ensureBall() in
  // constants/fieldConfig.js – kein fixer Mittelpunkt mehr, sondern die
  // tatsächliche Position aus dem jeweiligen Frame)
  for (const p of players) {
    const px_ = ox + p.x * scale;
    const py_ = oy + p.y * scale;
    if (p.team === 'ball') {
      layer.add(new Konva.Circle({ x: px_, y: py_, radius: ballR, fill: ballColor, stroke: 'rgba(0,0,0,0.4)', strokeWidth: Math.max(1, lw * 0.8) }));
      continue;
    }
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

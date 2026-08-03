/**
 * Zeichen-Tool Definitionen
 * Alle verfügbaren Werkzeuge, ihre Eigenschaften und Tastaturkürzel
 */

export const TOOLS = {
  select: {
    id: 'select',
    label: 'Auswahl',
    labelEn: 'Select',
    icon: '←',
    shortcut: 'Escape',
    cursor: 'default',
  },
  move: {
    id: 'move',
    label: 'Bewegungspfeil',
    labelEn: 'Movement Arrow',
    icon: '➡',
    shortcut: 'M',
    cursor: 'crosshair',
    arrowHead: true,
    dash: [],
    strokeWidth: 3,
    description: 'Zeigt wohin sich ein Spieler bewegen soll',
  },
  pass: {
    id: 'pass',
    label: 'Pass-Pfeil',
    labelEn: 'Pass Arrow',
    icon: '⇢',
    shortcut: 'P',
    cursor: 'crosshair',
    arrowHead: true,
    dash: [12, 8],
    strokeWidth: 2,
    description: 'Zeigt einen Pass zwischen Spielern',
  },
  shot: {
    id: 'shot',
    label: 'Schuss-Pfeil',
    labelEn: 'Shot Arrow',
    icon: '⚡',
    shortcut: 'S',
    cursor: 'crosshair',
    arrowHead: true,
    dash: [],
    strokeWidth: 5,
    description: 'Zeigt einen Schuss aufs Tor',
  },
  freehand: {
    id: 'freehand',
    label: 'Freihand',
    labelEn: 'Freehand',
    icon: '✏',
    shortcut: 'F',
    cursor: 'crosshair',
    arrowHead: false,
    dash: [],
    strokeWidth: 2,
    description: 'Freies Zeichnen für flexible Markierungen',
  },
  eraser: {
    id: 'eraser',
    label: 'Radierer',
    labelEn: 'Eraser',
    icon: '□',
    shortcut: 'E',
    cursor: 'pointer',
    description: 'Einzelne Elemente löschen (Klick)',
  },
};

export const TOOL_ORDER = ['select', 'move', 'pass', 'shot', 'freehand', 'eraser'];

export const DEFAULT_COLORS = [
  { hex: '#facc15', label: 'Gelb',    labelEn: 'Yellow' },
  { hex: '#f97316', label: 'Orange',  labelEn: 'Orange' },
  { hex: '#ef4444', label: 'Rot',     labelEn: 'Red' },
  { hex: '#22c55e', label: 'Grün',    labelEn: 'Green' },
  { hex: '#3b82f6', label: 'Blau',    labelEn: 'Blue' },
  { hex: '#a855f7', label: 'Lila',    labelEn: 'Purple' },
  { hex: '#ffffff', label: 'Weiß',    labelEn: 'White' },
  { hex: '#000000', label: 'Schwarz', labelEn: 'Black' },
];

export const STROKE_WIDTHS = [
  { value: 1, label: 'Dünn',  labelEn: 'Thin' },
  { value: 2, label: 'Mittel', labelEn: 'Medium' },
  { value: 4, label: 'Dick',   labelEn: 'Thick' },
  { value: 7, label: 'Extra',  labelEn: 'Extra' },
];

export const MAX_UNDO_STEPS = 50;

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
  { hex: '#facc15', label: 'Gelb'   },
  { hex: '#f97316', label: 'Orange' },
  { hex: '#ef4444', label: 'Rot'    },
  { hex: '#22c55e', label: 'Grün'   },
  { hex: '#3b82f6', label: 'Blau'   },
  { hex: '#a855f7', label: 'Lila'   },
  { hex: '#ffffff', label: 'Weiß'   },
  { hex: '#000000', label: 'Schwarz'},
];

export const STROKE_WIDTHS = [
  { value: 1, label: 'Dünn'  },
  { value: 2, label: 'Mittel' },
  { value: 4, label: 'Dick'   },
  { value: 7, label: 'Extra'  },
];

export const MAX_UNDO_STEPS = 50;

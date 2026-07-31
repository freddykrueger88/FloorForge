/**
 * IFF-konforme Spielfeld-Maße
 * Quelle: IFF Rulebook 2022, Section 1 – Playing Area
 * Alle Maße in Metern, werden intern auf Canvas-Pixel skaliert.
 */

export const IFF_FIELDS = {
  large: {
    id: 'large',
    label: 'Großfeld (40×20m)',
    labelEn: 'Full Field (40×20m)',
    width: 40,          // m
    height: 20,         // m
    boardHeight: 0.5,   // Bandenhöhe (visuell)
    goalWidth: 1.60,    // m (IFF: 160cm)
    goalDepth: 0.45,    // m
    goalAreaWidth: 4.0, // m (Torraum Breite)
    goalAreaDepth: 5.0, // m (Torraum Tiefe)
    keeperWidth: 1.0,   // m (Torwartfläche Breite)
    keeperDepth: 2.5,   // m (Torwartfläche Tiefe)
    centerCircleRadius: 2.85, // m
    cornerRadius: 1.0,  // m (abgerundete Ecken)
    players: { home: 5, away: 5, goalkeepers: 2 },
  },
  small: {
    id: 'small',
    label: 'Kleinfeld (24×14m)',
    labelEn: 'Small Field (24×14m)',
    width: 24,
    height: 14,
    boardHeight: 0.5,
    goalWidth: 1.20,
    goalDepth: 0.40,
    goalAreaWidth: 3.0,
    goalAreaDepth: 3.5,
    keeperWidth: 0.8,
    keeperDepth: 1.8,
    centerCircleRadius: 2.0,
    cornerRadius: 0.75,
    players: { home: 4, away: 4, goalkeepers: 0 },
  },
  street: {
    id: 'street',
    label: 'Street Floorball',
    labelEn: 'Street Floorball',
    width: 20,
    height: 10,
    boardHeight: 0,
    goalWidth: 1.0,
    goalDepth: 0.3,
    goalAreaWidth: 2.5,
    goalAreaDepth: 3.0,
    keeperWidth: 0.6,
    keeperDepth: 1.5,
    centerCircleRadius: 1.5,
    cornerRadius: 0.5,
    players: { home: 3, away: 3, goalkeepers: 0 },
  },
  threeVsThree: {
    id: 'threeVsThree',
    label: '3vs3',
    labelEn: '3 vs 3',
    width: 18,
    height: 9,
    boardHeight: 0,
    goalWidth: 0.8,
    goalDepth: 0.25,
    goalAreaWidth: 2.0,
    goalAreaDepth: 2.5,
    keeperWidth: 0,
    keeperDepth: 0,
    centerCircleRadius: 1.2,
    cornerRadius: 0.4,
    players: { home: 3, away: 3, goalkeepers: 0 },
  },
};

/**
 * Standard-Spielerfarben (IFF-konform)
 * Heim: dunkel/farbig, Auswärts: hell/weiß
 */
export const DEFAULT_TEAM_COLORS = {
  home: { fill: '#1d4ed8', stroke: '#1e40af', label: 'Heimteam' },
  away: { fill: '#dc2626', stroke: '#b91c1c', label: 'Auswärtsteam' },
  goalkeeper_home: { fill: '#4f46e5', stroke: '#3730a3', label: 'TW Heim' },
  goalkeeper_away: { fill: '#059669', stroke: '#047857', label: 'TW Auswärts' },
};

/**
 * IFF-Ballfarben (Official IFF Rules)
 * Ball muss kontrastreich zur Feldfläche sein
 */
export const IFF_BALL_COLORS = [
  { id: 'orange', label: 'Orange', hex: '#f97316', official: true },
  { id: 'yellow', label: 'Gelb', hex: '#eab308', official: true },
  { id: 'pink', label: 'Pink', hex: '#ec4899', official: true },
  { id: 'white', label: 'Weiß', hex: '#ffffff', official: true },
  { id: 'black', label: 'Schwarz (Street)', hex: '#1a1a1a', official: false },
];

/**
 * Standard-Spielerpositionen für das Großfeld (5+1)
 * Koordinaten in Meter (vom Mittelpunkt des Feldes)
 * x: horizontal, y: vertikal
 */
export const DEFAULT_POSITIONS_LARGE = {
  home: [
    { id: 'h1', role: 'TW', position: 'Torwart',     x: 2.0,  y: 10.0 },
    { id: 'h2', role: 'V',  position: 'Verteidiger',  x: 7.0,  y: 6.0  },
    { id: 'h3', role: 'V',  position: 'Verteidiger',  x: 7.0,  y: 14.0 },
    { id: 'h4', role: 'M',  position: 'Mittelfeld',   x: 16.0, y: 10.0 },
    { id: 'h5', role: 'S',  position: 'Stürmer',      x: 22.0, y: 7.0  },
    { id: 'h6', role: 'S',  position: 'Stürmer',      x: 22.0, y: 13.0 },
  ],
  away: [
    { id: 'a1', role: 'TW', position: 'Torwart',     x: 38.0, y: 10.0 },
    { id: 'a2', role: 'V',  position: 'Verteidiger',  x: 33.0, y: 6.0  },
    { id: 'a3', role: 'V',  position: 'Verteidiger',  x: 33.0, y: 14.0 },
    { id: 'a4', role: 'M',  position: 'Mittelfeld',   x: 24.0, y: 10.0 },
    { id: 'a5', role: 'S',  position: 'Stürmer',      x: 18.0, y: 7.0  },
    { id: 'a6', role: 'S',  position: 'Stürmer',      x: 18.0, y: 13.0 },
  ],
};

/**
 * Snapping-Raster
 */
export const GRID_SIZES = [
  { id: 'none',  label: 'Kein Raster',  value: 0      },
  { id: '0.5m',  label: '0.5m Raster', value: 0.5    },
  { id: '1m',    label: '1m Raster',   value: 1.0    },
  { id: '2m',    label: '2m Raster',   value: 2.0    },
];

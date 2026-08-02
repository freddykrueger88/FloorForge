/**
 * fieldTheme – Theme-Farbpaletten für das Spielfeld
 * Ausgelagert aus FloorballField.jsx, damit leichtgewichtige Komponenten
 * (z.B. FieldMiniature) diese nutzen können, OHNE react-konva zu laden.
 */
export const FIELD_COLORS = {
  dark:    { surface: '#1a2a1a', line: '#ffffff', board: '#374151', goal: '#9ca3af', goalArea: 'rgba(255,255,255,0.06)', keeperArea: 'rgba(255,255,255,0.10)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.4)' },
  light:   { surface: '#e8f5e9', line: '#1a1a1a', board: '#374151', goal: '#4b5563', goalArea: 'rgba(0,0,0,0.05)',       keeperArea: 'rgba(0,0,0,0.08)',          center: 'rgba(0,0,0,0.03)',          grid: 'rgba(0,0,0,0.08)',          text: 'rgba(0,0,0,0.35)'          },
  vikings: { surface: '#00193f', line: '#ffffff', board: '#0039a6', goal: '#a8c4e8', goalArea: 'rgba(255,255,255,0.07)', keeperArea: 'rgba(255,255,255,0.12)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' },
  iff:     { surface: '#0a1a0a', line: '#ffffff', board: '#e30613', goal: '#e30613', goalArea: 'rgba(255,255,255,0.06)', keeperArea: 'rgba(255,255,255,0.10)', center: 'rgba(255,255,255,0.04)', grid: 'rgba(255,255,255,0.07)', text: 'rgba(255,255,255,0.4)' },
};

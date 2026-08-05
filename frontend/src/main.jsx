import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Konva from 'konva';
import './i18n/i18n.js';
import './styles/tokens.css';
import './styles/base.css';
import App from './App.jsx';

// Konva 10 stellt Text-Positionierung standardmäßig auf DOM/CSS-konforme
// Regeln um (anderes Vertikal-Alignment als bisher). Ohne Browser-Tool zur
// visuellen Prüfung wird hier bewusst das bisherige Rendering beibehalten,
// um Verschiebungen bei Spieler-Rollen/-Nummern und Feld-Labels zu vermeiden.
Konva.legacyTextRendering = true;

// Theme aus localStorage wiederherstellen
const savedTheme = localStorage.getItem('openfloorball-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

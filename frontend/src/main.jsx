import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n.js';
import './styles/tokens.css';
import './styles/base.css';
import App from './App.jsx';

// Theme aus localStorage wiederherstellen
const savedTheme = localStorage.getItem('floorforge-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

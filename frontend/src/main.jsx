import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n/i18n';
import './styles/tokens.css';
import './styles/base.css';

// Theme aus localStorage oder System-Präferenz
const savedTheme = (() => {
  try {
    return localStorage.getItem('floorforge-theme');
  } catch {
    return null;
  }
})();
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute(
  'data-theme',
  savedTheme || (systemDark ? 'dark' : 'light')
);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

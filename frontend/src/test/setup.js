import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// vite.config.js setzt bewusst `test.globals: false` (Tests importieren
// describe/it/expect explizit aus 'vitest') – @testing-library/react
// registriert seinen automatischen DOM-Cleanup zwischen Tests aber nur,
// wenn es ein GLOBALES afterEach vorfindet. Ohne diese explizite
// Registrierung häufen sich gerenderte Komponenten mehrerer Tests im
// selben document.body an (erst beim ersten echten Komponenten-Test
// dieses Projekts, ErrorBoundary.test.jsx, aufgefallen).
afterEach(cleanup);

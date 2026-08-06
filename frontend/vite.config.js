import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // Issue #49 – Offline-Modus: App-Shell per Service Worker cachen,
    // zuletzt geladene Board-/User-Daten per NetworkFirst-Runtime-Cache
    // offline verfügbar halten. Schreibzugriffe während Offline-Phasen
    // werden separat über frontend/src/utils/offlineQueue.js gepuffert.
    VitePWA({
      registerType: 'autoUpdate',
      // Liegt bewusst in public/ statt src/assets/: vite-plugin-pwa schreibt
      // die manifest.icons[].src-Pfade als reine Strings ins generierte
      // manifest.webmanifest, OHNE sie wie z.B. <link>-Tags in index.html
      // durch Vites Modul-/Hashing-Pipeline zu schicken – ein Pfad unter
      // /src/assets/ existiert im fertigen Build gar nicht mehr (nur der
      // gehashte /assets/…-Pfad), public/-Dateien landen dagegen unverändert
      // unter einem stabilen Pfad im Build-Root.
      includeAssets: ['pwa-icon.png'],
      manifest: {
        name: 'OpenFloorball',
        short_name: 'OpenFloorball',
        description: 'Taktik-Tool für Floorball Coaches',
        theme_color: '#01696f',
        background_color: '#161614',
        display: 'standalone',
        start_url: '/boards',
        icons: [
          { src: '/pwa-icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-icon.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Datensparsamkeit (CLAUDE.md): nur die für die Trainer-Arbeit
            // im Offline-Fall relevanten Board-Ressourcen cachen – explizit
            // NICHT /api/auth, /api/admin oder /api/user/export (Konto-
            // Datenexport), die nicht offline verfügbar sein müssen.
            urlPattern: ({ url, request }) =>
              request.method === 'GET'
              && url.pathname.startsWith('/api/')
              && !url.pathname.startsWith('/api/auth')
              && !url.pathname.startsWith('/api/admin')
              && url.pathname !== '/api/user/export',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'openfloorball-api-cache',
              networkTimeoutSeconds: 4,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Vite 8/Rolldown: die Objekt-Form von manualChunks wurde entfernt,
        // Funktions-Form ist der Ersatz (identisches Chunking-Verhalten)
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/konva') || id.includes('node_modules/react-konva')) return 'konva';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next-browser-languagedetector')) return 'i18n';
        },
      },
    },
  },
});

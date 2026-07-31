# Changelog

Alle wichtigen Änderungen an FloorForge werden in dieser Datei dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).
Versionierung nach [Semantic Versioning](https://semver.org/lang/de/).

> ⚠️ **Hinweis:** Dieses Projekt wurde als Konzept von einem Menschen erdacht.
> Die Implementierung erfolgte durch KI (AI-Slop). Bei kommerziellem Einsatz
> wird der Ideengeber als Urheber genannt und erhält lebenslang kostenlosen
> Top-Premium-Tier-Zugang, unwiderruflich.

---

## [Unreleased]

### In Arbeit (v0.3.x)
- Animations-Playback: Play / Pause / Stop / Geschwindigkeit (#11)
- Spieler-Interpolation zwischen Frames (#12)
- Postcard-Galerie: Board-Übersicht als Postkarten mit Spielfeld-Miniatur (#30)

### Geplant
- Lines-System: Sturmreihen, Defensivreihen, Farben (#16)
- Export: GIF, PNG, MP4, Link (v0.5.0)
- Barrierefreiheit: WCAG 2.1 AA vollständig (v0.7.0)

---

## [0.3.0-dev] – 2026-08-01 (in Entwicklung)

### Added
- **Frame-System** (Issue #10)
  - `FrameSchema` als Sub-Document im Board-Modell: Felder `order`, `label`, `players`, `elements`, `duration`
  - `framesController.js`: 5 REST-Endpunkte (GET, POST, PUT, DELETE, Reorder)
  - `frames.js` Router mit express-validator Validierung
  - Max. 50 Frames pro Board (server- und clientseitig erzwungen)
  - `useFrames.js` Hook: vollständiges State-Management (CRUD, Reihenfolge, aktiver Frame, goNext/goPrev, optimistisches Reorder + Rollback)
  - `FrameTimeline.jsx`: Timeline-Komponente am unteren Spielfeldrand
    - Drag & Drop zum Sortieren
    - Hover-Delete (× Button)
    - „+ Frame“ Button
    - Frame-Zähler (1 / 5)
    - Barrierefreiheit: aria-label, aria-pressed, aria-live
  - `FrameTimeline.module.css`: vollständiges Styling mit CSS-Variablen
- **Board Model** (Issues #5, #7, #10)
  - `notes`-Feld ergänzt (max. 500 Zeichen) für Coach-Notizen
  - `frames[]` Sub-Array für Frame-by-Frame System
  - `activeFrameIndex` persistiert
  - `lines[]` Sub-Schema für Lines-System vorbereitet
- **Postcard-Galerie** geplant (Issue #30)
  - Board-Übersicht: Postkarten-Layout (Spielfeld-Miniatur links, Notizen rechts)
  - Notizen nur lesbar in der Galerie, editierbar nur im Board selbst
  - Toggle Galerie ↔ Kompakt-Ansicht

---

## [0.2.0] – 2026-08-01

### Added
- `FloorballField.jsx`: IFF-konformes 2D Großfeld mit Konva.js
  - Alle IFF-Linien: Mittellinie, Mittelkreis (r=2.85m), Torraum (4×5m)
  - Torwartfläche (2.5×1m), Tore (160×115cm), abgerundete Ecken
  - Theme-aware Farben (dark / light / vikings / iff)
- `FieldContainer.jsx`: responsiver Wrapper mit ResizeObserver
- `fieldConfig.js`: alle IFF-Maße als Konstanten (Groß-, Kleinfeld, Street, 3v3)
  - IFF-Ballfarben-Definitionen
  - Standard-Spielerpositionen Großfeld
  - Snapping-Raster-Optionen
- `useField.js`: Hook für Spielfeld-State (Typ, Grid, Zoom)
- `FieldContainer.module.css`: Shimmer-Ladeanimation
- i18n Locale-Dateien: `de.json` + `en.json` (vollständig)
- CSS Design-Tokens: alle 4 Themes (dark, light, vikings, iff)
- CI-Workflows repariert: fehlende Dateien, ESLint-Configs, Jest-Setup
- `index.html` + `main.jsx` als Vite-Einsteigspunkte
- `base.css` + `tokens.css` als CSS-Grundlage

### Fixed
- `dependency-review.yml`: nur noch auf Pull Requests (nicht push)
- `security.yml`: cron-Syntax korrigiert
- `release.yml`: `workflow_dispatch` als Trigger ergänzt
- `label-sync.yml`: `continue-on-error` bei Permission-Fehlern
- `ci.yml`: Cache-Key und `npm install` statt `npm ci`
- ESLint-Configs für Frontend (JSX) und Backend (Node.js Globals)
- Jest-Config für native ES Modules

---

## [0.1.0] – 2026-08-01

### Added
- Backend-Grundstruktur: Express.js, Helmet, CORS, Morgan, Rate-Limiting
- JWT-Authentifizierung (Register, Login, Refresh, Logout)
- PostgreSQL-Datenbankschema: `users`, `settings`, `boards`, `frames`, `lines`, `exports`
- Redis-Session-Management
- Docker Compose: backend, frontend, postgres, redis, nginx
- Nginx-Reverse-Proxy-Konfiguration
- GitHub Repository-Struktur: Labels, Issue-Templates, Milestones
- Automatisierte Workflows: CI, Release, Security, Dependency Review, Label Sync
- CHANGELOG, Wiki, Roadmap
- `.env.example` für alle Services
- Seed-Skript mit Demo-Admin und Demo-Board
- AI-Slop-Hinweis + Ideengeber-Klausel in README

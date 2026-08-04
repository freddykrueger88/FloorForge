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

### Fixed
- CI: `EXPORTS_DIR` im Backend-Testjob (`.github/workflows/ci.yml`) auf
  `/tmp/floorforge-exports-ci` gesetzt statt des Produktions-Defaults
  `/app/exports`, der nur innerhalb des Docker-Containers beschreibbar
  ist – auf dem bare GitHub-Actions-Runner (non-root) führte das seit
  dem MP4-Export-Feature (Commit `b6a5a2e`) durchgehend zu `EACCES` in
  `POST /api/export/gif`/`mp4` und damit zu 3 fehlschlagenden Tests in
  `export.test.js`. Die produktive Docker-Umgebung war davon nie
  betroffen. (Erster Fix-Versuch nutzte `${{ runner.temp }}` – der
  `runner`-Kontext steht in einem Job-`env`-Block aber nicht zur
  Verfügung, was den gesamten Workflow ungültig machte; korrigiert
  auf einen literalen Pfad.) Zusätzlich: verschluckte Fehlermeldungen in
  `exportController.js`/`backupCron.js` behoben (`err` statt
  `err.message` an den Logger übergeben – Winstons Format gibt einen
  reinen String-Zweitparameter sonst nicht aus), was die Diagnose
  unnötig erschwert hat.

---

## [0.9.0] – 2026-08-04

Mit Abstand größtes Release bisher: 25 abgeschlossene Issues, sieben neue
Funktionsbereiche und eine vollständige Abhängigkeits-/Runtime-Modernisierung.

### Added
- **Formationen-/Startaufstellungs-Vorlagen-Bibliothek** (#46): Aufstellungen
  als wiederverwendbare Vorlage speichern, über alle Boards hinweg laden,
  automatische Neuskalierung bei abweichendem Feldtyp.
- **Playbooks** (#52): Boards zu benannten Sammlungen gruppieren (z. B. alle
  Standardsituationen einer Saison), Filter-Leiste in der Board-Übersicht.
- **Trainings-/Übungsplaner** (#45): Trainingseinheiten als geordnete
  Sequenz mehrerer Boards mit Dauer/Notiz je Übung, eigener PDF-Export für
  den kompletten Trainingsplan.
- **Zentraler Team-Kader** (#53): Spieler mit Name/Rückennummer/Position
  einmal anlegen, im Board-Editor per Dropdown zuweisen statt Freitext –
  rein additiv, Board-Spieler bleiben weiterhin frei editierbar.
- **PWA/Offline-Modus** (#49): Service Worker cacht App-Shell + zuletzt
  gesehene Board-Daten; Schreibzugriffe werden bei Verbindungsabbruch in
  einer IndexedDB-Queue gepuffert und beim Wiederverbinden automatisch
  synchronisiert (Last-Write-Wins). Global sichtbarer Offline-Banner.
- **Board-Sharing** (#51, reduziertes MVP): Boards mit anderen Nutzern
  teilen (Lese-/Schreibzugriff), Kollaboratoren-Verwaltung im Editor.
  Bewusst ohne Echtzeit-Sync/WebSocket – siehe ROADMAP für die volle,
  zurückgestellte Ausbaustufe.
- Tastaturkürzel-Übersicht (Hilfe-Overlay) + sichtbarer Undo/Redo-Verlauf
  statt nur Einzelschritt (#47, #48)
- Zeichenwerkzeuge (Linien/Pfeile/Freihand) per Koordinaten-Formular
  vollständig tastaturbedienbar (#38, WCAG 2.1.1)
- TLS/HTTPS-Beispiel mit Caddy (`docker-compose.tls.yml`) (#39)
- Dedizierte Tests für Frames-/Lines-CRUD-Endpunkte (#44)

### Changed
- Stürmer stehen bei Anstoß jetzt korrekt in der eigenen Hälfte (vorher
  exakt vertauscht); Löschbestätigung für Boards von drei auf einen
  Bestätigungsschritt reduziert
- Standard-Aufstellung wird jetzt sofort beim Anlegen eines Boards gesetzt
  (serverseitig, transaktional) statt erst client-seitig nachzuladen;
  Auto-Speicherung von 2s auf 300ms Debounce beschleunigt
- Marken-Redesign: neue globale Kopfzeile mit Sprachauswahl-Button
  (Deutsch/Englisch), sportlichere Eigenmarke bei unverändertem
  Vikings-/IFF-Theme
- Spielfeld-Rendering IFF-korrekt überarbeitet: Anspielpunkte statt
  Mittelkreis (Floorball nutzt keinen Mittelkreis), Torraum-Abstand zur
  Bande (bespielbarer Raum hinter dem Tor), grüne statt fußballtypische
  Spielfläche
- `/boards` ist jetzt die direkte Startseite nach Login/Registrierung
  statt einer separaten Zwischenseite (siehe Removed)
- **Vollständige Abhängigkeits- und Runtime-Modernisierung** (5 Phasen,
  jede einzeln verifiziert und committed):
  - Backend: Express 4→5, redis-Client 4→6 (RESP3-Default), archiver 7→8
    (ESM-Rewrite, `ZipArchive`-Klasse statt Factory-Funktion), dotenv
    16→17, express-rate-limit 7→8, jest 29→30, eslint 9→10
  - Frontend: zustand 4→5, konva 9→10 (`Konva.legacyTextRendering = true`
    gesetzt, um das bisherige Text-Rendering pixelgenau zu erhalten),
    i18next 23→26, react-i18next 14→17
  - Infrastruktur: Node 20/22→24 (Active LTS) in allen Dockerfiles + CI,
    nginx 1.27→1.30, **Postgres 16→18** (Live-Migration der
    Produktivdatenbank per pg_dump/pg_restore in ein neues Volume –
    Postgres-Datenverzeichnisse sind zwischen Majors nicht kompatibel,
    altes Volume bleibt als Fallback erhalten), Redis-Server 7→8, alle
    GitHub Actions auf aktuelle Major-Versionen
  - Bewusst zurückgestellt: Vite 7→8 + `@vitejs/plugin-react` 5→6
    (ungelöster Peer-Konflikt mit einer Pre-Release-Version von
    `@babel/core` im Rolldown-Ökosystem), ESLint 10 im Frontend
    (`eslint-plugin-react` unterstützt aktuell nur `eslint ^9.7`)

### Fixed
- Fünf Dependency-Sicherheitslücken behoben (#32), u. a. bcrypt→tar-Kette
- Vite 5→7 + `@vitejs/plugin-react` aktualisiert – Sicherheitslücke im
  esbuild-Dev-Server geschlossen (#34)
- react-router v8 + React 19 – CSRF-Bypass-Lücke GHSA-qwww-vcr4-c8h2
  geschlossen (#35)
- `JWT_SECRET` wird beim Start jetzt auf Vorhandensein und Mindestlänge
  geprüft, statt stillschweigend mit einem schwachen Wert zu starten (#40)
- Line konnte nicht mehr losgelassen werden, sobald man mit dem Zeichnen
  einer Linie/eines Pfeils begonnen hatte (Konva-Hit-Testing-Bug)
- `<html lang>` wird jetzt synchron mit der UI-Sprache gehalten (#0849a5d,
  WCAG 3.1.1) – Screenreader lasen sonst mit falschen Ausspracheregeln vor
- Team-Farben (`homeColor`/`awayColor`) wurden beim Speichern kaputt
  persistiert (#33)
- Positions-Bezeichnungen an den tatsächlichen Floorball-Standard
  angepasst statt Eishockey-Terminologie (#28)
- Weißer Text auf weißem Button im Vikings-Theme
- Datenschutzerklärung ergänzt: Backup-Aufbewahrungsfristen nach
  Kontolöschung waren nicht dokumentiert (#41)
- **archiver v8**: ESM-Rewrite ohne Default-Export brach den
  Account-Export/Backup-Cron kommentarlos – auf die neue `ZipArchive`-API
  umgestellt
- **nginx-Cache-Regel**: Service-Worker-Datei (`sw.js`) wurde von der
  generischen Static-Asset-Regel fälschlich 1 Jahr lang gecacht, was
  PWA-Updates nie beim Client hätte ankommen lassen
- **Postgres-18-Image**: neue Mount-Konvention (`/var/lib/postgresql`
  statt `.../data`) erkannt und Compose-Konfiguration entsprechend
  angepasst, bevor produktiv migriert wurde

### Security
- Datensparsamkeit in Logs: keine E-Mail-Adressen/Klarnamen mehr in
  Log-Statements, wo eine User-ID zur Nachverfolgung ausreicht; Log-Datei
  mit Größen-/Rotationsgrenze versehen
- Ungenutzte DB-Spalte `exports.file_path` entfernt (#42, Datensparsamkeit)
- Kein persistenter Admin-Audit-Trail eingeführt – als nicht notwendig
  bewertet, da Alleinbetrieb (#43, geschlossen als „wontfix")

### Removed
- **Dashboard-Seite** entfernt (reine Begrüßungs-/Zwischenseite ohne
  Eigenwert) – `/boards` ist jetzt die direkte Startseite. Das
  Statistik-Widget (#50, „Statistiken zu genutzten Formationen/Lines")
  wurde mitentfernt, da es ausschließlich auf dem jetzt entfernten
  Dashboard angezeigt wurde; ebenso der zugehörige Backend-Endpunkt
  `GET /api/user/stats`, um keinen toten Code zu hinterlassen.

---

## [0.8.0] – 2026-08-02

### Added
- **MP4-Video-Export** via FFmpeg, wahlweise mit Wasserzeichen (#23)
- **PDF-Taktikblatt-Export** via pdfkit, mehrere Frames pro Seite (#24)
- **Mehrsprachigkeit**: Englisch als zweite Sprache (i18n vollständig) (#25)

### Fixed
- Vite 5→7 + `@vitejs/plugin-react` – esbuild-Dev-Server-Sicherheitslücke
  geschlossen (#34)
- react-router v8 + React 19 – CSRF-Bypass-Lücke GHSA-qwww-vcr4-c8h2 (#35)
- `<html lang>`-Attribut wird bei Sprachwechsel synchron gehalten (WCAG 3.1.1)

---

## [0.7.0] – 2026-08-02

### Added
- **Barrierefreiheit Teil 1** (#19): Skip-Links, Fokus-Management,
  vollständige Tastaturnavigation, Formularmuster/-validierung
- **Barrierefreiheit Teil 2** (#19): Screenreader-Live-Ankündigungen,
  Legasthenie-freundliche Schrift (OpenDyslexic), Farbblindheits-Modi
- **DSGVO-Konformität** (#20): Datenschutzseite, Auskunftsrecht Art. 15,
  IP-Anonymisierung in Logs
- **Backup & Export** (#21): manueller Datenexport/-import (ZIP) +
  automatische, konfigurierbare Admin-Backups mit Aufbewahrungsfrist
- **Datenvernichtung** (#22): Account inkl. aller Daten löschen, mit
  E-Mail-Bestätigung

### Fixed
- Positions-Bezeichnungen an den Floorball-Standard angepasst (#28)
- Datensparsamkeit: keine E-Mail-Adressen in Logs, Log-Größenbegrenzung

---

## [0.6.0] – 2026-08-01

### Added
- **Team-Farben**: Heim-/Auswärtsfarbe + Ballfarbe konfigurierbar,
  IFF-konforme Farbpalette (#14)
- **Einstellungsseite** (`/settings`) mit Passwort ändern, E-Mail ändern,
  Account löschen (#18, #17, #31, #22)
- **Admin-Panel**: Benutzerverwaltung für den ersten registrierten
  Account (automatisch Admin) (#26)
- Dashboard-Redesign: personalisierte, zentrierte Begrüßungsseite
  *(in v0.9.0 wieder entfernt, siehe dort)*

### Fixed
- Team-Farben (`homeColor`/`awayColor`) wurden beim Speichern kaputt
  persistiert (#33)
- Weißer Text auf weißem Button im Vikings-Theme
- Fünf Dependency-Sicherheitslücken behoben (#32)
- Dashboard verlinkte fälschlich nicht zu den Spielfeldern

---

## [0.5.0] – 2026-08-01

### Added
- **GIF-Export** via FFmpeg, serverseitig gerendert aus Konva-Offscreen-PNGs (#15)
- **Share-Link mit Ablaufzeit**: Spielzug ohne Login ansehen, konfigurierbare
  Gültigkeitsdauer (#16)
- Positions-Hinweise/Tooltips für jede Spielerposition, tastaturzugänglich (#27)

### Fixed
- Export: Backend-Absturz durch fehlende ffmpeg-Installation im
  Produktions-Image behoben

---

## [0.4.0] – 2026-08-02

### Added
- **Lines-System** (Issue #12): Sturm-/Defensivreihen anlegen, Spieler zuweisen,
  Farben & Typ (offense/defense/special) konfigurieren, aktive Line auf dem
  Feld hervorheben. Max. 10 Lines pro Board.
- **Spielfeld-Varianten** (Issue #13): Kleinfeld (20×14m), 3v3 (22×11m) und
  Street Floorball (25×15m) zusätzlich zum Großfeld, wählbar bei Board-
  Erstellung und nachträglich im Editor änderbar (mit Warnung + proportionaler
  Neuskalierung bestehender Positionen/Zeichnungen)
- Automatisches Seeding feldtyp-passender Standardpositionen für neue Boards

### Fixed
- Login/Register: CORS-Origin-Mismatch bei Zugriff über LAN-IP behoben
- Session-Cookie wurde mit `Secure`-Flag über reines HTTP ausgeliefert und
  vom Browser verworfen (neu: `COOKIE_SECURE` konfigurierbar)
- Axios-Interceptor leitete bei jedem 401 sofort zum Login um – auch beim
  Login/Register-Request selbst, wodurch Fehlermeldungen sofort verschwanden
- Fehlende i18n-Keys (`auth.*`, `a11y.skipToContent`) auf Login/Register-Seite
- Zeichen-Werkzeugleiste (`DrawingToolbar`) war nirgends eingebunden –
  Farbe/Strichstärke/Undo/Redo/Clear waren über die UI nicht erreichbar
- Spielerpositionen wurden beim Ziehen nicht an die Feldgrenzen geklemmt
- Docker-Healthchecks (Compose + Dockerfiles) nutzten `localhost`, was durch
  IPv6-Auflösung in Alpine-Containern fälschlich als "unhealthy" galt

---

## [0.3.0] – 2026-08-01

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
- **Animation** (#11): Play/Pause/Stop, Geschwindigkeit einstellbar,
  Spieler-Interpolation zwischen Frames
- **Postcard-Galerie** (#30): Board-Übersicht als Postkarten
  (Spielfeld-Miniatur links, Notizen rechts, nur lesbar in der Galerie)
- Spielername auf Spielertoken anzeigen, Line-abhängig ein-/ausblendbar (#29)

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

## [0.1.0] – 2026-07-31

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

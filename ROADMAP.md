# 🗳️ FloorForge Roadmap

Diese Roadmap zeigt die geplante Entwicklung von FloorForge.
Reihenfolge und Inhalte können sich ändern. Issues tracken den Fortschritt.

> Stand: 04.08.2026 — nach 53 bearbeiteten Issues (#1–#53), aktuell v0.9.0

---

## ✅ v0.1.0 – Grundstruktur & Infrastruktur

- ✓ Projekt-Setup (Backend Node.js/Express, Frontend React/Vite)
- ✓ Docker Compose (App, DB, Redis, Nginx)
- ✓ Authentifizierung (Register/Login, JWT, erster User = Admin)
- ✓ Datenbankschema (Grundstruktur)
- ✓ CI/CD Pipeline (GitHub Actions)
- ✓ Grundlegendes Routing (Frontend)
- ✓ GitHub Repository-Struktur (Labels, Templates, Milestones)
- ✓ CHANGELOG, Wiki, Roadmap, README

## ✅ v0.2.0 – Spielfeld & Grundzeichnung

- ✓ 2D Floorball Spielfeld (Großfeld IFF-konform, 40×20m) mit Konva.js
- ✓ IFF-Linien vollständig (Mittellinie, Anspielpunkte, Torraum, Tore)
- ✓ Theme-System (Dark, Light, Vikings, IFF)
- ✓ Spielfeld-Konfiguration (fieldConfig.js: Groß-, Kleinfeld, Street, 3v3)
- ✓ IFF-Ballfarben-Definitionen
- ✓ i18n (Deutsch + Englisch)
- ✓ CSS Design-Tokens (base.css, tokens.css)
- ✓ CI/CD Workflows stabilisiert
- ✓ Spieler-Icons vorplatziert & beweglich (Teil von v0.3.0)
- ✓ Pfeil-Tool (Bewegung, Pass, Schuss) (Teil von v0.3.0)
- ✓ Undo/Redo Funktion
- ✓ Spielfeld speichern & laden → Board-System läuft

## ✅ v0.3.0 – Frame-System & Boards

- ✓ Frame-System: Frames erstellen, löschen, sortieren (#10)
- ✓ Frame-Timeline UI mit Drag & Drop (#10)
- ✓ Board-Modell erweitert: `notes`, `frames[]`, `lines[]` vorbereitet (#10)
- ✓ useFrames Hook: vollständiges State-Management (#10)
- ✓ Animation abspielen (Play/Pause/Stop) (#11)
- ✓ Animationsgeschwindigkeit einstellen (#11)
- ✓ Spieler bewegen sich zwischen Frames (Interpolation) (#11)
- ✓ Postcard-Galerie: Board-Übersicht als Postkarten (#30)
- ✓ Spielfeld-Miniatur (readonly) in der Galerie (#30)
- ✓ Pfeil-/Linien-Editor für Spielzüge
- ✓ Spieler auf dem Feld platzieren & bewegen
- ✓ Spielername auf Spielertoken (Line-abhängig, ein-/ausblendbar) (#29)

## ✅ v0.4.0 – Lines & Teams

- ✓ Lines anlegen (Sturmreihen, Defensivreihen) (#12)
- ✓ Spieler einer Line zuweisen (#12)
- ✓ Farben für Heim/Gast/Lines konfigurieren (#12)
- ✓ Verschiedene Spielfeld-Typen wählbar (Kleinfeld, 3v3, Street) (#13)
- ✓ Positions-Hinweise/Tooltips für jede Spielerposition (#27)

## ✅ v0.5.0 – Export

- ✓ GIF-Export (FFmpeg, serverseitig) (#15)
- ✓ Link-Export (Share-Link mit Ablaufzeit, ohne Login) (#16)
- ✓ MP4-Video-Export via FFmpeg (#23)
- ✓ PDF-Taktikblatt-Export via pdfkit (#24)
- ✓ Export-Einstellungen (Auflösung/FPS, Wasserzeichen, Seitenformat)

## ✅ v0.6.0 – Design & Themes (Einstellungsseite)

- ✓ Dark/Light/Vikings/IFF-Themes vollständig (#17)
- ✓ Eigene Heim-/Auswärts-/Ballfarben konfigurierbar
- ✓ Einstellungsseite (eigene Route `/settings`) (#18)
- ✓ Passwort ändern, E-Mail ändern (#31)
- ✓ Admin-Panel: Benutzerverwaltung (#26)
- ✓ Marken-Redesign + globale Kopfzeile mit Sprachauswahl

## ✅ v0.7.0 – Barrierefreiheit & DSGVO

- ✓ Screenreader-Unterstützung, ARIA, Live-Ankündigungen (#19)
- ✓ Vollständige Tastaturnavigation (Spieler verschieben, Zeichenwerkzeuge
  per Koordinaten-Formular) (#19, #37, #38)
- ✓ Farbblindheits-Modi, Legasthenie-Schrift (OpenDyslexic) (#19)
- ✓ DSGVO: Datenschutzseite, Auskunftsrecht Art. 15, IP-Anonymisierung (#20)
- ✓ Backup & Export: manueller Export/Import + automatische Admin-Backups (#21)
- ✓ Datenvernichtung: Account-Löschung mit Bestätigung (#22)
- ○ WCAG 2.1 AA / BITV 2.0 / EN 301 549 – formale externe Zertifizierung
  steht aus (Implementierung orientiert sich durchgehend an den
  Richtlinien, ist aber nicht extern auditiert)

## ✅ v0.8.0 – Polish & Mobile

- ✓ Mehrsprachigkeit vollständig (Deutsch + Englisch) (#25)
- ✓ Performance: Lazy Loading & Code-Splitting pro Route
- ✓ Druckfreundliches Taktikblatt (über PDF-Export abgedeckt) (#24)
- ○ Mobile/Tablet-Responsive – nicht dediziert getestet, kein bekannter
  Blocker; siehe Backlog

## ✅ v0.9.0 – Erweiterte Features, Härtung & Modernisierung

Deutlich über die ursprüngliche Roadmap hinaus gewachsen:

- ✓ Tastaturkürzel-Übersicht + sichtbarer Undo/Redo-Verlauf (#47, #48)
- ✓ Formationen-/Startaufstellungs-Vorlagen-Bibliothek (#46)
- ✓ Playbooks: Board-Sammlungen gruppieren (#52)
- ✓ Trainings-/Übungsplaner (Sequenz von Drills mit Dauer/Notiz, PDF-Export) (#45)
- ✓ Zentraler Team-Kader statt Board-lokaler Spielerdaten (#53)
- ✓ PWA/Offline-Modus (Service Worker, Offline-Schreibpuffer) (#49)
- ✓ Board-Sharing zwischen Nutzern (Lese-/Schreibzugriff, reduziertes MVP) (#51)
- ✓ IFF-Spielfeld-Korrekturen (Anspielpunkte statt Mittelkreis, Torraum-
  Abstand zur Bande, Stürmer-Anstoßpositionen)
- ✓ Diverse Sicherheits-/Robustheitsfixes (#32–#44): Dependency-CVEs,
  JWT_SECRET-Validierung, TLS/Caddy-Beispiel, Datensparsamkeit in Logs,
  Testabdeckung Frames/Lines-CRUD
- ✓ Dashboard-Seite entfernt zugunsten von `/boards` als direkter Startseite
- ✓ Vollständige Abhängigkeits-/Runtime-Modernisierung: Express 5,
  Postgres 18 (Live-Migration), Redis 8, Node 24, Konva 10, zustand 5,
  i18next 26, alle GitHub Actions – siehe CHANGELOG für Details

---

## 🔮 Zukunft (Backlog)

- □ Vite 7→8-Umstieg – zurückgestellt, da `@vitejs/plugin-react@6`s
  optionale Rolldown/Babel-Integration aktuell einen ungelösten
  Peer-Konflikt hat (Pre-Release-Abhängigkeit); erneut prüfen, sobald
  sich das Rolldown-Ökosystem stabilisiert hat
- □ ESLint 10 im Frontend – blockiert, bis `eslint-plugin-react` offiziell
  ESLint 10 unterstützt (aktuell nur `^9.7`)
- □ Echtzeit-Kollaboration (volle Version): Issue #51 wurde bewusst als
  reduziertes MVP ohne WebSocket/Live-Sync umgesetzt; eine echte
  Gleichzeitig-Bearbeitung mit Konfliktbehandlung bleibt ein deutlich
  größeres, eigenständiges Vorhaben
- □ Mobile/Tablet: dedizierte Touch-Gesten-Optimierung & Responsive-Tests
- □ Formale WCAG 2.1 AA / BITV 2.0 / EN 301 549 Prüfung durch Dritte
- □ GitHub Wiki (separates Repo) vollständig mit `docs/wiki/` synchron
  halten – aktuell sind dort nur 3 von den in `Home.md` verlinkten Seiten
  gepflegt
- □ Altes Postgres-16-Datenvolume (`floorforge_db_data`) nach Bestätigung
  der Postgres-18-Stabilität entfernen

### Feature-Ideen (Coaching-Funktionalität)

- □ Echter E-Mail-Einladungs-Flow für Board-Sharing: aktuell kein
  SMTP/Mailserver hinterlegt (kein `nodemailer` o.ä. im Backend) –
  `addCollaborator` (Issue #51) setzt zwingend einen bereits
  existierenden Nutzer-Account mit dieser E-Mail voraus, es wird keine
  Einladungs-Mail verschickt. Für echtes "Einladen" bräuchte es
  entweder eine SMTP-Konfiguration + Token-basierten Einladungslink für
  noch nicht registrierte E-Mails, oder das aktuelle Verhalten in der UI
  klarer als "Kollaborator hinzufügen (nur bestehende Accounts)"
  kommunizieren, um Verwirrung zu vermeiden.
- □ Video-/Spielfilm-Integration: Zeichnungen über echtes Spielmaterial
  legen (ähnlich Hudl) – deutlich größerer Umfang (Speicherung,
  Wiedergabe-Synchronisation)
- □ Gegner-Tagging: Boards/Playbooks mit "vs. Team X" markieren, um vor
  einem Spiel gezielt Scouting-Boards wiederzufinden
- □ Echtzeit-Co-Editing über das MVP (#51) hinaus: mehrere Coaches
  gleichzeitig mit Live-Cursor am selben Board (siehe auch
  "Echtzeit-Kollaboration (volle Version)" oben)
- □ Schneller Einzel-Frame-Share: ein Frame als fertiges Bild (z. B. für
  WhatsApp) exportieren, ohne Login/App auf Empfängerseite – kleinerer
  Aufwand, da die GIF/MP4/PDF-Export-Pipeline (Issue #15/#23/#24) schon
  existiert und wiederverwendet werden kann

---

*Roadmap wird kontinuierlich aktualisiert. Letztes Update: 04.08.2026*

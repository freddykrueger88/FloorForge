# 🗳️ FloorForge Roadmap

Diese Roadmap zeigt die geplante Entwicklung von FloorForge.
Reihenfolge und Inhalte können sich ändern. Issues tracken den Fortschritt.

> Stand: 01.08.2026 — nach 10 bearbeiteten Issues

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
- ✓ IFF-Linien vollständig (Mittellinie, Kreise, Torraum, Tore)
- ✓ Theme-System (Dark, Light, Vikings, IFF)
- ✓ Spielfeld-Konfiguration (fieldConfig.js: Groß-, Kleinfeld, Street, 3v3)
- ✓ IFF-Ballfarben-Definitionen
- ✓ i18n (Deutsch + Englisch)
- ✓ CSS Design-Tokens (base.css, tokens.css)
- ✓ CI/CD Workflows stabilisiert
- □ Spieler-Icons vorplatziert & beweglich → Teil von v0.3.0
- □ Pfeil-Tool (Bewegung, Pass, Schuss) → Teil von v0.3.0
- □ Undo/Redo Funktion → geplant
- □ Spielfeld speichern & laden → Board-System läuft

## 🔄 v0.3.0 – Frame-System & Boards (in Arbeit)

- ✓ Frame-System: Frames erstellen, löschen, sortieren (#10)
- ✓ Frame-Timeline UI mit Drag & Drop (#10)
- ✓ Board-Modell erweitert: `notes`, `frames[]`, `lines[]` vorbereitet (#10)
- ✓ useFrames Hook: vollständiges State-Management (#10)
- □ Animation abspielen (Play/Pause/Stop) (#11)
- □ Animationsgeschwindigkeit einstellen (#11)
- □ Spieler bewegen sich zwischen Frames (Interpolation) (#12)
- □ Postcard-Galerie: Board-Übersicht als Postkarten (#30)
- □ Spielfeld-Miniatur (readonly) in der Galerie (#30)
- □ Pfeil-/Linien-Editor für Spielzüge
- □ Spieler auf dem Feld platzieren & bewegen

## 🔵 v0.4.0 – Lines & Teams

- □ Lines anlegen (Sturmreihen, Defensivreihen)
- □ Spieler einer Line zuweisen
- □ Farben für Heim/Gast/Lines konfigurieren
- □ Positionen mit Hinweisen/Notizen versehen
- □ Verschiedene Spielfeld-Typen wählbar (Kleinfeld, 3v3, Street)

## 🟣 v0.5.0 – Export

- □ GIF-Export (FFmpeg, serverseitig)
- □ Link-Export (Share-Link mit Ablaufzeit)
- □ PNG-Export (einzelner Frame)
- □ MP4-Export
- □ PDF-Export (Taktikblatt)
- □ Export-Einstellungen (Auflösung, Geschwindigkeit)

## ⚪ v0.6.0 – Design & Themes (Einstellungsseite)

- □ Dark Theme (vollständig)
- □ Light Theme (vollständig)
- □ TB Uphusen Vikings Theme (Blau-Weiß)
- □ IFF Theme
- □ Eigene Farben konfigurieren
- □ Einstellungsseite (eigene Route `/settings`)
- □ Ball-Farbe wählbar (IFF-Richtlinien)

## 🟤 v0.7.0 – Barrierefreiheit & DSGVO

- □ Screenreader-Unterstützung (ARIA vollständig)
- □ Tastaturnavigation vollständig
- □ Farbblindheits-Modi
- □ ADHD-Modus (reduzierte Animationen, klare Struktur)
- □ Legasthenie-freundliche Schrift (OpenDyslexic)
- □ WCAG 2.1 AA Audit & Zertifizierung
- □ BITV 2.0 / EN 301 549 Prüfung
- □ DSGVO: Datenschutzerklärung, Impressum
- □ Datenexport (alle Daten als JSON/ZIP)
- □ Datenvernichtung (dreifache Sicherheitsabfrage)
- □ Backup-Funktion

## 🟤 v0.8.0 – Polish & Mobile

- □ Mehrsprachigkeit vollständig (EN)
- □ Performance-Optimierung (Lazy Loading, Code Splitting)
- □ Mobile-Responsive (Tablet-Unterstützung)
- □ Druckansicht (Taktikblatt)

## 🔮 Zukunft (Backlog)

- □ Spieler-Datenbank (Namen, Nummern, Fotos)
- □ Statistiken pro Spielfeld/Taktik
- □ Weitere Spielfeld-Varianten
- □ Offline-Modus (PWA)
- □ Tablet-optimierte Touch-Gesten

---

*Roadmap wird kontinuierlich aktualisiert. Letztes Update: 01.08.2026*

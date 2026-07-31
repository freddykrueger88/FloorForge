# 🗳️ FloorForge Roadmap

Diese Roadmap zeigt die geplante Entwicklung von FloorForge.
Reihenfolge und Inhalte können sich ändern. Issues tracken den Fortschritt.

---

## 🟢 v0.1.0 – Grundstruktur & Infrastruktur

- [ ] Projekt-Setup (Backend Node.js/Express, Frontend React/Vite)
- [ ] Docker Compose (App, DB, Redis, FFmpeg)
- [ ] Authentifizierung (Register/Login, JWT, erster User = Admin)
- [ ] Datenbankschema (Grundstruktur)
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Grundlegendes Routing (Frontend)

## 🟡 v0.2.0 – Spielfeld & Grundzeichnung

- [ ] 2D Floorball Spielfeld (Großfeld IFF-konform, 40x20m)
- [ ] Spieler-Icons vorplatziert (5+1 Heim, 5+1 Gast)
- [ ] Pfeil-Tool (Bewegung, Pass, Schuss)
- [ ] Undo/Redo Funktion
- [ ] Spielfeld speichern & laden
- [ ] Neue Spielfelder anlegen (Spielverwaltung)

## 🟠 v0.3.0 – Frame-by-Frame Animation

- [ ] Frame-System (Frames erstellen, löschen, sortieren)
- [ ] Animation abspielen (Play/Pause/Stop)
- [ ] Geschwindigkeit der Animation einstellen
- [ ] Spieler bewegen sich zwischen Frames (Interpolation)
- [ ] Frame-Timeline UI

## 🔵 v0.4.0 – Lines & Teams

- [ ] Lines anlegen (Sturmreihen, Defensivreihen)
- [ ] Spieler einer Line zuweisen
- [ ] Farben für Heim/Gast/Lines konfigurieren
- [ ] Positionen mit Hinweisen/Notizen versehen
- [ ] Verschiedene Spielfeld-Typen (Kleinfeld, 3v3, Street)

## 🟣 v0.5.0 – Export

- [ ] GIF-Export (FFmpeg, serverseitig)
- [ ] Link-Export (Share-Link mit Ablaufzeit)
- [ ] PNG-Export (einzelner Frame)
- [ ] Export-Einstellungen (Auflösung, Geschwindigkeit)

## ⚪ v0.6.0 – Design & Themes

- [ ] Dark Theme
- [ ] Light Theme
- [ ] TB Uphusen Vikings Theme (Blau-Weiß)
- [ ] IFF Theme
- [ ] Eigene Farben konfigurieren
- [ ] Einstellungsseite (eigene Seite)

## 🟤 v0.7.0 – Barrierefreiheit & DSGVO

- [ ] Screenreader-Unterstützung (ARIA)
- [ ] Tastaturnavigation vollständig
- [ ] Farbblindheits-Modi
- [ ] WCAG 2.1 AA Audit
- [ ] DSGVO: Datenschutzerklärung, Datenexport, Datenvernührung
- [ ] Backup & Export aller Daten

## 🟤 v0.8.0 – Weitere Exports & Polish

- [ ] MP4-Export
- [ ] PDF-Export (Taktikblatt)
- [ ] Mehrsprachigkeit (EN)
- [ ] Performance-Optimierung
- [ ] Mobile-Responsive (Tablet)

## 🔮 Zukunft (Backlog)

- [ ] Spieler-Datenbank (Namen, Nummern, Fotos)
- [ ] Statistiken pro Spielfeld/Taktik
- [ ] Druckansicht
- [ ] Weitere Spielfeld-Varianten

---

*Roadmap wird kontinuierlich aktualisiert.*

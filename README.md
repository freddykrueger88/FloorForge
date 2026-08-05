# 🏒 OpenFloorball

**Digitales Taktikboard für Floorball – Open Source, selbst gehostet, IFF-konform**

[![License](https://img.shields.io/github/license/freddykrueger88/OpenFloorball)](https://github.com/freddykrueger88/OpenFloorball/blob/main/LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://hub.docker.com/)
[![GitHub contributors](https://img.shields.io/github/contributors/freddykrueger88/OpenFloorball)](https://github.com/freddykrueger88/OpenFloorball/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/freddykrueger88/OpenFloorball/blob/main/CONTRIBUTING.md)
[![GitHub issues](https://img.shields.io/github/issues/freddykrueger88/OpenFloorball)](https://github.com/freddykrueger88/OpenFloorball/issues)

> **Mission:** OpenFloorball ist ein modernes, kostenloses Taktikboard für Floorball. Entwickelt für Trainer, Vereine und Teams, um Spielzug, Formationen und Trainingsinhalte einfach digital zu planen, zu visualisieren und zu teilen – vollständig als Open-Source-Lö¬¶¬ƒung.

---

## 📋 Inhaltsverzeichnis

- [Warum OpenFloorball?](#-warum-openfloorball)
- [Fur wen eignet sich OpenFloorball?](#-fur-wen-eignet-sich-openfloorball)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Erste Schritte](#-erste-schritte)
- [Verwendung](#-verwendung)
- [Projektstruktur](#-projektstruktur)
- [Technischer Stack](#-technischer-stack)
- [Entwicklung](#-entwicklung)
- [Roadmap](#-roadmap)
- [Mitwirken](#-mitwirken)
- [Lizenz](#-lizenz)
- [Kontakt](#-kontakt)

---

## 🤔 Warum OpenFloorball?

Als Floorball-Trainer oder Verein stehst du vor der Herausforderung, Taktiken und Spielzuge effektiv zu vermitteln. Klassische Whiteboards sind begrenzt, kommerzielle Losungen oft teuer und nicht flexibel genug.

**OpenFloorball bietet:**

- **💰 Kostenlose Nutzung** – Keine Lizenzgebuhren, keine versteckten Kosten
- **🔓 Open Source** – Vollstandig einsehbar, anpassbar und langfristig sicher
- **🏠 Self-Hosted** – Du behaltst die Kontrolle uber deine Daten (DSGVO-konform)
- **🎯 IFF-konform** – Entspricht den offiziellen Floorball-Standards
- **🚀 Modern & intuitiv** – Entwickelt mit aktuellen Webtechnologien fur optimale Bedienbarkeit
- **🔄 Dauerhaft verfugbar** – Keine Abhangigkeit von kommerziellen Anbietern

---

## 👥 Fur wen eignet sich OpenFloorball?

| Zielgruppe | Nutzen |
|------------|--------|
| **🏑 Floorball-Vereine** | Zentrale Plattform fur alle Trainer, konsistente Taktikdarstellung |
| **👨‍🏫 Trainerinnen & Trainer** | Intuitive Spielzugplanung, einfache Visualisierung |
| **👥 Mannschaften** | Gemeinsame Taktikentwicklung, klare Kommunikation |
| **🧒 Jugendtrainer** | Anschauliche Darstellung fur junge Spieler |
| **🎓 Ausbilder** | Professionelles Tool fur Schulungen und Trainings |
| **💻 Entwickler** | Mitwirken an einem sinnvollen Open-Source-Projekt |

---

## ✨ Features

### 🎯 Taktikplanung

- **Interaktives 2D-Spielfeld** – IFF-konforme Darstellung
- **Spieler positionieren** – Intuitives Verschieben per Drag & Drop
- **Spielzuge erstellen** – Formationen und Bewegungsablaufe planen
- **Taktiken speichern** – Wiederverwendbare Vorlagen anlegen

### 🎬 Animation & Export

- **Frame-by-Frame-Animation** – Schrittweise Bewegungsablaufe darstellen
- **Export-Optionen** – Spielzuge als GIF, MP4 oder per Link teilen
- **Prasentationsmodus** – Taktiken im Training oder Meeting zeigen

### 🛠️ Technik

- **Docker-basiert** – Einfache Installation und Wartung
- **Progressive Web App (PWA)** – Plattformunabhangig nutzbar
- **Barrierefreiheit** – Accessibility-Features integriert
- **DSGVO-konform** – Self-Hosting fur maximale Datenschutzkontrolle

---

## 📸 Screenshots

> **Hinweis:** Screenshots werden in Kurze erganzt. Besuche die [Demo](#) oder installiere OpenFloorball lokal, um die Oberflache selbst zu erkunden.

---

## 🚀 Installation

### Voraussetzungen

- Docker & Docker Compose
- Ein Server oder lokaler Rechner zum Hosten

### Schnellstart mit Docker

1. **Repository klonen:**

```bash
git clone https://github.com/freddykrueger88/OpenFloorball.git
cd OpenFloorball
```

2. **Umgebungsvariablen konfigurieren:**

```bash
cp .env.example .env
```

Passe die Werte in der `.env`-Datei an deine Bedurfnisse an.

3. **Container starten:**

```bash
docker compose up -d
```

4. **OpenFloorball im Browser offnen:**

```
http://localhost:3000
```

### Option: TLS/SSL fur produktiven Einsatz

Fur eine verschlusselte Verbindung (HTTPS) nutze zusatzlich:

```bash
docker compose -f docker-compose.yml -f docker-compose.tls.yml up -d
```

---

## 📖 Erste Schritte

Nach der Installation:

1. **Zugang erstellen** – Erstelle dein erstes Benutzerkonto
2. **Spielfeld erkunden** – Mache dich mit der Oberflache vertraut
3. **Ersten Spielzug erstellen** – Spieler positionieren und speichern
4. **Animation ausprobieren** – Bewegungsablaufe frame-by-frame hinzufugen
5. **Exportieren & teilen** – Spielzug als GIF, MP4 oder Link teilen

---

## 🎮 Verwendung

### Spielzug erstellen

1. Offne das virtuelle Spielfeld
2. Platziere Spieler per Drag & Drop
3. Fuge Bewegungsrichtungen hinzu
4. Speichere den Spielzug

### Animation erstellen

1. Wahle einen gespeicherten Spielzug
2. Fuge Frames hinzu
3. Annotiere Bewegungen
4. Vorschau und Export

### Taktiken teilen

- **Export als GIF** – Fur Prasentationen oder Social Media
- **Export als MP4** – Fur Videoschnitt oder Schulungen
- **Link teilen** – Direkter Zugriff fur Teammitglieder

---

## 📁 Projektstruktur

```
OpenFloorball/
├── backend/                 # Node.js-Backend (API, Datenbank)
│   ├── src/                 # Quellcode
│   ├── Dockerfile           # Backend-Container
│   ├── package.json         # Dependencies
│   └── jest.config.js       # Testkonfiguration
├── frontend/                # React-Frontend (PWA)
│   ├── src/                 # Quellcode
│   ├── Dockerfile           # Frontend-Container
│   ├── package.json         # Dependencies
│   └── vite.config.js       # Build-Konfiguration
├── docs/                    # Dokumentation
├── .env.example             # Beispiel-Umgebungsvariablen
├── docker-compose.yml       # Haupt-Docker-Konfiguration
├── docker-compose.tls.yml   # TLS/SSL-Erweiterung
├── Caddyfile                # Caddy-Server-Konfiguration
├── LICENSE                  # Lizenzdatei
├── README.md                # Diese Datei
├── CHANGELOG.md             # Versionshistorie
├── CONTRIBUTING.md          # Beitrage-Regeln
├── CODE_OF_CONDUCT.md       # Verhaltenskodex
└── SECURITY.md              # Sicherheitsrichtlinien
```

---

## 🛠️ Technischer Stack

| Bereich | Technologie |
|---------|-------------|
| **Frontend** | React, Vite, PWA |
| **Backend** | Node.js |
| **Datenbank** | PostgreSQL |
| **Container** | Docker, Docker Compose |
| **Webserver** | Caddy (automatisches HTTPS) |
| **Testing** | Jest |
| **Code Quality** | ESLint |

---

## 👨‍💻 Entwicklung

### Lokale Entwicklungsumgebung

1. **Repository klonen:**

```bash
git clone https://github.com/freddykrueger88/OpenFloorball.git
cd OpenFloorball
```

2. **Frontend einrichten:**

```bash
cd frontend
npm install
npm run dev
```

3. **Backend einrichten:**

```bash
cd backend
npm install
npm run dev
```

4. **Datenbank starten:**

```bash
docker compose up -d postgres
```

### Tests ausfuhren

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🗺️ Roadmap

> **Hinweis:** Die Roadmap wird laufend aktualisiert. Aktuelle Plane findest du in den [GitHub Issues](https://github.com/freddykrueger88/OpenFloorball/issues).

Geplante Features:

- [ ] Erweiterte Export-Optionen
- [ ] Team-Management-Funktionen
- [ ] Vorlagen-Bibliothek fur haufige Spielzuge
- [ ] Mobile Optimierung
- [ ] Mehrsprachigkeit
- [ ] API fur Integrationen

---

## 🤝 Mitwirken

Beitrage sind herzlich willkommen! Lies dir bitte zuerst die [CONTRIBUTING.md](https://github.com/freddykrueger88/OpenFloorball/blob/main/CONTRIBUTING.md) durch.

### Wie du beitragen kannst:

- **💡 Ideen vorschlagen** – Erstelle ein Issue mit deinem Vorschlag
- **🐛 Fehler melden** – Beschreibe Bugs detailliert
- **📝 Dokumentation verbessern** – Hilfe bei Texten ist immer wertvoll
- **💻 Code beitragen** – Sende einen Pull Request
- **🌍 Übersetzungen** – Mache OpenFloorball mehrsprachig

### Verhaltenskodex

Wir bitten alle Beteiligten, unseren [Code of Conduct](https://github.com/freddykrueger88/OpenFloorball/blob/main/CODE_OF_CONDUCT.md) zu beachten.

---

## 📄 Lizenz

OpenFloorball steht unter einer Open-Source-Lizenz. Details findest du in der [LICENSE](https://github.com/freddykrueger88/OpenFloorball/blob/main/LICENSE).

---

## 📬 Kontakt

- **GitHub:** [freddykrueger88/OpenFloorball](https://github.com/freddykrueger88/OpenFloorball)
- **Issues:** [Fehler melden oder Features vorschlagen](https://github.com/freddykrueger88/OpenFloorball/issues)
- **Sicherheit:** [SECURITY.md](https://github.com/freddykrueger88/OpenFloorball/blob/main/SECURITY.md)

---

<p align="center">
  <strong>Mit ❤️ fur die Floorball-Community entwickelt</strong><br>
  <em>OpenFloorball – Weil Taktik mehr als nur Kreide an der Tafel ist.</em>
</p>

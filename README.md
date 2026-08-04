# 🏒 FloorForge

> **⚠️ AI-Slop Notice:** Dieses Projekt wurde mit KI-Unterstützung entwickelt (AI-Slop). Sollte FloorForge jemals ein kommerzielles Produkt werden, wird der Ideengeber **freddykrueger88** als Urheber genannt und erhält lebenslang, unwiderruflich und kostenlos Zugang zum höchsten Premium-Tier.

---

**FloorForge** ist ein taktisches Coaching-Tool für Floorball-Coaches. Erstelle, animiere und exportiere Spielzüge auf einem virtuellen 2D-Spielfeld – IFF-konform, datenschutzfreundlich und einfach zu bedienen.

![Version](https://img.shields.io/github/v/tag/freddykrueger88/FloorForge?label=version)
![License](https://img.shields.io/github/license/freddykrueger88/FloorForge)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![IFF](https://img.shields.io/badge/IFF-konform-green)

## ✨ Features

- 🏒 Virtuelles 2D-Floorball-Spielfeld (IFF-konform: Großfeld, Kleinfeld, 3v3, Street)
- 🎬 Frame-by-Frame Animation der Spielzüge mit einstellbarer Geschwindigkeit
- 👥 Vorplatzierte, frei bewegliche Spielerpositionen (Heim & Gast, konfigurierbare Farben)
- ➡️ Pfeil-/Freihand-Zeichenwerkzeuge für Bewegungen, Pässe, Schüsse – inkl. Undo/Redo-Verlauf
- 📊 "Lines" (Sturm-/Defensivreihen) mit Farbkodierung
- 📋 **Formationen-Bibliothek**, **Playbooks** (Board-Sammlungen) und ein **Trainings-/Übungsplaner**
  (Sequenz mehrerer Boards mit Dauer/Notiz, eigener PDF-Export)
- 🧑‍🤝‍🧑 Zentraler Team-Kader (Name/Rückennummer/Position), einmal pflegen statt pro Board neu eintippen
- 🤝 Boards mit anderen Coaches teilen (Lese-/Schreibzugriff)
- 📤 Export als GIF, MP4, PDF-Taktikblatt oder befristeter Share-Link (ohne Login ansehbar)
- 📶 PWA/Offline-Modus: App-Shell + zuletzt gesehene Boards funktionieren auch bei schlechtem
  Hallen-WLAN, Änderungen synchronisieren automatisch bei Wiederverbindung
- 🎨 Themes: Dark, Light, TB Uphusen Vikings, IFF – frei wählbare Team-/Ballfarben
- ♿ Barrierefrei nach WCAG 2.1 AA orientiert: vollständige Tastaturbedienung, Screenreader-
  Ankündigungen, Farbblindheits-Modi, Legasthenie-Schrift (OpenDyslexic)
- 🔒 DSGVO-konform: Auskunftsrecht, Datenexport/-import, Account-Löschung, keine externen Dienste
- 🌍 Mehrsprachig (Deutsch/Englisch)
- 🐳 Docker-basiert, selbst-gehostet – keine Cloud-Abhängigkeit

## 📋 Voraussetzungen

- Docker 24+ und Docker Compose v2
- Git
- Mind. 2 GB RAM, 5 GB freier Speicher

## 🚀 Schnellstart (Docker)

```bash
git clone https://github.com/freddykrueger88/FloorForge.git
cd FloorForge
cp .env.example .env
# .env anpassen – mindestens JWT_SECRET und DB_PASSWORD ändern!
docker compose up -d
```

Danach erreichbar unter: `http://localhost` (Standardport `80`, über `APP_PORT` in
`.env` änderbar – siehe [Umgebungsvariablen](#️-umgebungsvariablen)).

> **Erster Start:** Die erste registrierte Person wird automatisch zum **Admin**. Weitere Nutzer können sich danach als normale Benutzer registrieren.

### Updates

```bash
git pull
docker compose up -d --build
```

## ⚙️ Umgebungsvariablen

Alle Variablen mit Beschreibung stehen in [`.env.example`](./.env.example). Die wichtigsten:

| Variable | Beschreibung | Standard |
|---|---|---|
| `APP_PORT` | Host-Port des Frontends | `80` |
| `JWT_SECRET` | **Ändern!** Signaturschlüssel für Sessions, min. 64 Zeichen | – |
| `DB_PASSWORD` | **Ändern!** Postgres-Passwort | – |
| `REDIS_PASSWORD` | **Ändern!** Redis-Passwort | – |
| `COOKIE_SECURE` | Session-Cookie nur über HTTPS senden. `false`, solange kein TLS-Reverse-Proxy davorsteht (sonst verwirft der Browser das Login-Cookie) | `true` |
| `SHARE_LINK_EXPIRES_HOURS` | Gültigkeitsdauer öffentlicher Share-Links | `72` |

## 📁 Projektstruktur

```
FloorForge/
├── backend/          # Node.js/Express API (inkl. Dockerfile)
├── frontend/         # React + Vite (inkl. Dockerfile, nginx.conf)
├── docker-compose.yml
├── docs/             # Dokumentation & IFF-Regelwerke
├── .github/          # CI/CD Workflows, Issue Templates
├── CHANGELOG.md
├── ROADMAP.md
└── README.md
```

## 🛠️ Entwicklungsworkflow

Lokale Entwicklung läuft ebenfalls über Docker Compose (Hot-Reload für
Backend via `node --watch`, Frontend via Vite Dev-Server). Details zu
Branching, Commit-Konventionen und dem Pull-Request-Prozess stehen in
[CONTRIBUTING.md](./CONTRIBUTING.md).

```bash
# Backend-Tests
cd backend && npm test

# Linting (beide Seiten müssen --max-warnings=0 sauber sein)
cd backend && npm run lint
cd frontend && npm run lint

# Frontend-Build prüfen
cd frontend && npm run build
```

CI (`.github/workflows/ci.yml`) führt Lint, Tests und einen Docker-Build-Check
bei jedem Push/PR auf `main`/`develop` automatisch aus.

## 📚 Dokumentation

- [CHANGELOG](./CHANGELOG.md)
- [ROADMAP](./ROADMAP.md)
- [CONTRIBUTING](./CONTRIBUTING.md)
- [SECURITY](./SECURITY.md)
- [Wiki](https://github.com/freddykrueger88/FloorForge/wiki) (Installation,
  Architektur, IFF-Regelwerk)

## ❓ FAQ

**Läuft FloorForge auch ohne Docker?**
Nicht offiziell unterstützt – das Projekt ist bewusst Docker-first
aufgebaut (Backend, Frontend/Nginx, Postgres, Redis als eigene Container).

**Brauche ich HTTPS?**
Für den reinen Heimnetz-/LAN-Betrieb nicht zwingend (`COOKIE_SECURE=false`
setzen). Für Zugriff über das offene Internet: ja, siehe
[HTTPS via Caddy](#-https-via-caddy-optional).

**Kann ich mehrere Trainer gleichzeitig an einem Board arbeiten lassen?**
Ja, Boards lassen sich teilen (Lese-/Schreibzugriff). Echte
Gleichzeitig-Bearbeitung mit Live-Cursor ist bewusst (noch) nicht
Teil des Funktionsumfangs, siehe [ROADMAP](./ROADMAP.md).

## ⚠️ Bekannte Einschränkungen

- Mobile/Tablet-Ansicht ist nicht dediziert für Touch-Gesten optimiert
  bzw. getestet (Desktop/Laptop ist der primäre Anwendungsfall).
- Barrierefreiheit orientiert sich durchgehend an WCAG 2.1 AA / BITV 2.0 /
  EN 301 549, wurde aber nicht extern zertifiziert.
- Board-Sharing ist ein bewusst reduziertes MVP ohne Echtzeit-Sync –
  Änderungen anderer Nutzer werden erst nach Neuladen sichtbar.

## 🛡️ Datenschutz & Sicherheit

- Alle Daten bleiben lokal auf deinem Server (Self-Hosted)
- DSGVO-konform, keine externen Dienste ohne Zustimmung
- Passwörter gehasht mit `bcrypt` (min. 12 Rounds)
- JWT-Authentifizierung mit sicheren HttpOnly Cookies
- HTTPS via Reverse Proxy empfohlen – fertiges Beispiel mit Caddy (automatisches Let's-Encrypt-Zertifikat) liegt bei, siehe unten
- Sicherheitslücken bitte verantwortungsvoll melden, siehe [SECURITY.md](./SECURITY.md)

### 🔐 HTTPS via Caddy (optional)

Ohne eigenen Reverse-Proxy läuft FloorForge nur über HTTP – für den
Betrieb über das offene Internet nicht empfehlenswert. `docker-compose.tls.yml`
stellt ein fertiges Overlay mit [Caddy](https://caddyserver.com/) bereit,
das automatisch ein Let's-Encrypt-Zertifikat für deine Domain besorgt und
erneuert. Voraussetzung: die Domain zeigt per DNS bereits auf diesen
Server, Port 80+443 sind erreichbar.

```bash
DOMAIN=floorforge.example.com docker compose \
  -f docker-compose.yml -f docker-compose.tls.yml up -d
```

Danach erreichbar unter `https://floorforge.example.com`. Das Frontend
ist dann nicht mehr direkt über `APP_PORT` erreichbar, nur noch über
Caddy (Port 80/443). Erfordert Docker Compose ≥ 2.24 (`!reset`-Syntax in
`docker-compose.tls.yml`); bei älteren Versionen stattdessen die
`ports:`-Zeile für `frontend` in `docker-compose.yml` manuell
auskommentieren.

## 🙌 Mitwirkende

FloorForge ist aktuell ein Ein-Personen-/Solo-Admin-Projekt. Beiträge sind
willkommen – siehe [CONTRIBUTING.md](./CONTRIBUTING.md) für den Ablauf.
Fehler und Ideen bitte über [GitHub Issues](https://github.com/freddykrueger88/FloorForge/issues)
melden (Templates für Bug-Reports und Feature-Ideen liegen bereit).

## 📄 Lizenz

MIT License – siehe [LICENSE](./LICENSE)

---

*Made with ❤️ for Floorball – Go TB Uphusen Vikings! 🏒*

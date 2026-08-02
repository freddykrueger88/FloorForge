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
- 🎬 Frame-by-Frame Animation der Spielzüge
- 👥 Vorplatzierte Spielerpositionen (Heim & Gast, verschiedene Farben)
- ➡️ Pfeil-basiertes Zeichnen von Bewegungen und Pässen
- 📤 Export als GIF, Link (MP4 & weitere folgen)
- 📊 Verschiedene "Lines" (Sturmreihen, Defensivreihen) mit Farbkodierung
- 🎨 Themes: Dark, Light, TB Uphusen Vikings, IFF
- ♿ Vollständig barrierefrei (WCAG 2.1 AA, BITV, EN 301 549)
- 🔒 DSGVO-konform, keine externen Dienste
- 🐳 Docker-basiert, selbst-gehostet

## 🚀 Schnellstart (Docker)

```bash
git clone https://github.com/freddykrueger88/FloorForge.git
cd FloorForge
cp .env.example .env
# .env anpassen (SECRET_KEY, DB-Passwort etc.)
docker compose up -d
```

Danach erreichbar unter: `http://localhost:3000`

> **Erster Start:** Die erste registrierte Person wird automatisch zum **Admin**. Weitere Nutzer können sich danach als normale Benutzer registrieren.

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

## 📚 Dokumentation

- [CHANGELOG](./CHANGELOG.md)
- [ROADMAP](./ROADMAP.md)
- [Wiki](https://github.com/freddykrueger88/FloorForge/wiki)

## 🛡️ Datenschutz & Sicherheit

- Alle Daten bleiben lokal auf deinem Server (Self-Hosted)
- DSGVO-konform, keine externen Dienste ohne Zustimmung
- Passwörter gehasht mit `bcrypt` (min. 12 Rounds)
- JWT-Authentifizierung mit sicheren HttpOnly Cookies
- HTTPS via Reverse Proxy empfohlen (z.B. Nginx/Traefik)

## 📄 Lizenz

MIT License – siehe [LICENSE](./LICENSE)

---

*Made with ❤️ for Floorball – Go TB Uphusen Vikings! 🏒*

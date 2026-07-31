# Changelog

Alle nennenswerten Änderungen an FloorForge werden in dieser Datei dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).
Versionierung folgt [Semantic Versioning](https://semver.org/lang/de/).

---

## [Unreleased]

### Added
- Docker Compose Multi-Container Setup (PostgreSQL 16, Redis 7, Backend, Frontend/Nginx)
- Multi-Stage Dockerfiles für Backend und Frontend (Non-root User)
- Health Checks für alle Container
- `.env.example` vollständig dokumentiert
- Authentifizierungssystem: Registrierung, Login, Logout, JWT
- Erster registrierter Benutzer erhält automatisch Admin-Rolle
- JWT in HttpOnly Cookie (SameSite=strict, 7 Tage)
- Redis Token-Blacklist für sicheres Logout
- bcrypt Passwort-Hashing (12 Rounds)
- Rate Limiting auf Auth-Endpoints (10 req/15min)
- Login- und Registrierungs-Seiten (React)
- Auth Guard (PrivateRoute / PublicRoute)
- Axios Interceptor mit automatischem 401-Redirect
- Nginx Reverse Proxy mit API-Proxy

---

## [0.1.0] – Grundstruktur (2026-07-31)

### Added
- Repository-Struktur: Backend (Node.js/Express) + Frontend (React/Vite) getrennt
- Express Server mit Helmet, CORS, Rate Limiting, Morgan
- PostgreSQL Connection Pool (pg)
- Datenbank-Migrationssystem
- Winston Logger (dev: colorized, prod: JSON)
- Einheitliche API Response Helfer (`success`, `created`, `paginated`, `error`)
- JWT Authenticate & requireAdmin Middleware (Grundgerüst)
- React 18 + React Router v6
- Zustand Store: Auth + Theme
- 4 Themes als CSS Custom Properties: dark, light, vikings, iff
- i18next Internationalisierung: Deutsch (primär) + Englisch
- Vite Konfiguration mit Path-Aliases + API-Proxy
- ESLint 9 Flat Config für Backend und Frontend
- GitHub: Issue-Vorlagen, Labels, Milestones, Workflows (CI, Auto-Tag)
- Wiki, Roadmap, CHANGELOG angelegt
- AI-Slop Hinweis in README

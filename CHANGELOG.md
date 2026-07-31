# Changelog

Alle nennenswerten Änderungen an FloorForge werden in dieser Datei dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).
Versionierung folgt [Semantic Versioning](https://semver.org/lang/de/).

---

## [Unreleased]

> Nächste Änderungen kommen hier rein.

---

## [0.1.0] – 2026-08-01

### Added

#### Infrastruktur & DevOps
- Docker Compose Multi-Container Setup (PostgreSQL 16, Redis 7, Backend, Frontend/Nginx)
- Multi-Stage Dockerfiles für Backend und Frontend (Non-root User, minimale Images)
- Health Checks für alle Container mit `depends_on: condition: service_healthy`
- `.env.example` vollständig dokumentiert mit Sicherheitshinweisen
- Nginx Reverse Proxy: API-Proxy, Gzip, Security Headers, SPA-Routing
- GitHub Actions: CI-Workflow (Lint + Test), Auto-Tag bei Push auf `main`
- Issue-Vorlagen, Labels, Milestones eingerichtet

#### Backend (Node.js / Express)
- Express Server mit Helmet (Konva-CSP), CORS, Rate Limiting, Morgan
- Vollständiges Datenbankschema: `users`, `boards`, `frames`, `lines`, `exports`, `settings`
- Migrationssystem in einer Transaktion mit Rollback bei Fehler
- Indizes auf alle häufig abgefragten Felder
- Foreign Keys mit `ON DELETE CASCADE`
- Development-Seed: Demo-Admin + Demo-Board + Demo-Frame + Demo-Line
- PostgreSQL Connection Pool (pg)
- Redis Client mit Reconnect-Strategie
- Winston Logger (dev: colorized, prod: JSON)
- Einheitliche API Response Helfer (`success`, `created`, `paginated`, `error`)
- `package.json` mit allen Dependencies deklariert

#### Authentifizierung
- `POST /api/auth/register` – Erster User = Admin, bcrypt 12 Rounds
- `POST /api/auth/login` – Timing-Safe, JWT HttpOnly Cookie (7 Tage, SameSite=strict)
- `POST /api/auth/logout` – Redis Token-Blacklist, Cookie löschen
- `GET /api/auth/me` – Auth-geschützt
- Rate Limiting auf Auth-Endpoints (10 req/15min)
- Input-Validierung mit express-validator
- `authenticate` + `requireAdmin` Middleware

#### Frontend (React 18 / Vite)
- React Router v6 mit `PrivateRoute` + `PublicRoute`
- Zustand Stores: Auth (`setUser`, `logout`, `fetchMe`) + Theme
- 4 Themes als CSS Custom Properties: `dark`, `light`, `vikings`, `iff`
- i18next Internationalisierung: Deutsch (primär) + Englisch
- Axios Client mit JWT-Interceptor + automatischem 401-Redirect
- Login- und Registrierungs-Seiten (vollständig mit Validierung)
- Vite Konfiguration: Path-Aliases, API-Proxy, Code-Splitting
- `package.json` mit allen Dependencies deklariert

#### Barrierefreiheit & Standards
- Skip-Link, `.sr-only`, `:focus-visible`, `prefers-reduced-motion`
- `role="alert"` für Fehlermeldungen, `aria-describedby` bei Fehlerstate
- Alle Inputs mit `<label>` verknüpft, `autoComplete`-Attribute korrekt
- DSGVO-konform: keine unnötige Datenspeicherung, HttpOnly Cookies

[0.1.0]: https://github.com/freddykrueger88/FloorForge/releases/tag/v0.1.0

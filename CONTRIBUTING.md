# Contributing to FloorForge

Danke für dein Interesse an FloorForge! Diese Datei beschreibt den
Entwicklungsworkflow für Beiträge zum Projekt.

## Lokale Entwicklungsumgebung

FloorForge ist Docker-first aufgebaut – Backend, Frontend, PostgreSQL und
Redis laufen als eigene Container.

```bash
git clone https://github.com/freddykrueger88/FloorForge.git
cd FloorForge
cp .env.example .env
# .env anpassen (JWT_SECRET, DB_PASSWORD, REDIS_PASSWORD)
docker compose up -d
```

Für iterative Frontend-/Backend-Entwicklung ohne Container-Rebuild bei
jeder Änderung können `backend/` und `frontend/` auch direkt mit lokal
installiertem Node.js (siehe `engines` in den jeweiligen `package.json`)
über `npm run dev` gestartet werden – Backend braucht dafür Zugriff auf
eine laufende Postgres-/Redis-Instanz (z. B. via `docker compose up -d db redis`).

## Branching-Strategie

- `main` ist der stabile, deploybare Branch.
- Für Änderungen einen Feature-Branch von `main` abzweigen
  (`feat/kurze-beschreibung`, `fix/kurze-beschreibung`).
- Pull Requests gegen `main`.

## Commit-Konventionen

Commits folgen [Conventional Commits](https://www.conventionalcommits.org/)-artigem
Format, wie in der bisherigen Historie durchgehend verwendet:

```
<typ>(<scope>): <kurze Beschreibung> (#issue-nummer, falls zutreffend)
```

Typen: `feat`, `fix`, `docs`, `chore`, `test`, `ci`, `refactor`.
Scope ist meist das betroffene Modul (`boards`, `field`, `a11y`, `deps`, …).

Beispiele aus der echten Historie:
```
feat(boards): Playbooks – Board-Sammlungen gruppieren (#52)
fix(field): Stürmer in eigener Hälfte bei Anstoß + einstufiges Löschen
chore(deps): Modernisierung Phase 2 – Express 4→5
```

## Coding Guidelines

- **Keine fachliche Logik ohne Notwendigkeit ändern** – ein Bugfix
  braucht kein Refactoring drumherum, ein Feature keine vorsorglichen
  Abstraktionen für hypothetische Zukunftsanforderungen.
- **Datensparsamkeit** (DSGVO Art. 5 Abs. 1c, siehe `CLAUDE.md`): vor
  jedem neuen Feld/Log-Statement/Export kritisch hinterfragen, ob es
  wirklich gebraucht wird. Keine personenbezogenen Daten in Logs, wenn
  eine User-ID zur Nachverfolgung reicht.
- ESLint muss auf beiden Seiten sauber durchlaufen:
  ```bash
  cd backend && npm run lint   # --max-warnings=0
  cd frontend && npm run lint  # --max-warnings=0
  ```
- Neue Backend-Endpunkte brauchen Jest-Tests (siehe
  `backend/src/__tests__/` für bestehende Muster: Owner-Checks,
  Validierung, CRUD-Vollständigkeit).
- Barrierefreiheit bei UI-Änderungen mitdenken: Tastaturbedienbarkeit,
  ARIA-Labels, Screenreader-Ankündigungen (`useAnnounceStore`) – siehe
  bestehende Komponenten als Referenz.

## Tests lokal ausführen

```bash
cd backend
npm test
```

Für Backend-Tests werden eine Postgres- und eine Redis-Instanz benötigt
(Umgebungsvariablen `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`
sowie `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`). Am einfachsten über
zwei Docker-Wegwerfcontainer:

```bash
docker run -d --name ff_test_pg -e POSTGRES_DB=floorforge_test \
  -e POSTGRES_USER=ff -e POSTGRES_PASSWORD=test -p 5432:5432 postgres:18-alpine
docker run -d --name ff_test_redis -p 6379:6379 redis:8-alpine \
  redis-server --requirepass test
```

Danach aufräumen nicht vergessen: `docker rm -f -v ff_test_pg ff_test_redis`
(`-v` ist wichtig, sonst bleiben anonyme Volumes zurück).

## Pull-Request-Prozess

1. Issue verlinken (`Closes #123`), sofern vorhanden.
2. PR-Template ausfüllen (`.github/PULL_REQUEST_TEMPLATE.md` wird
   automatisch vorausgefüllt).
3. CI muss grün sein (Lint + Tests + Docker-Build-Check, siehe
   `.github/workflows/ci.yml`).
4. `CHANGELOG.md` um einen Eintrag unter `[Unreleased]` ergänzen, wenn
   die Änderung für Nutzer sichtbar ist.

## Issues melden

Bug-Reports und Feature-Ideen bitte über die
[Issue-Templates](https://github.com/freddykrueger88/FloorForge/issues/new/choose)
einreichen – die gestellten Fragen helfen, das Anliegen ohne
Rückfrage-Schleife einordnen zu können.

## Sicherheitslücken

Bitte **nicht** als öffentliches Issue melden – siehe [SECURITY.md](./SECURITY.md).

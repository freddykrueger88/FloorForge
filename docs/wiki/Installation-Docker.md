# 🚀 Schnellstart mit Docker

## Voraussetzungen

- Docker 24+ und Docker Compose v2
- Git
- Mind. 2GB RAM, 5GB freier Speicher

## Installation

```bash
# 1. Repository klonen
git clone https://github.com/freddykrueger88/FloorForge.git
cd FloorForge

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
nano .env   # Passe SECRET_KEY und DB-Passwort an!

# 3. Container starten
cd docker
docker compose up -d

# 4. Status prüfen
docker compose ps
docker compose logs -f
```

## Erreichbarkeit

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Erster Start

1. Öffne http://localhost:3000
2. Klicke auf **"Registrieren"**
3. Der erste registrierte Benutzer wird automatisch **Admin**
4. Lege dein erstes Spielfeld an und beginne mit dem Coachen!

## Updates

```bash
git pull
cd docker
docker compose pull
docker compose up -d --build
```

## Wichtige .env Einstellungen

| Variable | Beschreibung | Standard |
|---|---|---|
| `APP_PORT` | Frontend-Port | 3000 |
| `JWT_SECRET` | **Ändern!** Mind. 64 Zeichen | - |
| `DB_PASSWORD` | **Ändern!** Sicheres Passwort | - |
| `SHARE_LINK_EXPIRES_HOURS` | Share-Link Gültigkeit | 72 |

> ⚠️ **Sicherheit:** Ändere `JWT_SECRET` und `DB_PASSWORD` unbedingt vor dem ersten Start!

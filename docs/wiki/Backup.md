# 💾 Backup & Export

## Manueller Export (jeder Nutzer)

Unter `/settings` → Konto: vollständiger Datenexport als ZIP
(`GET /api/user/export`) – enthält alle eigenen Boards, Frames, Lines,
Formationen, Playbooks, Kader, Trainingspläne als JSON. Derselbe Export
lässt sich über `POST /api/user/import` wieder einspielen.

## Automatische Backups (Admin)

Admin-only, konfigurierbar unter "Backup-Zeitplan" (siehe
[Einstellungen](./Einstellungen.md#admin-einstellungen)):

| Option | Werte |
|---|---|
| Zeitplan | täglich (3 Uhr) oder wöchentlich (Sonntag, 3 Uhr) |
| Aufbewahrung | Anzahl Backup-Läufe, die behalten werden (Standard 7) |

Bei jedem Lauf wird für **jeden Nutzer** ein ZIP mit derselben Struktur
wie der manuelle Export erzeugt und unter
`/app/backups/<ISO-Zeitstempel>/<userId>.zip` abgelegt (Docker-Volume
`backups_data`). Ältere Zeitstempel-Verzeichnisse über die konfigurierte
Aufbewahrung hinaus werden automatisch gelöscht (älteste zuerst).

## Datenbank-Backup (vollständig, außerhalb der App)

Die automatischen Backups oben sichern die **Nutzerdaten als JSON**,
nicht das vollständige relationale Postgres-Schema. Für ein komplettes
Datenbank-Backup (z. B. vor einem Major-Upgrade):

```bash
docker exec floorforge_db pg_dump -U floorforge -d floorforge \
  -F custom -f /tmp/backup.dump
docker cp floorforge_db:/tmp/backup.dump ./floorforge-backup.dump
```

Wiederherstellen mit `pg_restore` in eine frische Datenbank – siehe
[PostgreSQL-Dokumentation](https://www.postgresql.org/docs/current/app-pgrestore.html).

# Security Policy

## Unterstützte Versionen

FloorForge befindet sich in aktiver 0.x-Entwicklung. Es gibt aktuell keine
parallel gepflegten älteren Versionslinien – Sicherheitsupdates fließen
ausschließlich in die jeweils neueste Version auf `main`.

| Version | Unterstützt |
|---|---|
| Aktuellste Release-Version (siehe [Releases](https://github.com/freddykrueger88/FloorForge/releases)) | ✅ |
| Ältere Versionen | ❌ |

Da FloorForge self-hosted betrieben wird, liegt die Aktualisierung in der
Verantwortung der jeweiligen Betreiber:in – regelmäßig `git pull` +
`docker compose up -d --build` ausführen (siehe [README](./README.md#updates)).

## Automatisierte Sicherheitsprüfungen

- Wöchentlicher `npm audit --audit-level=high` für Backend und Frontend
  (`.github/workflows/security.yml`, jeden Montag)
- `dependency-review-action` auf jedem Pull Request
  (`.github/workflows/dependency-review.yml`)

## Eine Sicherheitslücke melden

**Bitte keine Sicherheitslücken als öffentliches GitHub Issue melden.**

Bevorzugter Weg: über den GitHub-Security-Tab dieses Repositories
["Report a vulnerability"](https://github.com/freddykrueger88/FloorForge/security/advisories/new)
(private Security Advisory) – so bleibt der Bericht bis zu einem Fix
unter Verschluss.

Bitte in der Meldung angeben:
- Betroffene Komponente (Backend-Route, Frontend-Seite, Docker-Config, …)
- Schritte zur Reproduktion
- Mögliche Auswirkung (z. B. Datenzugriff, Rechteausweitung, DoS)

Als reines Solo-Maintainer-Projekt kann keine feste Reaktionszeit
garantiert werden – ernsthafte Meldungen werden aber priorisiert
behandelt.

## Bekannte Sicherheits-relevante Design-Entscheidungen

- Passwörter werden mit `bcrypt` (min. 12 Runden) gehasht, nie im
  Klartext gespeichert oder geloggt.
- Sessions laufen über HttpOnly-Cookies + JWT; ausgeloggte/gelöschte
  Accounts werden bis zum Token-Ablauf in einer Redis-Blacklist geführt.
- `JWT_SECRET` wird beim Serverstart auf Vorhandensein und Mindestlänge
  geprüft – ein zu kurzer oder fehlender Wert verhindert den Start.
- Datensparsamkeit (DSGVO Art. 5 Abs. 1c): keine personenbezogenen Daten
  in Logs, wo eine User-ID zur Nachverfolgung reicht; Log-Dateien mit
  Größen-/Rotationsgrenze.
- Öffentliche Share-Links laufen automatisch nach konfigurierbarer Frist ab.
- Standardmäßig `COOKIE_SECURE=true` (HTTPS-only Cookies) – für reinen
  HTTP-Betrieb im Heimnetz bewusst deaktivierbar, siehe README.

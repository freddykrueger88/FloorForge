# 🔌 API-Dokumentation

REST-API unter `/api`. Authentifizierung über HttpOnly-Session-Cookie
(JWT), gesetzt durch `POST /api/auth/login` bzw. `/register`. Es gibt
kein separates API-Token-System – die API ist für das eigene Frontend
gedacht, nicht als öffentliche Drittanbieter-Schnittstelle.

Alle Antworten folgen dem Schema `{ success: boolean, data?, message?
}`. Fehlerhafte Eingaben liefern `422` mit Validierungsdetails
(express-validator), fehlende Berechtigung `401`/`404` (bewusst `404`
statt `403` bei fremden Ressourcen, um nicht zu verraten, ob eine
Ressourcen-ID überhaupt existiert).

## Auth

| Methode | Pfad | Beschreibung |
|---|---|---|
| POST | `/api/auth/register` | Registrieren (erster Nutzer = Admin) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (auth.) |
| GET | `/api/auth/me` | Eigenes Profil (auth.) |
| PUT | `/api/auth/name` | Namen ändern (auth.) |
| PUT | `/api/auth/email` | E-Mail ändern (auth.) |
| PUT | `/api/auth/password` | Passwort ändern (auth.) |

## Boards

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/boards` | Eigene + geteilte Boards |
| GET | `/api/boards/:id` | Einzelnes Board |
| POST | `/api/boards` | Board anlegen |
| PUT | `/api/boards/:id` | Board ändern |
| DELETE | `/api/boards/:id` | Board löschen (Owner-only) |
| POST | `/api/boards/:id/share` | Öffentlichen Share-Link erzeugen |

## Frames

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/boards/:id/frames` | Frames eines Boards |
| POST | `/api/boards/:id/frames` | Frame anlegen |
| PUT | `/api/boards/:id/frames/reorder` | Reihenfolge ändern |
| PUT | `/api/boards/:id/frames/:frameId` | Frame ändern |
| DELETE | `/api/boards/:id/frames/:frameId` | Frame löschen |

## Lines

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/boards/:id/lines` | Lines eines Boards |
| POST | `/api/boards/:id/lines` | Line anlegen (max. 10/Board) |
| PUT | `/api/boards/:id/lines/active` | Aktive Line setzen |
| PUT | `/api/boards/:id/lines/:lineId` | Line ändern |
| DELETE | `/api/boards/:id/lines/:lineId` | Line löschen |

## Board-Kollaboratoren

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/boards/:id/collaborators` | Liste (Owner-only) |
| POST | `/api/boards/:id/collaborators` | Hinzufügen per E-Mail, max. 10/Board (Owner-only) |
| PUT | `/api/boards/:id/collaborators/:collaboratorId` | Berechtigung ändern (Owner-only) |
| DELETE | `/api/boards/:id/collaborators/:collaboratorId` | Entfernen (Owner-only) |

## Export

| Methode | Pfad | Beschreibung |
|---|---|---|
| POST | `/api/export/gif` | GIF-Export starten (async) |
| POST | `/api/export/mp4` | MP4-Export starten (async) |
| POST | `/api/export/pdf` | PDF-Export (synchron) |
| GET | `/api/export/status/:id` | Job-Status abfragen |
| GET | `/api/export/download/:id` | Fertige Datei herunterladen |

## Öffentliche Share-Ansicht

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/share/:token` | Board lesen ohne Login (bewusst **nicht** hinter Auth) |

## Settings

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/settings` | Eigene Einstellungen |
| PUT | `/api/settings` | Teilweises Update (merge) |

## User

| Methode | Pfad | Beschreibung |
|---|---|---|
| DELETE | `/api/user/account` | Account löschen |
| GET | `/api/user/data` | Eigene Kontodaten |
| GET | `/api/user/export` | Vollständiger Datenexport (DSGVO) |
| POST | `/api/user/import` | Datenimport |

## Admin

Nur für Nutzer mit Admin-Rolle.

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/admin/users` | Alle Nutzer |
| DELETE | `/api/admin/users/:id` | Nutzer löschen |
| PUT | `/api/admin/users/:id/role` | Rolle ändern |
| GET | `/api/admin/backup-config` | Backup-Zeitplan lesen |
| PUT | `/api/admin/backup-config` | Backup-Zeitplan ändern |

## Formationen

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/formations` | Eigene Vorlagen |
| POST | `/api/formations` | Vorlage speichern (max. 20) |
| DELETE | `/api/formations/:id` | Vorlage löschen |

## Playbooks

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/playbooks` | Eigene Playbooks |
| POST | `/api/playbooks` | Playbook anlegen (max. 15) |
| DELETE | `/api/playbooks/:id` | Playbook löschen |

## Trainingspläne

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/trainings` | Eigene Trainingspläne |
| POST | `/api/trainings` | Trainingsplan anlegen |
| GET | `/api/trainings/:id` | Einzelner Trainingsplan (inkl. Items) |
| PUT | `/api/trainings/:id` | Trainingsplan ändern |
| DELETE | `/api/trainings/:id` | Trainingsplan löschen |
| POST | `/api/trainings/:id/items` | Übung (Board-Referenz) hinzufügen |
| PUT | `/api/trainings/:id/items/reorder` | Reihenfolge ändern |
| PUT | `/api/trainings/:id/items/:itemId` | Übung ändern |
| DELETE | `/api/trainings/:id/items/:itemId` | Übung entfernen |

## Kader (Roster)

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/roster` | Eigener Kader |
| POST | `/api/roster` | Spieler anlegen (max. 40) |
| PUT | `/api/roster/:id` | Spieler ändern |
| DELETE | `/api/roster/:id` | Spieler löschen |

## Fehlercodes

| Code | Bedeutung |
|---|---|
| `400` | Ungültige Anfrage (z. B. Limit erreicht, Selbst-Referenz) |
| `401` | Nicht authentifiziert |
| `404` | Ressource nicht gefunden **oder** kein Zugriff |
| `422` | Validierungsfehler (express-validator) |
| `500` | Interner Serverfehler |

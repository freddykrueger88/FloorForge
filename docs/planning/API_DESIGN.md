# API_DESIGN.md

# OpenFloorball Coach Platform

## API-Architektur und Schnittstellenkonzept

---

# 1. Ziel

Die API verbindet:

* Benutzeroberfläche
* Datenbank
* Authentifizierung
* Synchronisation
* KI-Systeme
* externe Integrationen

---

# 2. Grundprinzipien

Die API folgt:

* klaren Verantwortlichkeiten
* minimal notwendigen Daten
* sicheren Zugriffen
* versionierten Schnittstellen
* offenen Standards

---

# 3. Architektur

Grundmodell:

```text id="8x7p4m"

Frontend

↓

API Layer

↓

Business Logic

↓

Database

```

---

# 4. API-Stil

Bevorzugt:

REST API

mit klarer Versionierung.

Beispiel:

```text id="6w3m9q"
/api/v1/tactics
```

---

# 5. Versionierung

Keine unkontrollierten Änderungen.

Beispiel:

```text id="3p5r7k"

v1

v2

```

---

# 6. Authentifizierung

Die API benötigt sichere Identifikation.

Unterstützen:

* Login
* Session Management
* Token-basierte Zugriffe

---

# 7. Autorisierung

Authentifizierung bedeutet:

Wer bist du?

Autorisierung bedeutet:

Was darfst du?

---

Jeder Zugriff prüft:

* Benutzer
* Rolle
* Besitz
* Freigaben

---

# 8. Nutzer API

Beispiele:

```text id="7n4c2s"

GET /users/me

PATCH /users/me

DELETE /users/me

```

---

# 9. Verein API

Beispiele:

```text id="2v8m6k"

GET /clubs

POST /clubs

GET /clubs/{id}

```

---

# 10. Team API

Beispiele:

```text id="5z9q1a"

GET /teams

POST /teams

PATCH /teams/{id}

```

---

# 11. Spieler API

Beispiele:

```text id="1h7p4s"

GET /players

POST /players

PATCH /players/{id}

```

---

# 12. Taktik API

Zentrale Schnittstelle.

---

Beispiele:

```text id="9q5m3d"

GET /tactics

POST /tactics

GET /tactics/{id}

PATCH /tactics/{id}

DELETE /tactics/{id}

```

---

# 13. Szenen API

Beispiele:

```text id="4r8n2w"

GET /tactics/{id}/scenes

POST /scenes

PATCH /scenes/{id}

```

---

# 14. Training API

Beispiele:

```text id="8m1k5y"

GET /trainings

POST /trainings

PATCH /trainings/{id}

```

---

# 15. Bibliothek API

Für Wissen:

```text id="6x3p8v"

GET /library

POST /library/items

SEARCH /library

```

---

# 16. Suche

Die Suche muss unterstützen:

* Titel
* Tags
* Kategorien
* Inhalte

---

Später:

Semantische Suche mit KI.

---

# 17. Export API

Grundprinzip:

Der Nutzer kann seine Daten mitnehmen.

---

Beispiele:

```text id="0y6s3a"

GET /export/tactics

GET /export/all

```

---

# 18. Import API

Unterstützen:

* JSON Import
* Validierung
* Versionserkennung

---

Ablauf:

```text id="9v2d7m"

Datei

↓

Validierung

↓

Vorschau

↓

Import

```

---

# 19. Offline Synchronisation

Die API muss Offline-Nutzung ermöglichen.

---

Prinzip:

Local First.

---

Beispiel:

```text id="4k8m1q"

Lokale Änderung

↓

Synchronisation

↓

Server

```

---

# 20. Konfliktlösung

Konflikte müssen sichtbar sein.

Nicht:

automatisch überschreiben.

---

Beispiel:

"Diese Taktik wurde an zwei Orten geändert."

---

# 21. Datei- und Medien API

Für:

* Bilder
* Videos
* Dokumente

---

Regeln:

* Größenbegrenzung
* Zugriffskontrolle
* Löschbarkeit

---

# 22. KI API

KI-Zugriff läuft über eine eigene Schicht.

Nicht:

Frontend direkt zu KI-Anbieter.

---

Modell:

```text id="7r4p8x"

App

↓

AI Gateway

↓

Model Provider

```

---

# 23. KI-Anfrage

Eine KI-Anfrage enthält:

* Zweck
* benötigten Kontext
* Berechtigung

---

Nicht automatisch:

gesamte Datenbank senden.

---

# 24. Fehlerbehandlung

API-Fehler müssen verständlich sein.

Beispiel:

```json id="2k6n9p"
{
"error":"permission_denied",
"message":"Keine Berechtigung für diese Taktik."
}
```

---

# 25. Validierung

Alle Eingaben prüfen:

* Format
* Größe
* Berechtigung
* Vollständigkeit

---

# 26. Sicherheit

API schützt gegen:

* unberechtigte Zugriffe
* Manipulation
* Missbrauch
* Datenlecks

---

# 27. Rate Limits

Schützen vor:

* Überlastung
* automatisiertem Missbrauch

---

# 28. Dokumentation

API benötigt:

* OpenAPI Dokumentation
* Beispiele
* Änderungsverlauf

---

# 29. Testanforderungen

Jede API benötigt:

* Unit Tests
* Integration Tests
* Sicherheitsprüfung

---

# 30. Claude-Code-Regeln

Vor jeder API-Erweiterung prüfen:

1. Braucht die Funktion wirklich eine Schnittstelle?
2. Welche Daten werden übertragen?
3. Sind Rechte geprüft?
4. Ist die Schnittstelle versionierbar?
5. Ist sie dokumentiert?

---

# 31. Leitgedanke

Eine gute API ist nicht die, die alles ermöglicht.

Eine gute API ermöglicht genau das Richtige – sicher und verständlich.

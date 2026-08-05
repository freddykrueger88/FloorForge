# REPOSITORY_STRUCTURE.md

# OpenFloorball Coach Platform

## Empfohlene Projektstruktur

---

# 1. Grundprinzip

Die Repository-Struktur trennt:

* Anwendungscode
* Dokumentation
* Tests
* Daten
* Infrastruktur
* Entwicklungswerkzeuge

---

# 2. Hauptstruktur

```text
OpenFloorball/

├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
│
├── docs/
│
├── apps/
│
├── packages/
│
├── database/
│
├── tests/
│
├── examples/
│
├── infrastructure/
│
├── scripts/
│
└── .github/
```

---

# 3. Hauptdateien

---

## README.md

Die Einstiegseite.

Enthält:

* Projektbeschreibung
* Ziele
* Installation
* Screenshots
* Entwicklungsstatus

---

## LICENSE

Definiert:

* Nutzungsrechte
* Weitergabe
* Beiträge

---

## CONTRIBUTING.md

Beschreibt:

* Beiträge
* Pull Requests
* Entwicklungsablauf

---

## SECURITY.md

Beschreibt:

* Sicherheitsmeldungen
* verantwortungsvolle Offenlegung

---

## CHANGELOG.md

Dokumentiert:

* Versionen
* Änderungen
* Verbesserungen

---

# 4. Dokumentation

Ordner:

```text
docs/
```

Struktur:

```text
docs/

├── vision/

├── architecture/

├── security/

├── privacy/

├── floorball/

├── ai/

├── ux/

├── mobile/

├── development/

└── roadmap/
```

---

# 5. Anwendungen

Ordner:

```text
apps/
```

Beispiel:

```text
apps/

├── web/

├── mobile/

└── api/

```

---

# 6. Web-Anwendung

Beispiel:

```text
apps/web/

├── components/

├── pages/

├── features/

├── hooks/

├── styles/

└── tests/

```

---

# 7. API

Beispiel:

```text
apps/api/

├── routes/

├── services/

├── middleware/

├── models/

└── tests/

```

---

# 8. Gemeinsame Pakete

Ordner:

```text
packages/
```

Für wiederverwendbare Bestandteile.

Beispiele:

```text
packages/

├── tactical-engine/

├── floorball-model/

├── ui-components/

└── shared-types/

```

---

# 9. Taktik-Engine

Besonders wichtig.

Enthält:

* Spielfeldlogik
* Objekte
* Bewegungen
* Animationen

---

# 10. Datenbank

Ordner:

```text
database/
```

Enthält:

```text
database/

├── migrations/

├── schemas/

├── seeds/

└── backups/

```

---

# 11. Tests

Ordner:

```text
tests/
```

Struktur:

```text
tests/

├── unit/

├── integration/

├── e2e/

└── performance/

```

---

# 12. Beispieldaten

Ordner:

```text
examples/
```

Enthält:

* Demo-Verein
* Demo-Taktiken
* Demo-Trainings
* Testdaten

---

# 13. Infrastruktur

Ordner:

```text
infrastructure/
```

Enthält:

```text
infrastructure/

├── docker/

├── deployment/

├── monitoring/

└── backup/

```

---

# 14. Scripts

Ordner:

```text
scripts/
```

Für:

* Installation
* Entwicklung
* Migration
* Tests

---

# 15. GitHub-Konfiguration

Ordner:

```text
.github/
```

Enthält:

```text
.github/

├── workflows/

├── ISSUE_TEMPLATE/

└── PULL_REQUEST_TEMPLATE.md

```

---

# 16. Continuous Integration

Automatische Prüfungen:

Bei jedem Pull Request:

```text
Code

↓

Lint

↓

Tests

↓

Security Check

↓

Build

```

---

# 17. Entwicklungsumgebung

Neue Entwickler sollten können:

```text
Repository klonen

↓

Abhängigkeiten installieren

↓

Startbefehl ausführen

↓

Projekt läuft

```

---

# 18. Claude-Code-Einstieg

Die wichtigsten Dateien für Claude Code:

Priorität:

```text
1. CLAUDE_CODE_MASTER_PROMPT.md

2. CLAUDE_CODE_RULES.md

3. README.md

4. docs/

5. Tests

```

---

# 19. Namenskonventionen

Dateien:

* klar
* beschreibend
* konsistent

Beispiele:

Gut:

```
tactic-editor.ts
sync-service.ts
training-plan.ts
```

Schlecht:

```
helper2.ts
newfile.ts
test-old.ts
```

---

# 20. Keine geheimen Daten

Nicht speichern:

* Passwörter
* API-Schlüssel
* private Nutzerdaten

---

# 21. Beispiel `.gitignore`

Ausschließen:

* lokale Konfiguration
* Build-Dateien
* Abhängigkeiten
* temporäre Daten

---

# 22. Wachstum

Die Struktur muss erlauben:

Heute:

Taktikboard

↓

Morgen:

Trainingsplattform

↓

Später:

Floorball-Wissenssystem

---

# 23. Claude-Code-Regel

Bevor neue Dateien erstellt werden:

Prüfen:

* Gibt es bereits einen passenden Ort?
* Ist die Struktur verständlich?
* Wird die Dokumentation ergänzt?

---

# 24. Leitgedanke

Eine gute Repository-Struktur ist wie eine gute Taktik:

Jeder Bereich hat eine Aufgabe und alle Bereiche arbeiten zusammen.

# GITHUB_SETUP.md

# OpenFloorball Coach Platform

## Repository-, Entwicklungs- und Community-Struktur

---

# 1. Ziel

Das Repository soll nicht nur Code speichern.

Es soll der zentrale Ort sein für:

* Entwicklung
* Dokumentation
* Diskussion
* Planung
* Zusammenarbeit

---

# 2. Repository-Struktur

Empfohlene Struktur:

```text id="8a2r7m"
openfloorball-coach/

├── app/
│
├── components/
│
├── features/
│
├── domain/
│
├── services/
│
├── database/
│
├── tests/
│
├── docs/
│
├── architecture/
│
├── scripts/
│
├── infrastructure/
│
├── examples/
│
├── README.md
│
├── LICENSE
│
├── CONTRIBUTING.md
│
└── SECURITY.md
```

---

# 3. Branch-Strategie

## Hauptbranch

```text id="m5t8lq"
main
```

Enthält:

* stabile Versionen
* veröffentlichbare Software

---

## Entwicklungsbranch

```text id="i7q0sa"
develop
```

Für:

* neue Funktionen
* Integration

---

## Feature Branches

Format:

```text id="4n6jql"
feature/name
```

Beispiele:

```text
feature/tactic-board
feature/player-system
feature/export-json
```

---

## Bugfix Branches

Format:

```text id="0mk9pn"
fix/problem
```

Beispiel:

```text
fix/save-error
```

---

# 4. Commit-Regeln

Commits sollen:

* klein
* verständlich
* nachvollziehbar

sein.

---

Format:

```text id="t4u5ax"
type: kurze Beschreibung
```

---

Beispiele:

```text
feat: add player movement

fix: repair tactic saving

docs: update architecture notes

test: add animation tests
```

---

# 5. Issue-System

Jede Arbeit wird als Issue dokumentiert.

---

# Issue-Typen

## Feature

Neue Funktion.

Label:

```text
feature
```

---

## Bug

Fehler.

Label:

```text
bug
```

---

## Verbesserung

Bestehende Funktion verbessern.

Label:

```text
enhancement
```

---

## Dokumentation

Label:

```text
documentation
```

---

## Sicherheit

Label:

```text
security
```

---

# 6. Prioritäten

Labels:

```text
priority-critical

priority-high

priority-medium

priority-low
```

---

# 7. Fachbereiche

Labels:

```text
area-frontend

area-backend

area-database

area-ux

area-floorball

area-ai

area-privacy
```

---

# 8. Issue-Vorlage

Jede Aufgabe enthält:

```text id="f6o7z3"
## Problem

Was soll gelöst werden?

## Ziel

Was soll erreicht werden?

## Lösungsidee

Wie könnte es funktionieren?

## Akzeptanzkriterien

Wann ist es fertig?

## Datenschutzprüfung

Welche Daten sind betroffen?
```

---

# 9. Milestones

## Milestone 0.1

Grundsystem

Enthält:

* Projektsetup
* Designsystem
* erste Anwendung

---

## Milestone 0.2

Taktikboard

Enthält:

* Feld
* Spieler
* Bewegungen

---

## Milestone 0.3

Speicherung

Enthält:

* Datenmodell
* Export
* Import

---

## Milestone 1.0

Erste produktive Version.

Enthält:

* stabile Nutzung
* Dokumentation
* Tests

---

# 10. Pull Request Regeln

Jeder Pull Request benötigt:

## Beschreibung

Was wurde geändert?

---

## Motivation

Warum wurde es geändert?

---

## Tests

Welche Tests wurden ausgeführt?

---

## Screenshots

Bei UI-Änderungen.

---

## Datenschutzprüfung

Falls Daten betroffen sind.

---

# 11. Code Review

Prüfen:

## Funktion

Erfüllt es das Ziel?

---

## Qualität

Ist der Code verständlich?

---

## Sicherheit

Gibt es Risiken?

---

## Datenschutz

Werden Daten unnötig verarbeitet?

---

## Wartbarkeit

Ist die Lösung langfristig sinnvoll?

---

# 12. Automatisierte Checks

Jeder Pull Request führt aus:

* Build
* Tests
* Linting
* Security Checks

---

# 13. Releases

Versionierung:

Semantic Versioning

Beispiel:

```text
v1.0.0
```

---

Release enthält:

* Änderungen
* bekannte Probleme
* Migrationen
* Sicherheitsinformationen

---

# 14. Dokumentationspflicht

Neue Funktionen benötigen:

* technische Dokumentation
* Nutzerbeschreibung
* Architekturentscheidung falls relevant

---

# 15. Security Policy

Das Projekt benötigt:

`SECURITY.md`

Inhalt:

* Meldung von Sicherheitsproblemen
* verantwortungsvolle Offenlegung
* Kontaktweg

---

# 16. Contributor Workflow

Neue Entwickler:

1. Repository lesen
2. Dokumentation verstehen
3. Issue auswählen
4. Änderung entwickeln
5. Tests erstellen
6. Pull Request erstellen

---

# 17. Claude-Code-Arbeitsregel

Claude Code erstellt keine großen ungeplanten Änderungen.

Immer:

1. Issue verstehen
2. Plan erstellen
3. kleine Änderung durchführen
4. testen
5. dokumentieren

---

# 18. Leitgedanke

Ein gutes Repository ist nicht nur ein Speicher für Code.

Es ist das Gedächtnis des Projekts.

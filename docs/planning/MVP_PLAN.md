# MVP_PLAN.md

# OpenFloorball Coach Platform

## Minimum Viable Product – Entwicklungsplan

---

# 1. MVP-Ziel

Das erste Ziel ist nicht, die komplette Plattform zu bauen.

Das erste Ziel ist:

> Ein Floorball-Trainer kann innerhalb weniger Minuten eine Taktik digital erstellen, speichern, bearbeiten und erklären.

Wenn dieses Problem hervorragend gelöst ist, wird die Plattform erweitert.

---

# 2. MVP-Fokus

Der MVP konzentriert sich auf drei Kernbereiche:

1. Virtuelles Floorball-Taktikboard
2. Speicherung und Verwaltung von Taktiken
3. Teilen und Wiederverwenden von Inhalten

---

# 3. Nicht Bestandteil des MVP

Diese Funktionen werden bewusst später entwickelt:

* komplexe KI
* Videoanalyse
* Heatmaps
* automatische Spieleranalyse
* soziale Netzwerke
* umfangreiche Statistiken
* komplexe Vereinsverwaltung

Grund:

Der Kernnutzen muss zuerst bewiesen werden.

---

# 4. MVP-Nutzerfluss

Ein Trainer soll diesen Ablauf durchführen können:

```
Anwendung öffnen

↓

Neues Taktikboard erstellen

↓

Floorballfeld auswählen

↓

Spieler platzieren

↓

Bewegungen einzeichnen

↓

Animation abspielen

↓

Taktik speichern

↓

Exportieren oder teilen
```

---

# 5. MVP-Funktionen

---

# 5.1 Spielfeldeditor

## Anforderungen

Unterstützung:

* offizielles Floorballfeld
* Angriffsrichtung
* Zonen
* Mittellinie
* Tore

---

# 5.2 Spielerobjekte

Spieler können:

* hinzugefügt werden
* verschoben werden
* benannt werden
* nummeriert werden

Objekte:

* eigener Spieler
* Gegner
* Torhüter

---

# 5.3 Zeichenwerkzeuge

Unterstützung:

## Bewegung

* Laufwege
* Richtungen
* Geschwindigkeit

---

## Ballaktionen

* Pass
* Schuss
* Ballführung

---

## Markierungen

* Zonen
* Hinweise
* Texte

---

# 5.4 Szenensystem

Eine Taktik besteht aus mehreren Szenen.

Beispiel:

```
Szene 1

Aufstellung


↓

Szene 2

Bewegung


↓

Szene 3

Abschluss
```

---

# 5.5 Animation

Minimal:

* Start
* Pause
* Zurück
* Wiederholen

Später:

* Zeitachsen
* Geschwindigkeit
* mehrere Animationsebenen

---

# 5.6 Speichern

MVP unterstützt:

* lokale Speicherung
* Export
* Import

Format:

JSON

---

# 5.7 Export

Unterstützung:

* PNG
* PDF
* JSON

---

# 6. Technischer MVP-Stack

## Frontend

Empfohlen:

* TypeScript
* React
* Next.js
* Tailwind CSS

---

## Zeichenengine

Mögliche Optionen:

* Konva.js
* Fabric.js
* SVG-basierte Engine

Bewertung:

Wichtig:

* Performance
* Touch-Unterstützung
* Animation
* Export

---

## Backend

Für MVP:

Option A:

Local First ohne Backend

oder

Option B:

leichtes Backend:

* Node.js
* PostgreSQL

---

# 7. MVP-Datenmodell

## Tactic

```json
{
"id": "",
"name": "",
"created": "",
"updated": "",
"scenes": []
}
```

---

## Scene

```json
{
"id": "",
"objects": [],
"duration": 10
}
```

---

## Object

```json
{
"type": "player",
"position": {},
"properties": {}
}
```

---

# 8. Erste Entwicklungsreihenfolge

## Sprint 1

Projektbasis:

* Repository
* Framework
* Designsystem
* Grundstruktur

---

## Sprint 2

Spielfeld:

* Rendering
* Zoom
* Verschieben
* Touch

---

## Sprint 3

Objekte:

* Spieler
* Gegner
* Ball
* Positionierung

---

## Sprint 4

Zeichenwerkzeuge:

* Linien
* Pfeile
* Zonen
* Text

---

## Sprint 5

Szenensystem:

* speichern
* wechseln
* verwalten

---

## Sprint 6

Animation:

* Bewegung
* Timeline-Grundlage

---

## Sprint 7

Export:

* PNG
* PDF
* JSON

---

## Sprint 8

Qualität:

* Tests
* Performance
* Accessibility

---

# 9. Definition of Done

Eine MVP-Funktion ist fertig wenn:

## Funktion

Sie funktioniert vollständig.

---

## Qualität

Sie besitzt:

* Tests
* Dokumentation
* Fehlerbehandlung

---

## Datenschutz

Es wurde geprüft:

* welche Daten gespeichert werden
* warum sie gespeichert werden

---

## UX

Ein Trainer versteht die Funktion ohne Erklärung.

---

# 10. Erste Erfolgsmessung

Der MVP ist erfolgreich wenn:

Ein Trainer kann sagen:

"Ich kann meine Taktik schneller erklären als vorher."

---

# 11. Entwicklerregel

Nicht fragen:

"Welche Technologie können wir verwenden?"

Sondern:

"Welches Trainerproblem lösen wir?"

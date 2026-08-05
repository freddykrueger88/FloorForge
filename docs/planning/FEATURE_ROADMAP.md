# FEATURE_ROADMAP.md

# OpenFloorball Coach Platform

## Produkt-Roadmap und Entwicklungsprioritäten

---

# 1. Produktvision

OpenFloorball Coach entwickelt sich zu einer offenen digitalen Plattform für:

* Floorball-Taktik
* Trainingsplanung
* Trainerwissen
* Zusammenarbeit
* Analyse

---

# 2. Entwicklungsprinzip

Die Reihenfolge folgt:

```text id="p9u2w4"
Nutzen für Trainer

↓

Stabilität

↓

Einfachheit

↓

Erweiterung
```

---

# 3. Produktphasen

---

# Phase 0 – Fundament

## Ziel

Eine stabile technische Basis schaffen.

---

## Funktionen

* Repository
* Architektur
* Designsystem
* Datenschutzgrundlagen
* Testsystem
* Entwicklungsumgebung

---

## Ergebnis

Eine professionelle Plattform-Grundlage.

---

# Version 0.1 – Digitales Taktikboard

## Ziel

Die erste echte Trainerfunktion.

---

## Kernfunktionen

## Spielfeld

Unterstützt:

* Floorballfeld
* Tore
* Linien
* Orientierung

---

## Objekte

Unterstützt:

* eigene Spieler
* Gegner
* Torhüter
* Ball

---

## Interaktionen

Unterstützt:

* verschieben
* platzieren
* löschen
* kopieren

---

## Zeichnen

Unterstützt:

* Laufwege
* Passwege
* Schüsse
* Zonen

---

## Speicherung

Unterstützt:

* lokale Speicherung
* Laden
* einfache Verwaltung

---

# Version 0.2 – Taktische Szenen

## Ziel

Aus einzelnen Zeichnungen werden erklärbare Spielsituationen.

---

## Funktionen

### Szenenverwaltung

Beispiele:

* Spielaufbau
* Pressing
* Powerplay
* Boxplay

---

### Mehrere Schritte

Beispiel:

Szene 1:

Ballgewinn

↓

Szene 2:

Umschalten

↓

Szene 3:

Abschluss

---

### Animation

Unterstützt:

* Bewegung
* Geschwindigkeit
* Pause
* Wiederholung

---

# Version 0.3 – Trainingsplanung

## Ziel

Taktik mit Training verbinden.

---

## Funktionen

Trainings erstellen:

* Ziel
* Dauer
* Organisation
* Ablauf

---

Übungen speichern:

* Beschreibung
* Aufbau
* Coachingpunkte
* Varianten

---

# Version 0.4 – Vereinswissen

## Ziel

OpenFloorball wird zum Wissensspeicher.

---

## Funktionen

Bibliothek:

* Taktiken
* Übungen
* Standardsituationen

---

Suche:

* Kategorien
* Tags
* Altersgruppen

---

# Version 0.5 – Zusammenarbeit

## Ziel

Teams und Trainer verbinden.

---

## Funktionen

* Teams
* Rollen
* Freigaben
* Kommentare

---

Wichtig:

Berechtigungen zuerst sauber entwickeln.

---

# Version 0.6 – Import und Export

## Ziel

Keine Datensperre.

---

Unterstützen:

* JSON Export
* JSON Import
* Backup
* Migration

---

# Version 0.7 – Analyse

## Ziel

Aus Beobachtungen lernen.

---

Funktionen:

* Spielnotizen
* Beobachtungen
* Szenen markieren
* Erkenntnisse speichern

---

Nicht:

Automatische Spielerbewertung.

---

# Version 0.8 – KI-Assistent

## Ziel

Trainer unterstützen.

---

Funktionen:

## Trainingshilfe

Beispiele:

"Erstelle Varianten für Ballgewinntraining."

---

## Taktikhilfe

Beispiele:

"Welche Alternativen gibt es gegen ein tiefes Boxplay?"

---

## Wissenssuche

Beispiele:

"Welche Übungen haben wir zum Umschalten?"

---

KI-Regeln:

* transparent
* überprüfbar
* datensparsam

---

# Version 0.9 – Mobile Nutzung

## Ziel

Einsatz direkt in der Halle.

---

Funktionen:

* Tabletoptimierung
* Offline-Modus
* schnelle Darstellung
* Touch-Bedienung

---

# Version 1.0 – Erste stabile Plattform

## Ziel

Produktiv nutzbar für Vereine.

---

Enthält:

* stabiles Taktikboard
* Trainingsverwaltung
* Wissensbibliothek
* Export
* Rollen
* Datenschutzfunktionen
* Dokumentation

---

# Nach Version 1.0

---

# Erweiterung: Videoanalyse

Mögliche Funktionen:

* Videos markieren
* Spielszenen verknüpfen
* Taktiken daraus erstellen

---

# Erweiterung: Live-Unterstützung

Möglichkeiten:

* Spielbeobachtung
* Notizen
* Bench-Coaching

---

# Erweiterung: Verbandsintegration

Möglichkeiten:

* Trainingsbibliotheken
* Lehrmaterialien
* Ausbildungsinhalte

---

# Erweiterung: Internationale Nutzung

Unterstützung:

* mehrere Sprachen
* verschiedene Floorball-Kulturen
* Verbände

---

# 4. Was bewusst nicht Priorität hat

Nicht zuerst bauen:

* soziale Netzwerke
* öffentliche Spielerprofile
* komplexe Statistiken
* Gamification
* Werbung
* Datenanalyse für Dritte

---

# 5. Feature-Bewertung

Jede neue Idee wird geprüft.

Bewertung:

## Trainerwert

Verbessert es Training oder Coaching?

---

## Einfachheit

Versteht man es sofort?

---

## Datenschutz

Benötigt es unnötige Daten?

---

## Wartbarkeit

Passt es zur Architektur?

---

## Open Source

Kann die Community davon profitieren?

---

# 6. Entwicklungsregel

Eine kleine, perfekt funktionierende Funktion ist besser als zehn unfertige Funktionen.

---

# 7. Leitgedanke

OpenFloorball Coach wächst nicht durch die Anzahl seiner Funktionen.

Es wächst durch den Nutzen für Trainer.

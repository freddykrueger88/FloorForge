# FLOORBALL_DOMAIN.md

# OpenFloorball Coach Platform

## Fachkonzept Floorball / Unihockey

---

# 1. Zweck dieses Dokuments

Dieses Dokument beschreibt die sportfachlichen Grundlagen der Plattform.

Die Software soll die Denkweise von Floorball-Trainern unterstützen.

Technische Entscheidungen müssen die Realität des Sports berücksichtigen.

---

# 2. Sportverständnis

Floorball ist ein schneller Teamsport mit:

* hoher Dynamik
* schnellen Umschaltmomenten
* kleinen Entscheidungsfenstern
* komplexen Raumaufteilungen

Ein gutes Coaching-Werkzeug muss deshalb nicht nur Positionen darstellen.

Es muss Bewegungen, Räume und Entscheidungen abbilden.

---

# 3. Spielfeldmodell

Das System muss ein standardisiertes Floorballfeld abbilden.

Grundelemente:

* Spielfeldgrenzen
* Tore
* Torraum
* Schutzzone
* Mittellinie
* Ecken
* Wechselzonen

---

# 4. Spielerrollen

Ein Spieler ist mehr als eine Position.

Das System unterscheidet:

---

## Torhüter

Aufgaben:

* Raumverteidigung
* Spielaufbau
* Kommunikation
* erste Spieleröffnung

---

## Verteidiger

Aufgaben:

* Aufbau
* Absicherung
* Zweikämpfe
* Passlinien kontrollieren

---

## Center

Aufgaben:

* Verbindung zwischen Linien
* Raumkontrolle
* Umschalten

---

## Stürmer

Aufgaben:

* Druck erzeugen
* Abschlüsse
* Räume öffnen

---

# 5. Formationen

Das System soll Formationen darstellen können.

Beispiele:

## 2-1-2

Klassische offensive Struktur.

Eigenschaften:

* zwei Verteidiger
* zentraler Spieler
* zwei Angreifer

---

## 2-2-1

Ausgewogene Struktur.

Eigenschaften:

* stabile Absicherung
* flexible Offensive

---

## 3-2

Offensive Variante.

Eigenschaften:

* mehr Druck
* Risiko im Umschalten

---

# 6. Spielsituationen

Taktiken sollen Situationen abbilden.

---

## Offensive Situationen

Beispiele:

* Spielaufbau
* Angriffsdrittel
* Ballbesitz
* Chancen kreieren

---

## Defensive Situationen

Beispiele:

* Gegneraufbau
* Ballverlust
* Rückzug
* Verteidigung des Slots

---

## Umschalten

Besonders wichtig.

Situationen:

* Ballgewinn → Angriff
* Ballverlust → Verteidigung

---

# 7. Raumkonzepte

Floorball ist stark raumorientiert.

Das System muss unterstützen:

* Zonen
* Räume
* Korridore
* Passlinien
* Überzahlen

---

# 8. Bewegungsarten

Bewegungen benötigen Fachbedeutung.

---

## Laufweg

Spieler bewegt sich ohne Ball.

---

## Supportbewegung

Spieler bietet Passoption.

---

## Rotation

Spieler tauschen Positionen.

---

## Hinterlaufen

Spieler erzeugt Raum hinter einem Mitspieler.

---

## Schnittbewegung

Spieler läuft in freien Raum.

---

# 9. Ballaktionen

Objekte:

---

## Pass

Eigenschaften:

* Start
* Ziel
* Richtung
* Geschwindigkeit

---

## Schuss

Eigenschaften:

* Position
* Ziel
* Abschlussart

---

## Ballführung

Eigenschaften:

* Raumgewinn
* Gegnerbindung

---

# 10. Defensive Konzepte

Unterstützte Konzepte:

---

## Mannorientiert

Spieler verteidigen direkte Gegenspieler.

---

## Raumorientiert

Spieler kontrollieren Räume.

---

## Hybrid

Kombination aus beidem.

---

# 11. Pressing

Pressing ist ein wichtiger Analysebereich.

Das System kann darstellen:

* Auslöser
* Pressingzone
* Laufwege
* Unterstützer

---

Beispiele:

## Hohes Pressing

Ziel:

Früher Ballgewinn.

---

## Mittleres Pressing

Ziel:

Gegner kontrollieren.

---

## Tiefes Verteidigen

Ziel:

Räume schließen.

---

# 12. Powerplay

Spezielle Spielsituation.

Standard:

5 gegen 4

oder

6 gegen 5

---

Das System benötigt:

* Überzahlformation
* Passwege
* Rotationen
* Abschlussoptionen

---

Beispiele:

## 2-2 Formation

## 3-1 Formation

## Diamant

---

# 13. Boxplay

Unterzahlspiel.

Darstellung:

* Blockformation
* Verschieben
* Passwege schließen

---

# 14. Standardsituationen

Unterstützen:

* Freischläge
* Bullys
* Ecken
* Auslösungen

---

# 15. Torhüterspiel

Eigene Kategorie.

Mögliche Inhalte:

* Stellungsspiel
* Auswurf
* Kommunikation
* Überzahlspiel

---

# 16. Nachwuchstraining

Besondere Anforderungen.

Die Plattform soll Altersgruppen berücksichtigen.

Beispiele:

## Anfänger

Fokus:

* Technik
* Spielverständnis
* Spaß

---

## Jugend

Fokus:

* Entscheidungen
* Taktik
* Entwicklung

---

## Erwachsene

Fokus:

* System
* Leistung
* Analyse

---

# 17. Trainingsmethodik

Eine Übung sollte speichern können:

* Ziel
* Organisation
* Ablauf
* Coachingpunkte
* Variationen

---

# 18. Coachingpunkte

Trainerwissen ist oft textbasiert.

Unterstützung:

* Hinweise
* Schlüsselwörter
* Beobachtungspunkte

Beispiele:

"Erster Kontakt nach vorne."

"Kopf hoch vor Ballannahme."

"Nach Pass sofort neu anbieten."

---

# 19. Analyseprinzip

Analyse soll Fragen beantworten:

Nicht:

"Wie viele Daten haben wir?"

Sondern:

"Was können wir verbessern?"

---

# 20. Datenmodell-Erweiterungen

Mögliche zukünftige Objekte:

```text
TacticalPrinciple

GameSituation

CoachingPoint

PlayerRole

TrainingObjective

DrillVariation
```

---

# 21. KI und Floorball-Wissen

KI darf nur auf Grundlage dieses Fachmodells arbeiten.

Sie soll:

* Trainerbegriffe verstehen
* taktische Zusammenhänge erkennen
* passende Vorschläge machen

Sie soll nicht:

* allgemeine Sporttexte kopieren
* falsche Fußballlogik übertragen
* taktische Entscheidungen erzwingen

---

# 22. Fachliche Qualitätsprüfung

Jede neue Funktion prüfen:

1. Passt sie zu Floorball?
2. Versteht ein Trainer den Nutzen?
3. Unterstützt sie echte Spielsituationen?
4. Ist sie einfacher als bestehende Lösungen?

---

# 23. Leitgedanke

OpenFloorball Coach soll nicht einfach ein digitales Whiteboard sein.

Es soll ein digitales Werkzeug für Floorball-Denken werden.

Die Software bildet nicht nur Bewegungen ab.

Sie bewahrt Wissen.

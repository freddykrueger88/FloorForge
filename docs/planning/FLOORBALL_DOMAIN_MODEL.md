# FLOORBALL_DOMAIN_MODEL.md

# OpenFloorball Coach Platform

## Fachmodell für Floorball, Unihockey und Unihoc

---

# 1. Ziel

OpenFloorball Coach soll Floorball verstehen.

Die Software bildet nicht nur Objekte auf einem Spielfeld ab.

Sie bildet ab:

* Spielideen
* taktische Prinzipien
* Trainingslogik
* Coachingwissen

---

# 2. Grundprinzip

Floorball ist ein:

* schneller
* dynamischer
* räumlicher
* entscheidungsorientierter

Mannschaftssport.

Eine gute Software muss deshalb nicht nur Positionen speichern.

Sie muss Beziehungen verstehen.

---

# 3. Sportliche Grundelemente

Eine Spielsituation besteht aus:

```text id="7m4q2p"

Raum

+

Spieler

+

Ball

+

Zeit

+

Entscheidung

+

Ziel

```

---

# 4. Spielfeld

Das Spielfeld enthält:

* Bande
* Tore
* Torraum
* Schusszonen
* Freiräume
* gefährliche Räume

---

# 5. Spielerrollen

Grundrollen:

---

## Torhüter

Aufgaben:

* Torverteidigung
* Spielaufbau
* Kommunikation

---

## Verteidiger

Aufgaben:

* Absicherung
* Spielaufbau
* Zweikämpfe
* Raumkontrolle

---

## Center

Aufgaben:

* Verbindung
* Spielsteuerung
* Umschalten

---

## Flügelspieler

Aufgaben:

* Breite geben
* Abschlüsse
* Pressing

---

# 6. Position ist nicht Rolle

Wichtig:

Ein Spieler steht nicht nur an einem Punkt.

Eine Position bedeutet:

* aktueller Raum
* Aufgabe
* Entscheidungsmöglichkeit

---

# 7. Grundprinzipien Offensive

---

## Breite

Ziel:

Räume öffnen.

---

## Tiefe

Ziel:

Verteidigung auseinanderziehen.

---

## Dreiecke

Ziel:

Mehrere Passoptionen erzeugen.

---

## Bewegung ohne Ball

Ziel:

Räume schaffen.

---

# 8. Grundprinzipien Defensive

---

## Innenraum schützen

Ziel:

Gefährliche Abschlüsse verhindern.

---

## Kommunikation

Ziel:

Gemeinsames Verhalten.

---

## Übergeben und Übernehmen

Ziel:

Gegner kontrollieren.

---

# 9. Umschalten

Eine zentrale Floorball-Eigenschaft.

---

## Ballgewinn

Sofortige Entscheidungen:

* Konter
* Sicherheit
* Neuaufbau

---

## Ballverlust

Entscheidungen:

* sofortiges Pressing
* Rückzug
* Raum schließen

---

# 10. Pressing

Pressing ist nicht nur:

"Angreifen"

---

Es besteht aus:

* Auslöser
* Richtung
* Laufweg
* Absicherung

---

Beispiel:

Auslöser:

Schlechter erster Kontakt

↓

Druck erzeugen

↓

Passweg schließen

---

# 11. Spielaufbau

Mögliche Elemente:

* erste Linie
* Unterstützer
* Passdreiecke
* Freilaufen

---

# 12. Angriffssysteme

Die Plattform unterstützt Konzepte wie:

* kontrollierter Aufbau
* schnelles Umschalten
* Positionsspiel
* Rotationen

---

# 13. Defensive Systeme

Beispiele:

* Mannorientiert
* Raumorientiert
* Mischformen

---

# 14. Powerplay

Überzahlspiel benötigt:

Elemente:

* Raumaufteilung
* Passdreiecke
* Bewegung
* Abschlussoptionen

---

# 15. Boxplay

Unterzahl benötigt:

Elemente:

* Zentrum schützen
* Schusswege blockieren
* Kommunikation

---

# 16. Standardsituationen

Unterstützen:

* Freischläge
* Bullys
* Ecken
* Auslösungen

---

# 17. Trainingsmodell

Training besteht aus:

```text id="3n8q5k"

Ziel

↓

Organisation

↓

Übung

↓

Coachingpunkte

↓

Reflexion

```

---

# 18. Altersgruppen

Training unterscheidet:

* Anfänger
* Nachwuchs
* Jugendliche
* Erwachsene
* Leistungssport

---

# 19. Entwicklungsprinzip

Eine U10-Taktik ist nicht einfach eine kleinere Erwachsenentaktik.

---

Berücksichtigen:

* Alter
* Erfahrung
* Lernziel

---

# 20. Coachingpunkte

Ein Coachingpunkt beschreibt:

Was soll der Spieler verstehen?

Beispiele:

"Nach Pass sofort Raum öffnen."

"Erster Blick nach vorne."

---

# 21. Fachsprache

Die Plattform verwendet:

Bevorzugt:

* Ballgewinn
* Umschalten
* Raum
* Passweg
* Abschluss

Vermeidet:

* unnötige Computersprache

---

# 22. Taktische Daten

Ein Taktikobjekt kann enthalten:

```typescript id="8v3m5q"

Concept {

 name

 category

 principle

 coachingPoints[]

}

```

---

# 23. KI und Floorball-Wissen

KI muss erkennen:

Ein Vorschlag ist abhängig von:

* Spielniveau
* Altersgruppe
* Ziel

---

# 24. Keine absolute Wahrheit

Floorball besitzt verschiedene Spielphilosophien.

Die Software soll:

Möglichkeiten zeigen.

Nicht:

eine einzige richtige Lösung behaupten.

---

# 25. Zukunft

Mögliche Erweiterungen:

* Taktikdatenbank
* Trainerwissen
* Verbandsempfehlungen
* Ausbildungsinhalte

---

# 26. Claude-Code-Regeln

Bei neuen Floorball-Funktionen prüfen:

1. Ist das ein echtes sportliches Konzept?
2. Würde ein Trainer diesen Begriff verwenden?
3. Hilft es beim Lernen?
4. Ist es altersgerecht?
5. Kann es erklärt werden?

---

# 27. Leitgedanke

OpenFloorball Coach soll nicht nur wissen, wo ein Spieler steht.

Es soll verstehen, warum er dort steht.

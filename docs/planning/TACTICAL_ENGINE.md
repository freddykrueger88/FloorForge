# TACTICAL_ENGINE.md

# OpenFloorball Coach Platform

## Taktik-Engine und digitales Spielfeldmodell

---

# 1. Zweck

Die Taktik-Engine bildet die Grundlage für:

* digitales Taktikboard
* Spielsituationen
* Animationen
* Trainingsinhalte
* spätere KI-Unterstützung

---

# 2. Grundprinzip

Eine Taktik ist nicht nur ein Bild.

Sie besteht aus:

```text id="2x2lkg"
Raum

+

Spieler

+

Bewegung

+

Entscheidung

+

Ziel
```

---

# 3. Spielfeldmodell

Das Spielfeld wird als Koordinatensystem dargestellt.

---

# Koordinaten

Standard:

```text id="9v7j2p"
x = Breite

y = Länge

```

---

Beispiel:

```typescript id="s9c8h4"
interface Position {
 x: number;
 y: number;
}
```

---

# 4. Spielfeldskalierung

Das System darf nicht von einer festen Bildschirmgröße abhängig sein.

Unterstützen:

* Desktop
* Tablet
* Smartphone
* Zoom
* Rotation

---

# 5. Spielfeldobjekte

Alle Elemente sind Objekte.

Grundstruktur:

```typescript id="3fd5p1"
interface TacticalObject {

 id: string;

 type: ObjectType;

 position: Position;

 metadata: object;

}
```

---

# 6. Spielertypen

Unterstützte Objekte:

---

## Eigener Spieler

Eigenschaften:

* Nummer
* Position
* Rolle
* Farbe

---

## Gegner

Eigenschaften:

* Position
* Rolle
* Farbe

---

## Torhüter

Eigenschaften:

* Position
* Team

---

## Ball

Eigenschaften:

* Position
* Besitz

---

# 7. Spielerrollen

Ein Spielerobjekt kann besitzen:

```text id="3p6r5n"
Torhüter

Verteidiger

Center

Stürmer

Flexibel
```

---

# 8. Bewegungsmodell

Bewegungen sind eigene Datenobjekte.

Nicht:

Eine Linie auf dem Bildschirm.

Sondern:

Eine geplante Aktion.

---

Beispiel:

```typescript id="f3q6yc"
interface Movement {

 from: Position;

 to: Position;

 duration: number;

 type: MovementType;

}
```

---

# 9. Bewegungstypen

Unterstützen:

---

## Laufweg

Spieler bewegt sich ohne Ball.

---

## Pass

Ball bewegt sich zu Mitspieler.

---

## Schuss

Ball Richtung Tor.

---

## Rotation

Spieler tauschen Räume.

---

## Unterstützung

Spieler schafft Passoption.

---

# 10. Taktische Aktionen

Später erweiterbar:

```text id="9r5zqa"
Screen

Press

Cover

Switch

Overlap

Cut

CreateSpace
```

---

# 11. Szenenmodell

Eine Taktik besteht aus Szenen.

Beispiel:

```text id="2jsj7q"
Taktik

|

├── Szene 1

├── Szene 2

└── Szene 3
```

---

# 12. Szenenstruktur

Beispiel:

```typescript id="5j3n0r"
interface TacticalScene {

 id: string;

 name: string;

 objects: TacticalObject[];

 actions: TacticalAction[];

 duration: number;

}
```

---

# 13. Timeline

Animationen benötigen eine Zeitachse.

Beispiel:

```text id="8b6z0x"

0 Sekunden

Spieler stehen

↓

2 Sekunden

Verteidiger startet Laufweg

↓

5 Sekunden

Pass

↓

7 Sekunden

Abschluss

```

---

# 14. Animation

Animation muss unterstützen:

* Start
* Pause
* Geschwindigkeit
* Wiederholung
* Schritt zurück

---

# 15. Taktische Ebenen

Eine Szene kann Ebenen besitzen.

Beispiele:

## Spieler-Ebene

Positionen.

---

## Bewegungs-Ebene

Laufwege.

---

## Coaching-Ebene

Hinweise.

---

## Analyse-Ebene

Beobachtungen.

---

# 16. Coachinginformationen

Eine Szene kann enthalten:

```typescript id="e6m4j1"
interface CoachingPoint {

 text: string;

 position: Position;

 category: string;

}
```

---

Beispiele:

"Nach Pass sofort nachrücken."

"Innenraum schließen."

---

# 17. Taktiktypen

Das System unterstützt Kategorien:

---

## Offensive

* Aufbau
* Angriff
* Abschluss

---

## Defensive

* Pressing
* Block
* Verteidigung

---

## Umschalten

* Ballgewinn
* Ballverlust

---

## Standards

* Freischlag
* Bully
* Powerplay

---

# 18. Powerplay-Modell

Spezielle Unterstützung:

* 5 gegen 4
* 6 gegen 5

Elemente:

* Überzahlstruktur
* Passdreiecke
* Rotationen
* Abschlussräume

---

# 19. Boxplay-Modell

Unterstützen:

* Blockformation
* Verschieben
* Räume schließen

---

# 20. Speichern

Taktiken werden als strukturierte Daten gespeichert.

Beispiel:

```json id="7x5g8d"
{
"name":"Powerplay links",
"scene":[]
}
```

---

# 21. Exportformat

Das Format muss:

* offen
* dokumentiert
* versionierbar

sein.

---

Beispiel:

```text id="4b3y9k"
OpenFloorball Tactical Format

Version 1
```

---

# 22. Zukunft: KI-Verarbeitung

Die Datenstruktur muss später erlauben:

Fragen:

* Welche Räume werden genutzt?
* Welche Bewegungen wiederholen sich?
* Welche Varianten existieren?

---

# 23. Zukunft: Analyse

Möglich:

* Vergleich verschiedener Varianten
* Mustererkennung
* Trainingsableitung

---

# 24. Fehlervermeidung

Das System darf keine falschen taktischen Aussagen erzeugen.

Es speichert:

Was dargestellt wurde.

Nicht:

Was automatisch "richtig" ist.

---

# 25. Performance

Das Taktikboard muss auch mit:

* vielen Objekten
* langen Animationen
* komplexen Szenen

flüssig bleiben.

---

# 26. Claude-Code-Regeln

Bei Erweiterungen:

Immer prüfen:

1. Ist es ein echtes Taktikobjekt?
2. Ist es fachlich sinnvoll?
3. Kann es gespeichert werden?
4. Kann es exportiert werden?
5. Ist es später KI-fähig?

---

# 27. Leitgedanke

Die Taktik-Engine ist nicht ein Zeichenprogramm.

Sie ist ein digitales Modell von Floorball-Denken.

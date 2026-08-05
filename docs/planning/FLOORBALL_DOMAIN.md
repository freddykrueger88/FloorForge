# FLOORBALL_DOMAIN.md

# OpenFloorball Coach Platform

## Fachkonzept und Fachmodell für Floorball, Unihockey und Unihoc

> Zusammengeführt aus FLOORBALL_DOMAIN.md und FLOORBALL_DOMAIN_MODEL.md
> im Zuge der Dokument-Konsolidierung nach der Projektanalyse – beide
> behandelten dieselben sportfachlichen Grundlagen mit unterschiedlicher
> Struktur und teils unterschiedlichem Fokus, ohne sich zu widersprechen.

---

# 1. Zweck dieses Dokuments

Dieses Dokument beschreibt die sportfachlichen Grundlagen der Plattform.

Die Software soll die Denkweise von Floorball-Trainern unterstützen und nicht nur Objekte auf einem Spielfeld abbilden, sondern:

* Spielideen
* taktische Prinzipien
* Trainingslogik
* Coachingwissen

Technische Entscheidungen müssen die Realität des Sports berücksichtigen.

---

# 2. Sportverständnis

Floorball ist ein schneller, dynamischer, räumlicher, entscheidungsorientierter Teamsport mit:

* hoher Dynamik
* schnellen Umschaltmomenten
* kleinen Entscheidungsfenstern
* komplexen Raumaufteilungen

Ein gutes Coaching-Werkzeug muss deshalb nicht nur Positionen darstellen, sondern Bewegungen, Räume, Beziehungen und Entscheidungen abbilden.

Eine Spielsituation besteht aus: **Raum + Spieler + Ball + Zeit + Entscheidung + Ziel**.

---

# 3. Spielfeldmodell

Das System muss ein standardisiertes Floorballfeld abbilden.

Grundelemente: Spielfeldgrenzen/Bande, Tore, Torraum, Schutzzone/Schusszonen, Mittellinie, Ecken, Wechselzonen, Freiräume, gefährliche Räume.

---

# 4. Spielerrollen

Ein Spieler ist mehr als eine Position. Grundrollen:

## Torhüter

Aufgaben: Raumverteidigung/Torverteidigung, Spielaufbau, Kommunikation, erste Spieleröffnung.

## Verteidiger

Aufgaben: Aufbau, Absicherung, Zweikämpfe, Passlinien kontrollieren, Raumkontrolle.

## Center

Aufgaben: Verbindung zwischen Linien, Raumkontrolle, Spielsteuerung, Umschalten.

## Stürmer / Flügelspieler

Aufgaben: Druck erzeugen, Abschlüsse, Räume öffnen, Breite geben, Pressing.

## Position ist nicht Rolle

Wichtig: Ein Spieler steht nicht nur an einem Punkt. Eine Position bedeutet aktueller Raum, Aufgabe und Entscheidungsmöglichkeit.

---

# 5. Formationen

Das System soll Formationen darstellen können, z.B.:

## 2-1-2

Klassische offensive Struktur: zwei Verteidiger, zentraler Spieler, zwei Angreifer.

## 2-2-1

Ausgewogene Struktur: stabile Absicherung, flexible Offensive.

## 3-2

Offensive Variante: mehr Druck, Risiko im Umschalten.

---

# 6. Grundprinzipien Offensive

* **Breite** – Räume öffnen
* **Tiefe** – Verteidigung auseinanderziehen
* **Dreiecke** – mehrere Passoptionen erzeugen
* **Bewegung ohne Ball** – Räume schaffen

Mögliche Elemente im Spielaufbau: erste Linie, Unterstützer, Passdreiecke, Freilaufen.

Angriffssysteme: kontrollierter Aufbau, schnelles Umschalten, Positionsspiel, Rotationen.

---

# 7. Grundprinzipien Defensive

* **Innenraum schützen** – gefährliche Abschlüsse verhindern
* **Kommunikation** – gemeinsames Verhalten
* **Übergeben und Übernehmen** – Gegner kontrollieren

Defensive Konzepte:

* **Mannorientiert** – Spieler verteidigen direkte Gegenspieler
* **Raumorientiert** – Spieler kontrollieren Räume
* **Hybrid/Mischformen** – Kombination aus beidem

---

# 8. Spielsituationen

Taktiken sollen Situationen abbilden:

## Offensive Situationen

Spielaufbau, Angriffsdrittel, Ballbesitz, Chancen kreieren.

## Defensive Situationen

Gegneraufbau, Ballverlust, Rückzug, Verteidigung des Slots.

## Umschalten (besonders wichtig)

**Ballgewinn** → sofortige Entscheidungen: Konter, Sicherheit, Neuaufbau.

**Ballverlust** → Entscheidungen: sofortiges Pressing, Rückzug, Raum schließen.

---

# 9. Raumkonzepte

Floorball ist stark raumorientiert. Das System muss unterstützen: Zonen, Räume, Korridore, Passlinien, Überzahlen.

---

# 10. Bewegungsarten

* **Laufweg** – Spieler bewegt sich ohne Ball
* **Supportbewegung** – Spieler bietet Passoption
* **Rotation** – Spieler tauschen Positionen
* **Hinterlaufen** – Spieler erzeugt Raum hinter einem Mitspieler
* **Schnittbewegung** – Spieler läuft in freien Raum

---

# 11. Ballaktionen

## Pass

Eigenschaften: Start, Ziel, Richtung, Geschwindigkeit.

## Schuss

Eigenschaften: Position, Ziel, Abschlussart.

## Ballführung

Eigenschaften: Raumgewinn, Gegnerbindung.

---

# 12. Pressing

Pressing ist nicht nur "Angreifen" – es besteht aus Auslöser, Pressingzone/Richtung, Laufwege, Absicherung/Unterstützer.

Beispiel-Kette: Auslöser (schlechter erster Kontakt) → Druck erzeugen → Passweg schließen.

Stufen:

* **Hohes Pressing** – Ziel: früher Ballgewinn
* **Mittleres Pressing** – Ziel: Gegner kontrollieren
* **Tiefes Verteidigen** – Ziel: Räume schließen

---

# 13. Powerplay

Überzahlspiel (5 gegen 4 oder 6 gegen 5). Benötigt: Überzahlformation/Raumaufteilung, Passwege/Passdreiecke, Rotationen/Bewegung, Abschlussoptionen.

Beispielformationen: 2-2, 3-1, Diamant.

---

# 14. Boxplay

Unterzahlspiel. Darstellung: Blockformation, Zentrum schützen, Verschieben, Pass-/Schusswege schließen, Kommunikation.

---

# 15. Standardsituationen

Unterstützen: Freischläge, Bullys, Ecken, Auslösungen.

---

# 16. Torhüterspiel

Eigene Kategorie. Mögliche Inhalte: Stellungsspiel, Auswurf, Kommunikation, Überzahlspiel.

---

# 17. Trainingsmodell und Altersgruppen

Trainingsmodell:

```text
Ziel → Organisation → Übung → Coachingpunkte → Reflexion
```

Eine Übung sollte speichern können: Ziel, Organisation, Ablauf, Coachingpunkte, Variationen.

Altersgruppen: Anfänger (Fokus: Technik, Spielverständnis, Spaß), Nachwuchs/Jugend (Fokus: Entscheidungen, Taktik, Entwicklung), Erwachsene/Leistungssport (Fokus: System, Leistung, Analyse).

Entwicklungsprinzip: Eine U10-Taktik ist nicht einfach eine kleinere Erwachsenentaktik. Berücksichtigen: Alter, Erfahrung, Lernziel.

---

# 18. Coachingpunkte

Trainerwissen ist oft textbasiert. Ein Coachingpunkt beschreibt, was der Spieler verstehen soll.

Beispiele:

* "Erster Kontakt nach vorne."
* "Kopf hoch vor Ballannahme."
* "Nach Pass sofort neu anbieten / Raum öffnen."
* "Erster Blick nach vorne."

---

# 19. Fachsprache

Die Plattform verwendet bevorzugt: Ballgewinn, Umschalten, Raum, Passweg, Abschluss. Vermeidet: unnötige Computersprache.

---

# 20. Analyseprinzip

Analyse soll Fragen beantworten – nicht "Wie viele Daten haben wir?", sondern "Was können wir verbessern?".

---

# 21. Datenmodell-Erweiterungen

Mögliche zukünftige fachliche Objekte:

```text
TacticalPrinciple
GameSituation
CoachingPoint
PlayerRole
TrainingObjective
DrillVariation
```

Ein Taktik-Konzept kann darüber hinaus enthalten:

```typescript
Concept {
  name
  category
  principle
  coachingPoints[]
}
```

---

# 22. Keine absolute Wahrheit

Floorball besitzt verschiedene Spielphilosophien. Die Software soll Möglichkeiten zeigen, nicht eine einzige richtige Lösung behaupten.

---

# 23. KI und Floorball-Wissen

KI darf nur auf Grundlage dieses Fachmodells arbeiten. Sie soll:

* Trainerbegriffe verstehen
* taktische Zusammenhänge erkennen
* erkennen, dass ein Vorschlag von Spielniveau, Altersgruppe und Ziel abhängt
* passende Vorschläge machen

Sie soll nicht:

* allgemeine Sporttexte kopieren
* falsche Fußballlogik übertragen
* taktische Entscheidungen erzwingen

---

# 24. Zukunft

Mögliche Erweiterungen: Taktikdatenbank, Trainerwissen-Sammlung, Verbandsempfehlungen, Ausbildungsinhalte.

---

# 25. Fachliche Qualitätsprüfung / Claude-Code-Regeln

Bei neuen Floorball-Funktionen prüfen:

1. Ist das ein echtes sportliches Konzept?
2. Würde ein Trainer diesen Begriff verwenden?
3. Hilft es beim Lernen? Unterstützt es echte Spielsituationen?
4. Ist es altersgerecht?
5. Kann es erklärt werden? Ist es einfacher als bestehende Lösungen?

---

# 26. Leitgedanke

OpenFloorball Coach soll nicht einfach ein digitales Whiteboard sein. Es soll ein digitales Werkzeug für Floorball-Denken werden.

Die Software bildet nicht nur Bewegungen ab – sie bewahrt Wissen. Sie soll nicht nur wissen, wo ein Spieler steht, sondern verstehen, warum er dort steht.

# MVP_DEFINITION.md

# OpenFloorball Coach Platform

## Definition der ersten nutzbaren Version

---

# 1. Ziel des MVP

Das MVP soll beweisen, dass OpenFloorball einen echten Mehrwert für Floorball-Trainer bietet.

Der Fokus liegt auf:

* Taktikvisualisierung
* einfachem Teilen von Spielideen
* Speicherung von Trainingswissen

---

# 2. MVP-Grundsatz

Das MVP ist nicht die fertige Plattform.

Es ist die erste stabile Grundlage.

---

# 3. Kernfrage

Das MVP muss beantworten:

"Kann ein Floorball-Trainer seine Idee schneller und verständlicher vermitteln?"

---

# 4. Nutzergruppe

Primäre Nutzer:

## Trainer

Beispiele:

* Jugendtrainer
* Vereinstrainer
* Assistenztrainer

---

Sekundäre Nutzer:

* Spieler
* Trainerteams

---

# 5. MVP-Funktionen

---

# Funktion 1

## Digitales Floorball-Taktikboard

Der Nutzer kann:

* Spielfeld anzeigen
* Spieler platzieren
* Ball platzieren
* Gegner darstellen
* Laufwege zeichnen
* Passwege zeichnen

---

# Akzeptanzkriterien

Die Funktion ist fertig, wenn:

✅ Spielfeld sichtbar
✅ Objekte bewegbar
✅ Bewegungen speicherbar
✅ Darstellung wiederherstellbar

---

# Funktion 2

## Taktiken speichern

Ein Trainer kann:

* neue Taktik erstellen
* Namen vergeben
* Beschreibung hinzufügen
* speichern
* erneut öffnen

---

# Akzeptanzkriterien

Eine gespeicherte Taktik bleibt nach Neustart verfügbar.

---

# Funktion 3

## Szenenverwaltung

Eine Taktik kann mehrere Szenen enthalten.

Beispiele:

* Ausgangssituation
* Bewegung
* Abschluss

---

# Akzeptanzkriterien

Der Trainer kann zwischen Szenen wechseln.

---

# Funktion 4

## Export einer Taktik

Eine Taktik kann exportiert werden.

Ziel:

* Teilen
* Backup
* Austausch

---

Bevorzugte Formate:

* offenes Datenformat
* lesbare Struktur

---

# Funktion 5

## Grundlegende Benutzerverwaltung

Unterstützen:

* Benutzerkonto
* Anmeldung
* einfache Rollen

---

Nicht im MVP:

* komplexes Rechtesystem
* große Organisationsverwaltung

---

# Funktion 6

## Responsive Nutzung

Die Anwendung funktioniert auf:

* Tablet
* Desktop

---

Priorität:

Tablet zuerst.

---

# 6. Bewusst nicht im MVP

Diese Funktionen werden später gebaut:

---

## Keine komplexe KI

Nicht enthalten:

* automatische Taktikerstellung
* Spielanalyse
* Spielerbewertung

---

## Keine umfangreiche Statistik

Nicht enthalten:

* Leistungsdaten
* Scouting
* Rankings

---

## Keine soziale Plattform

Nicht enthalten:

* öffentliche Profile
* Follower
* Likes

---

## Keine Videoplattform

Nicht enthalten:

* Videoanalyse
* Streaming

---

# 7. MVP-Datenmodell

Minimal benötigt:

```text id="8m5q2p"

User

↓

Tactic

↓

Scene

↓

Objects

```

---

# 8. MVP-Nutzerfluss

## Neuer Trainer

```text id="4q7m9n"

Registrieren

↓

Taktikboard öffnen

↓

Spieler platzieren

↓

Laufweg zeichnen

↓

Speichern

↓

Erneut öffnen

```

---

# 9. MVP-Qualitätsanforderungen

Das MVP benötigt:

* Tests
* Dokumentation
* Datenschutzprüfung
* stabile Speicherung

---

# 10. MVP-Erfolg messen

Nicht messen:

Anzahl Funktionen.

---

Messen:

* Können Trainer damit arbeiten?
* Verstehen Spieler die Darstellung?
* Spart es Zeit?
* Wird es wieder verwendet?

---

# 11. MVP-Testgruppe

Empfohlen:

Kleine Gruppe:

* 3-10 Trainer
* unterschiedliche Erfahrungsstufen

---

# 12. Feedbackfragen

Nicht nur:

"Gefällt es?"

---

Besser:

* Welche Aufgabe wurde einfacher?
* Wo entstehen Probleme?
* Welche Funktion fehlt wirklich?
* Würdest du es im Training einsetzen?

---

# 13. Entwicklungsschritte

Empfohlene Reihenfolge:

```text id="6p9m3q"

1. Spielfeld

↓

2. Objekte

↓

3. Bewegungen

↓

4. Speichern

↓

5. Laden

↓

6. Teilen

```

---

# 14. Claude-Code-Arbeitsregel

Während MVP-Entwicklung:

Nicht erweitern, bevor der Kern funktioniert.

---

Wenn eine neue Idee entsteht:

Fragen:

1. Hilft sie dem MVP-Ziel?
2. Ist sie notwendig?
3. Kann sie warten?

---

# 15. Definition des MVP-Erfolgs

Das MVP ist erfolgreich, wenn ein Trainer sagt:

"Ich kann damit meine Floorball-Idee besser erklären als mit Papier oder einer normalen Zeichnung."

---

# Leitgedanke

Ein kleines funktionierendes Werkzeug ist wertvoller als eine große unfertige Plattform.

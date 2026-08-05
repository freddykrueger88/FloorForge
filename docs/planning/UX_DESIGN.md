# UX_DESIGN.md

# OpenFloorball Coach Platform

## User Experience Design Guidelines

---

# 1. UX-Philosophie

Die Plattform wird für Trainer gebaut.

Nicht für Software-Nutzer.

Ein Trainer denkt:

"Wie erkläre ich diese Spielsituation?"

Nicht:

"Welche Funktion muss ich jetzt öffnen?"

---

# 2. Grundprinzipien

## Einfachheit

Die häufigsten Aktionen müssen sofort erreichbar sein.

Beispiel:

Eine Bewegung zeichnen sollte schneller gehen als mit einem Stift auf einem Whiteboard.

---

## Direkte Manipulation

Objekte werden direkt bearbeitet.

Bevorzugt:

* ziehen
* verschieben
* zeichnen
* antippen

Vermeiden:

* komplizierte Formulare
* tiefe Menüs
* unnötige Dialoge

---

## Wenige Schritte

Jede häufige Aufgabe soll möglichst wenige Aktionen benötigen.

Beispiel:

Neue Taktik:

1. Erstellen
2. Spieler platzieren
3. Bewegung zeichnen

---

# 3. Trainer-Workflow

Die Anwendung orientiert sich am echten Ablauf.

---

## Vor dem Training

Trainer:

* erstellt Einheit
* plant Übungen
* bereitet Taktiken vor

---

## Während des Trainings

Trainer:

* öffnet Übung
* erklärt Situation
* zeigt Animation

---

## Nach dem Training

Trainer:

* ergänzt Notizen
* speichert Erkenntnisse
* verbessert Varianten

---

# 4. Hauptnavigation

Empfohlene Bereiche:

```text id="1n8y49"
Dashboard

|

Taktikboard

|

Training

|

Übungen

|

Analyse

|

Team

|

Wissen
```

---

# 5. Dashboard

Ziel:

Schneller Einstieg.

Anzeigen:

* letzte Taktiken
* nächste Trainings
* Favoriten
* zuletzt bearbeitete Inhalte

---

# 6. Taktikboard UX

Das Taktikboard ist das Kernprodukt.

---

# 6.1 Spielfeld

Anforderungen:

* klare Darstellung
* wenig Ablenkung
* gute Lesbarkeit
* Touch optimiert

---

# 6.2 Werkzeugleiste

Werkzeuge müssen sichtbar sein.

Beispiel:

```text id="5pn7os"
Spieler

Ball

Pfeil

Linie

Zone

Text

Animation
```

---

# 6.3 Farben

Farben müssen Bedeutung haben.

Beispiel:

Eigene Mannschaft:

Blau

Gegner:

Rot

Ball:

Gelb

Bewegung:

Grün

---

Keine reine Dekoration.

---

# 6.4 Spieler platzieren

Aktion:

Antippen → Spieler erscheint

oder

Drag & Drop

---

# 6.5 Bewegungen zeichnen

Trainer zeichnet:

Startpunkt → Endpunkt

System erkennt:

* Richtung
* Bewegung
* Dauer

---

# 6.6 Animation

Minimal:

Großer Startbutton.

Nicht:

komplizierte Timeline zuerst.

---

# 7. Mobile und Tablet Nutzung

Viele Trainer arbeiten:

* am Spielfeldrand
* in der Halle
* unterwegs

Daher:

Pflicht:

* große Touchflächen
* schnelle Bedienung
* Offline-Fähigkeit

---

# 8. Desktop Nutzung

Desktop bietet:

* größere Arbeitsfläche
* Tastatur
* Maus
* Drag & Drop

---

# 9. Responsive Prinzip

Nicht:

Desktop verkleinern.

Sondern:

Für jede Situation optimieren.

---

# 10. Accessibility

Die Plattform soll möglichst viele Nutzer unterstützen.

Berücksichtigen:

* Kontraste
* Tastaturbedienung
* klare Sprache
* skalierbare Darstellung

---

# 11. Sprache

Verwende Trainerbegriffe.

Nicht:

"Entity"

Sondern:

"Spieler"

Nicht:

"Layer"

Sondern:

"Ebene"

---

# 12. Fehlermeldungen

Fehler müssen hilfreich sein.

Schlecht:

"Error 403"

Gut:

"Diese Taktik kann nicht gespeichert werden. Prüfe deine Internetverbindung."

---

# 13. Leerer Zustand

Leere Seiten sollen helfen.

Beispiel:

Keine Taktiken vorhanden.

Nicht:

"Keine Daten"

Sondern:

"Erstelle deine erste Floorball-Taktik."

---

# 14. Speichern

Grundprinzip:

Der Nutzer darf keine Arbeit verlieren.

Bevorzugt:

* automatische Speicherung
* sichtbarer Status

Beispiel:

"Gespeichert"

---

# 15. Zusammenarbeit

Später:

Mehrere Trainer können gemeinsam arbeiten.

Darstellung:

* wer bearbeitet
* Änderungen
* Kommentare

---

# 16. Designsystem

Komponenten:

* Buttons
* Karten
* Dialoge
* Menüs
* Formulare
* Icons

Alle Komponenten müssen wiederverwendbar sein.

---

# 17. Keine Gamification

Die Plattform ist kein Spiel.

Vermeiden:

* Punkte
* Rankings
* künstliche Belohnungen

---

# 18. Vertrauen

Der Nutzer muss jederzeit wissen:

* Was passiert?
* Wo sind meine Daten?
* Wer sieht Inhalte?

---

# 19. UX-Qualitätsprüfung

Vor jeder größeren Funktion prüfen:

1. Versteht ein Trainer die Funktion sofort?
2. Sind weniger Schritte möglich?
3. Funktioniert sie auf Tablet?
4. Ist sie ohne Anleitung nutzbar?
5. Erzeugt sie echten Mehrwert?

---

# 20. Leitgedanke

Die beste Oberfläche verschwindet.

Der Trainer denkt nicht über Software nach.

Er denkt über Floorball nach.

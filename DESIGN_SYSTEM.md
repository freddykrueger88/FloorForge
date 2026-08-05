# DESIGN_SYSTEM.md

# OpenFloorball Coach Platform

## Designsystem und UI-Richtlinien

---

# 1. Ziel

Das Designsystem sorgt dafür, dass OpenFloorball Coach:

* verständlich
* schnell bedienbar
* professionell
* barrierearm
* konsistent

bleibt.

---

# 2. Designphilosophie

Die Oberfläche unterstützt den Trainer.

Sie soll:

* Ruhe schaffen
* Fokus ermöglichen
* Informationen klar darstellen

Nicht:

* ablenken
* überladen
* unnötig dekorativ sein

---

# 3. Designprinzipien

## Funktion vor Dekoration

Jedes Element benötigt einen Zweck.

---

## Sichtbarkeit wichtiger Aktionen

Die wichtigsten Werkzeuge müssen sofort erreichbar sein.

Beispiele:

* Spieler hinzufügen
* Bewegung zeichnen
* Animation starten
* speichern

---

## Wenige Entscheidungen

Der Nutzer soll nicht überlegen müssen:

"Wo finde ich diese Funktion?"

---

# 4. Farbsystem

Farben besitzen Bedeutung.

---

# Primärfarben

Verwendung:

* Navigation
* Hauptaktionen
* aktive Zustände

Beispiel:

```text id="8d8ozf"
Primärfarbe:

Floorball Blau
```

---

# Sekundärfarben

Verwendung:

* Hinweise
* ergänzende Aktionen

---

# Statusfarben

## Erfolg

Grün

Beispiele:

* gespeichert
* abgeschlossen

---

## Warnung

Orange

Beispiele:

* Konflikte
* Hinweise

---

## Fehler

Rot

Beispiele:

* Fehler
* ungültige Aktion

---

# 5. Floorball-Farblogik

Farben auf dem Spielfeld:

---

## Eigene Mannschaft

Standard:

Blau

---

## Gegner

Standard:

Rot

---

## Ball

Standard:

Gelb

---

## Bewegungen

Standard:

Grün

---

## Hinweise

Standard:

Orange

---

Farben dürfen angepasst werden.

Bedeutung bleibt erhalten.

---

# 6. Kontrast

Alle Farben müssen:

* ausreichend Kontrast bieten
* bei schlechter Beleuchtung funktionieren
* für verschiedene Sehfähigkeiten geeignet sein

---

# 7. Typografie

Ziel:

Schnelle Lesbarkeit.

---

Verwendung:

## Überschriften

klar und deutlich

---

## Inhalte

ruhig und gut lesbar

---

## Zahlen

besonders lesbar:

* Spielernummern
* Zeiten
* Werte

---

# 8. Abstände

Einheitliches Raster.

Grundprinzip:

Nicht jedes Element individuell platzieren.

---

Bevorzugt:

* 4px Raster
* 8px Raster

---

# 9. Buttons

Buttons müssen klar unterscheiden:

---

## Primärer Button

Hauptaktion.

Beispiel:

"Neue Taktik"

---

## Sekundärer Button

Alternative Aktion.

Beispiel:

"Importieren"

---

## Gefährliche Aktion

Beispiel:

"Löschen"

Benötigt Bestätigung.

---

# 10. Touch-Regeln

Die Plattform wird für Trainer im Einsatz entwickelt.

Mindestanforderungen:

* große Bedienflächen
* ausreichend Abstand
* keine kleinen Schaltflächen

---

Empfehlung:

Touch-Ziele mindestens:

44x44 Pixel

---

# 11. Icons

Icons unterstützen.

Sie ersetzen nicht automatisch Text.

---

Regeln:

* eindeutig
* einfach
* konsistent

---

# 12. Taktikboard UI

Das Board ist der wichtigste Bereich.

---

Priorität:

Spielfeld > Werkzeuge > Zusatzinformationen

---

# 13. Werkzeugleiste

Empfohlene Struktur:

```text id="k1j5th"
Spieler

Ball

Bewegung

Pass

Schuss

Zone

Text

Animation
```

---

# 14. Spielerdesign

Spielerobjekte müssen:

erkennen lassen:

* Team
* Position
* Nummer

---

Beispiel:

```text id="4zn3sq"

     7

   ●

 blau = eigenes Team

```

---

# 15. Bewegungsdesign

Bewegungen müssen unterscheiden:

* Laufweg
* Pass
* Schuss

---

Beispiel:

Laufweg:

durchgezogene Linie

Pass:

gestrichelte Linie

Schuss:

kräftiger Pfeil

---

# 16. Animation Controls

Minimal:

```text id="6l7e0d"

▶ Start

⏸ Pause

↺ Wiederholen

```

---

Keine komplexen Steuerungen im ersten Schritt.

---

# 17. Karten und Inhalte

Für:

* Übungen
* Taktiken
* Trainings

verwenden:

* klare Karten
* Vorschau
* wichtigste Informationen zuerst

---

# 18. Dark Mode

Unterstützen.

Grund:

Trainer arbeiten oft:

* in Hallen
* bei wenig Licht
* auf mobilen Geräten

---

# 19. Accessibility

Pflicht:

* Tastaturbedienung
* ausreichender Kontrast
* verständliche Texte
* Fokuszustände

---

# 20. Sprache

Die Oberfläche verwendet Trainerbegriffe.

Bevorzugt:

"Spieler"

statt:

"Objekt"

---

"Training"

statt:

"Session"

---

"Bewegung"

statt:

"Animation Entity"

---

# 21. Fehlermeldungen

Regel:

Fehler erklären und helfen.

---

Beispiel:

Schlecht:

"Save failed"

---

Besser:

"Die Taktik konnte nicht gespeichert werden. Deine lokale Kopie bleibt erhalten."

---

# 22. Leere Zustände

Leere Bereiche sollen führen.

Beispiel:

Keine Taktiken:

"Erstelle deine erste Spielsituation."

---

# 23. Responsive Design

Unterstützung:

* Smartphone
* Tablet
* Desktop

---

Priorität:

Tablet zuerst für Taktikboard.

---

# 24. Wiederverwendbare Komponenten

Alle UI-Elemente werden als Komponenten entwickelt.

Beispiele:

* Button
* Dialog
* Card
* PlayerToken
* TacticalArrow
* Timeline

---

# 25. Design Review

Neue UI-Funktionen prüfen:

1. Ist die Funktion sofort verständlich?
2. Funktioniert sie mit Touch?
3. Passt sie zum Trainerworkflow?
4. Ist sie barrierearm?
5. Ist sie nicht überladen?

---

# 26. Leitgedanke

Das beste Design für einen Trainer ist nicht das schönste.

Es ist das, welches im richtigen Moment die richtige Information sichtbar macht.

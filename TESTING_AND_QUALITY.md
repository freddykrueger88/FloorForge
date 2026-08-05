# TESTING_AND_QUALITY.md

# OpenFloorball Coach Platform

## Teststrategie, Qualitätssicherung und Entwicklungsstandards

---

# 1. Ziel

Die Plattform soll:

* zuverlässig
* sicher
* wartbar
* verständlich

entwickelt werden.

Qualität entsteht nicht am Ende.

Qualität entsteht während jeder Entwicklungsphase.

---

# 2. Grundprinzip

Jede Funktion benötigt:

```text id="8q4m2z"

Planung

↓

Implementierung

↓

Test

↓

Review

↓

Dokumentation

```

---

# 3. Testpyramide

Die Plattform verwendet mehrere Testebenen.

---

# Ebene 1: Unit Tests

Testen einzelne Bausteine.

Beispiele:

* Berechnungen
* Datenverarbeitung
* Hilfsfunktionen

---

# Ebene 2: Integration Tests

Testen Zusammenspiel.

Beispiele:

* API
* Datenbank
* Synchronisation

---

# Ebene 3: End-to-End Tests

Testen echte Nutzerabläufe.

Beispiele:

Trainer erstellt Taktik.

↓

Speichert.

↓

Öffnet später wieder.

---

# 4. Testabdeckung

Nicht die höchste Prozentzahl ist das Ziel.

Ziel:

Die wichtigen Bereiche sind geschützt.

---

Priorität:

1. Daten
2. Berechtigungen
3. Taktiklogik
4. Synchronisation
5. UI-Kernfunktionen

---

# 5. Taktikboard Tests

Besonders testen:

---

## Spielfeld

Prüfen:

* korrekte Darstellung
* Skalierung
* Positionierung

---

## Spieler

Prüfen:

* platzieren
* bewegen
* speichern

---

## Bewegungen

Prüfen:

* Laufwege
* Pässe
* Animationen

---

# 6. Datenmodell Tests

Prüfen:

* Beziehungen
* Validierung
* Migrationen

---

# 7. Datenschutz Tests

Prüfen:

* Löschung funktioniert
* Export funktioniert
* keine unnötigen Daten gespeichert werden

---

# 8. Berechtigungs-Tests

Jede Rolle testen.

Beispiel:

Trainer A:

darf eigene Taktik bearbeiten.

---

Trainer B:

darf sie nicht bearbeiten.

---

# 9. Offline Tests

Prüfen:

* App ohne Internet
* Speicherung lokal
* Synchronisation später

---

# 10. Konflikttests

Szenario:

Gerät A verändert Inhalt.

Gerät B verändert denselben Inhalt.

---

Erwartung:

Konflikt wird erkannt.

---

# 11. Sicherheitstests

Regelmäßig prüfen:

* Abhängigkeiten
* Zugriffskontrolle
* Eingaben
* APIs

---

# 12. UI Tests

Prüfen:

* Navigation
* Touch-Bedienung
* wichtige Nutzerwege

---

# 13. Accessibility Tests

Pflicht:

* Tastaturbedienung
* Kontrast
* Fokuszustände
* verständliche Texte

---

# 14. Performance Tests

Besonders relevant:

* viele Spielerobjekte
* lange Animationen
* große Bibliotheken

---

# 15. Mobile Tests

Testgeräte:

* Smartphone
* Tablet
* verschiedene Bildschirmgrößen

---

# 16. Browser-Unterstützung

Definieren:

* unterstützte Browser
* Mindestversionen

---

# 17. Automatisierung

Jede Änderung sollte automatisch prüfen:

```text id="5r7m9k"

Code

↓

Lint

↓

Tests

↓

Build

↓

Security Check

```

---

# 18. Continuous Integration

Jeder Pull Request startet automatische Prüfungen.

---

# 19. Fehlerberichte

Ein Fehler benötigt:

* Beschreibung
* Schritte zum Nachstellen
* erwartetes Verhalten
* tatsächliches Verhalten

---

# 20. Regressionstests

Behobene Fehler werden dauerhaft getestet.

---

# 21. Code Review

Prüfung:

## Funktion

Löst die Änderung das Problem?

---

## Architektur

Passt sie zum System?

---

## Sicherheit

Entstehen Risiken?

---

## Datenschutz

Werden Daten korrekt behandelt?

---

# 22. Dokumentationsprüfung

Neue Funktionen benötigen:

* technische Beschreibung
* Nutzerbeschreibung

---

# 23. Testdaten

Keine echten personenbezogenen Daten verwenden.

Verwenden:

* Beispieldaten
* anonymisierte Daten

---

# 24. KI-generierter Code

Besondere Prüfung.

Claude Code erzeugter Code muss:

* verstanden werden
* getestet werden
* dokumentiert werden

---

# 25. Release-Kriterien

Eine Version darf veröffentlicht werden wenn:

* Tests erfolgreich
* keine kritischen Fehler
* Dokumentation aktuell
* Sicherheitsprüfung bestanden

---

# 26. Qualitätsmetriken

Beobachten:

* Fehleranzahl
* Stabilität
* Ladezeiten
* Nutzerfeedback

Nicht:

unnötige Nutzerüberwachung.

---

# 27. Floorball-Fachprüfung

Neue Funktionen prüfen:

* entspricht sie echtem Training?
* versteht ein Trainer sie?
* verbessert sie den Ablauf?

---

# 28. Claude-Code-Arbeitsregel

Kein Feature gilt als fertig ohne:

1. Implementierung
2. Test
3. Dokumentation
4. Review

---

# 29. Leitgedanke

Softwarequalität bedeutet nicht, dass keine Fehler existieren.

Softwarequalität bedeutet, dass Fehler kontrolliert erkannt und verbessert werden.

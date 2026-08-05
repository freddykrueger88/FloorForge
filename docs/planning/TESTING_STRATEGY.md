# TESTING_STRATEGY.md

# OpenFloorball Coach Platform

## Teststrategie und Qualitätsmanagement

---

# 1. Ziel

Tests sollen sicherstellen, dass die Plattform:

* zuverlässig funktioniert
* Nutzerdaten schützt
* langfristig wartbar bleibt
* Traineranforderungen erfüllt

Tests sind kein letzter Schritt.

Sie sind Bestandteil der Entwicklung.

---

# 2. Testprinzipien

## Qualität vor Geschwindigkeit

Eine schnelle Funktion, die später Probleme verursacht, ist keine gute Entwicklung.

---

## Automatisieren, was wiederholt geprüft werden muss

Automatisierung reduziert Fehler.

---

## Nutzerperspektive berücksichtigen

Nicht nur Code testen.

Auch:

* Arbeitsabläufe
* Verständlichkeit
* Traineranforderungen

---

# 3. Testpyramide

Die Plattform verwendet mehrere Testebenen.

```text id="r6osw8"

          End-to-End Tests

              /\

             /  \

            /    \

       Integration Tests

          /        \

         /          \

      Unit Tests

```

---

# 4. Unit Tests

## Ziel

Einzelne Funktionen isoliert prüfen.

---

Geeignet für:

* Berechnungen
* Datenumwandlungen
* Taktiklogik
* Validierung

---

Beispiele:

## Bewegung berechnen

Eingabe:

Startpunkt + Zielpunkt

Erwartung:

korrekte Richtung

---

## Taktik speichern

Eingabe:

gültige Daten

Erwartung:

korrektes Objekt

---

# 5. Integration Tests

## Ziel

Zusammenspiel verschiedener Bereiche prüfen.

---

Beispiele:

* Frontend + API
* API + Datenbank
* Synchronisation
* Dateiexport

---

# 6. End-to-End Tests

## Ziel

Echte Nutzerabläufe simulieren.

---

Beispiel:

Trainer erstellt Taktik:

1. Anwendung öffnen
2. neues Board erstellen
3. Spieler platzieren
4. Laufweg zeichnen
5. Animation starten
6. speichern

Erwartung:

Ablauf funktioniert vollständig.

---

# 7. Taktikboard Tests

Das wichtigste Modul benötigt besondere Tests.

---

## Spielfeld

Prüfen:

* korrektes Rendering
* Skalierung
* Touch
* Zoom

---

## Objekte

Prüfen:

* erstellen
* verschieben
* löschen
* speichern

---

## Animation

Prüfen:

* Start
* Pause
* Ende
* Geschwindigkeit

---

# 8. Datenmodell Tests

Prüfen:

* Migrationen
* Validierung
* Export
* Import

---

Beispiel:

Eine exportierte Taktik muss wieder vollständig importiert werden können.

---

# 9. Offline Tests

Wichtiger Bestandteil.

Prüfen:

* Arbeiten ohne Internet
* lokale Speicherung
* Wiederverbindung
* Konflikte

---

# 10. Datenschutztests

Jede Version prüfen:

---

## Datensammlung

Frage:

Werden unnötige Daten gespeichert?

---

## Zugriff

Frage:

Kann ein Nutzer Daten sehen, die er nicht sehen darf?

---

## Löschung

Frage:

Werden Daten vollständig entfernt?

---

# 11. Sicherheitstests

Prüfen:

* Authentifizierung
* Berechtigungen
* API-Schutz
* Eingabevalidierung

---

# 12. Performance Tests

Wichtige Bereiche:

---

## Taktikboard

Prüfen:

* viele Objekte
* Animationen
* große Taktiken

---

## Mobile Geräte

Prüfen:

* Speicherverbrauch
* Geschwindigkeit
* Akkuverbrauch

---

# 13. Accessibility Tests

Prüfen:

* Tastaturbedienung
* Kontrast
* Screenreader
* Fokusführung

---

# 14. KI-Tests

KI benötigt eigene Tests.

---

## Fachlichkeit

Prüfen:

Versteht die KI Floorball-Begriffe?

---

## Sicherheit

Prüfen:

Werden verbotene Daten verarbeitet?

---

## Stabilität

Prüfen:

Ändert sich Verhalten unerwartet durch Modelländerungen?

---

# 15. Testdaten

Testdaten dürfen keine echten personenbezogenen Daten enthalten.

Verwenden:

* künstliche Spieler
* Testteams
* Beispielvereine

---

# 16. Regression Tests

Jede neue Version prüft bestehende Funktionen.

Beispiele:

Nach Änderung am Taktikboard:

* Speichern funktioniert weiterhin
* Export funktioniert weiterhin
* Animation funktioniert weiterhin

---

# 17. Release-Kriterien

Eine Version darf veröffentlicht werden wenn:

* Tests erfolgreich
* keine kritischen Sicherheitsprobleme
* Dokumentation aktualisiert
* Datenschutz geprüft

---

# 18. Fehlermanagement

Jeder Fehler benötigt:

* Beschreibung
* Schritte zur Reproduktion
* Priorität
* Lösung
* Test zur Vermeidung

---

# 19. Qualitätsmetriken

Nicht nur Codezeilen messen.

Wichtiger:

* Fehlerquote
* Nutzerzufriedenheit
* Performance
* Wartbarkeit

---

# 20. Regel für Claude Code

Vor Abschluss einer Funktion:

1. Funktion implementieren
2. Tests erstellen
3. Tests ausführen
4. Dokumentation aktualisieren
5. Auswirkungen prüfen

---

# 21. Leitgedanke

Tests sind kein Misstrauen gegenüber Code.

Tests sind Schutz für Nutzer, Entwickler und die Zukunft des Projekts.

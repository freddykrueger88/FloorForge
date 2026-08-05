# TESTING_STRATEGY.md

# OpenFloorball Coach Platform

## Teststrategie und Qualitätsmanagement

> Zusammengeführt aus TESTING_STRATEGY.md und TESTING_AND_QUALITY.md
> (beide Dokumente deckten denselben Inhalt mit fast identischer
> Struktur ab) im Zuge der Dokument-Konsolidierung nach der
> Projektanalyse.

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

# 2. Definition von "fertig"

Eine Funktion ist erst fertig, wenn:

✅ Funktion implementiert
✅ Tests vorhanden
✅ Dokumentation aktualisiert
✅ Datenschutz geprüft
✅ Sicherheitsaspekte geprüft
✅ Nutzerfluss verständlich

---

# 3. Testprinzipien

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

# 4. Testpyramide

Die Plattform verwendet mehrere Testebenen.

```text
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

# 5. Unit Tests

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

Eingabe: Startpunkt + Zielpunkt

Erwartung: korrekte Richtung

---

## Taktik speichern

Eingabe: gültige Daten

Erwartung: korrektes Objekt

---

# 6. Integration Tests

## Ziel

Zusammenspiel verschiedener Bereiche prüfen.

---

Beispiele:

* Frontend + API
* API + Datenbank
* Synchronisation
* Dateiexport

---

# 7. End-to-End Tests

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

Erwartung: Ablauf funktioniert vollständig.

---

# 8. Taktikboard Tests

Das wichtigste Modul benötigt besondere Tests.

---

## Spielfeld

Prüfen: korrektes Rendering, Skalierung, Touch, Zoom

---

## Objekte

Prüfen: erstellen, verschieben, löschen, speichern

---

## Animation

Prüfen: Start, Pause, Ende, Geschwindigkeit

---

# 9. Datenmodell Tests

Prüfen: Migrationen, Validierung, Export, Import

---

Beispiel: Eine exportierte Taktik muss wieder vollständig importiert werden können.

---

# 10. Offline Tests

Wichtiger Bestandteil.

Prüfen: Arbeiten ohne Internet, lokale Speicherung, Wiederverbindung, Konflikte

---

# 11. Synchronisationsprüfung

Testfälle:

* gleiche Änderung auf zwei Geräten
* Konflikte
* Wiederherstellung

---

# 12. Datenschutztests

Jede Version prüfen:

---

## Datensammlung

Frage: Werden unnötige Daten gespeichert?

---

## Zugriff

Frage: Kann ein Nutzer Daten sehen, die er nicht sehen darf?

---

## Löschung

Frage: Werden Daten vollständig entfernt?

---

# 13. Sicherheitstests

Prüfen: Authentifizierung, Berechtigungen, API-Schutz, Eingabevalidierung

---

# 14. Performance Tests

Wichtige Bereiche:

---

## Taktikboard

Prüfen: viele Objekte, Animationen, große Taktiken

---

## Mobile Geräte

Prüfen: Speicherverbrauch, Geschwindigkeit, Akkuverbrauch

---

# 15. Accessibility Tests

Prüfen: Tastaturbedienung, Kontrast, Screenreader, Fokusführung

---

# 16. KI-Tests

KI benötigt eigene Tests.

---

## Fachlichkeit

Prüfen: Versteht die KI Floorball-Begriffe?

---

## Sicherheit

Prüfen: Werden verbotene Daten verarbeitet?

---

## Stabilität

Prüfen: Ändert sich Verhalten unerwartet durch Modelländerungen?

---

# 17. Testdaten

Testdaten müssen anonym, realistisch und löschbar sein.

Nie verwenden:

* echte Spielerinformationen
* private Vereinsdaten
* Produktionsdaten

Stattdessen verwenden: künstliche Spieler, Testteams, Beispielvereine.

---

# 18. Keine personenbezogene Bewertung

Tests müssen verhindern:

* automatische Spielerbewertung
* versteckte Profile
* unerlaubte Analyse

---

# 19. Regression Tests

Jede neue Version prüft bestehende Funktionen.

Beispiele – nach Änderung am Taktikboard:

* Speichern funktioniert weiterhin
* Export funktioniert weiterhin
* Animation funktioniert weiterhin

---

# 20. Automatisierte Prüfungen

Bei Änderungen automatisch ausführen:

```text
Code Prüfung
  ↓
Tests
  ↓
Security Scan
  ↓
Build
```

---

# 21. Release-Kriterien

Eine Version darf veröffentlicht werden, wenn:

☑ Tests erfolgreich
☑ keine kritischen Sicherheitsprobleme
☑ Dokumentation aktualisiert
☑ Datenschutz geprüft
☑ Backup geprüft

---

# 22. Fehlermanagement

Jeder Fehler benötigt:

* Beschreibung
* Schritte zur Reproduktion / Ursache
* Priorität
* Lösung
* Test zur Vermeidung

---

# 23. Qualitätsmetriken

Nicht nur Codezeilen messen.

Wichtiger:

* Fehlerquote
* Nutzerzufriedenheit
* Performance
* Wartbarkeit

---

# 24. Prioritäten bei begrenzter Zeit

1. Sicherheit
2. Datenintegrität
3. Kernfunktionen
4. Benutzerfreundlichkeit
5. Erweiterungen

---

# 25. Qualität bei Open Source

Jeder Beitrag soll nachvollziehbar, überprüfbar und wartbar sein.

---

# 26. Regel für Claude Code

Vor Abschluss einer Funktion:

1. Funktion implementieren
2. Tests erstellen
3. Tests ausführen
4. Dokumentation aktualisieren
5. Auswirkungen prüfen

Zusätzliche Selbstprüfung vor Abschluss einer Aufgabe:

1. Welche Tests wurden ergänzt?
2. Welche bestehenden Tests wurden geprüft?
3. Welche Risiken entstehen?
4. Welche Dokumentation wurde aktualisiert?

---

# 27. Qualitätskultur

Fehler sind Hinweise zur Verbesserung, nicht etwas, das versteckt werden muss.

Das Ziel ist, das System besser zu machen.

---

# 28. Leitgedanke

Tests sind kein Misstrauen gegenüber Code.

Tests sind Schutz für Nutzer, Entwickler und die Zukunft des Projekts.

Ein gutes Open-Source-Projekt wächst nicht nur durch neue Funktionen. Es wächst durch Vertrauen in die Qualität.

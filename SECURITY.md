# SECURITY.md

# OpenFloorball Coach Platform

## Sicherheitsrichtlinie und verantwortungsvolle Meldung von Sicherheitsproblemen

---

# 1. Ziel

OpenFloorball entwickelt eine sichere und vertrauenswürdige Plattform für:

* Floorball-Trainer
* Vereine
* Spieler
* Entwickler

Sicherheit wird von Anfang an berücksichtigt.

---

# 2. Sicherheitsprinzipien

Das Projekt folgt:

* Security by Design
* Privacy by Design
* minimaler Datenspeicherung
* offenen Sicherheitsprozessen

---

# 3. Verantwortung

Sicherheit ist eine gemeinsame Aufgabe von:

* Entwicklern
* Maintainer
* Beitragenden
* Betreibern

---

# 4. Unterstützte Versionen

Sicherheitsupdates werden bevorzugt für:

* aktuelle stabile Version
* aktuelle Entwicklungszweige

bereitgestellt.

---

# 5. Sicherheitsprobleme melden

Bitte Sicherheitsprobleme nicht öffentlich als Issue veröffentlichen.

Stattdessen:

* private Meldung an das Projektteam
* Beschreibung des Problems
* mögliche Auswirkungen
* Schritte zur Reproduktion

---

# 6. Informationen für eine Meldung

Eine hilfreiche Meldung enthält:

## Beschreibung

Was wurde gefunden?

---

## Betroffene Komponente

Beispiel:

* Anmeldung
* Datenexport
* Berechtigungen
* Synchronisation

---

## Risiko

Welche Auswirkungen könnten entstehen?

---

## Reproduktion

Wie kann das Problem nachvollzogen werden?

---

# 7. Umgang mit Meldungen

Nach Eingang einer Meldung:

```text id="6q9m4p"

Eingang bestätigen

↓

Problem prüfen

↓

Risiko bewerten

↓

Lösung entwickeln

↓

Update veröffentlichen

```

---

# 8. Keine Bestrafung für verantwortungsvolle Meldungen

Personen, die Sicherheitsprobleme verantwortungsvoll melden, sollen unterstützt werden.

Voraussetzung:

* keine absichtliche Schädigung
* keine Veröffentlichung sensibler Daten
* angemessene Kommunikation

---

# 9. Datenschutz und Sicherheit

Besonders geschützt werden:

* Zugangsdaten
* personenbezogene Daten
* Vereinsdaten
* private Inhalte

---

# 10. Datensparsamkeit

Die sicherste unnötige Information ist:

eine Information, die gar nicht gespeichert wird.

---

# 11. Zugriffskontrolle

Jeder Zugriff benötigt:

* klare Berechtigung
* nachvollziehbaren Zweck

---

Prinzip:

So wenig Rechte wie möglich.

---

# 12. Authentifizierung

Anforderungen:

* sichere Passwortspeicherung
* sichere Sitzungen
* Schutz vor Missbrauch

---

# 13. Autorisierung

Jede geschützte Aktion muss prüfen:

Darf diese Person diese Aktion ausführen?

---

Beispiele:

* Taktik ansehen
* Teamdaten ändern
* Inhalte löschen

---

# 14. Datenübertragung

Sensible Kommunikation muss geschützt erfolgen.

Beispiele:

* verschlüsselte Verbindungen
* sichere Schnittstellen

---

# 15. Lokale Speicherung

Bei Offline-Nutzung beachten:

* lokale Daten schützen
* Zugriff kontrollieren
* sichere Synchronisation

---

# 16. Drittanbieter

Vor Nutzung externer Dienste prüfen:

* Datenschutz
* Sicherheit
* Notwendigkeit
* Alternative Möglichkeiten

---

# 17. Abhängigkeiten

Software-Abhängigkeiten regelmäßig prüfen:

* Sicherheitsupdates
* bekannte Schwachstellen
* Lizenzbedingungen

---

# 18. Protokollierung

Logs dürfen enthalten:

* technische Fehler
* Systemereignisse

Nicht enthalten:

* Passwörter
* private Inhalte
* unnötige personenbezogene Daten

---

# 19. Tests

Sicherheit wird geprüft durch:

* automatisierte Tests
* Code Reviews
* Abhängigkeitsprüfungen

---

# 20. Entwicklerregeln

Entwickler achten auf:

* Eingabeprüfung
* sichere Datenverarbeitung
* sichere Fehlerbehandlung
* keine Geheimnisse im Code

---

# 21. KI und Sicherheit

Bei KI-Funktionen prüfen:

* welche Daten verarbeitet werden
* wohin Daten übertragen werden
* ob eine lokale Lösung möglich ist

---

Keine sensiblen Daten ohne klare Grundlage an externe KI-Systeme senden.

---

# 22. Offenheit und Sicherheit

Open Source bedeutet:

Code ist sichtbar.

Nicht:

Daten sind öffentlich.

---

# 23. Sicherheitskultur

Das Projekt bevorzugt:

* offene Kommunikation
* schnelle Reaktion
* kontinuierliche Verbesserung

---

# 24. Ziel

OpenFloorball soll eine Plattform sein, der Vereine vertrauen können.

---

# Leitgedanke

Gute Sicherheit entsteht nicht durch Geheimhaltung.

Sie entsteht durch bewusste Architektur, transparente Prozesse und verantwortungsvolles Handeln.

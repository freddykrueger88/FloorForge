# INITIAL_TECH_STACK_DECISION.md

# OpenFloorball Coach Platform

## Technische Grundentscheidung und Architekturstrategie

---

# 1. Ziel

Dieses Dokument definiert die technische Ausgangsbasis für OpenFloorball.

Die Technologieauswahl folgt nicht kurzfristigen Trends.

Sie folgt den Projektzielen:

* offen
* sicher
* wartbar
* erweiterbar
* unabhängig

---

# 2. Auswahlprinzipien

Jede Technologie wird bewertet nach:

* Open-Source-Verfügbarkeit
* Community-Größe
* langfristiger Pflege
* Sicherheit
* Dokumentation
* Datenschutzverträglichkeit
* Self-Hosting-Fähigkeit

---

# 3. Architekturprinzip

OpenFloorball verwendet eine modulare Architektur.

Grundidee:

```text id="5m8q3n"

Frontend

↓

API

↓

Business Logic

↓

Database

↓

Storage

```

---

# 4. Frontend

## Anforderungen

Das Frontend muss:

* auf Tablets funktionieren
* Touch unterstützen
* offlinefähig sein
* performant sein

---

## Empfohlene Richtung

Progressive Web Application (PWA)

Vorteile:

* funktioniert im Browser
* installierbar
* geeignet für Tablets
* weniger Plattformabhängigkeit

---

# 5. Frontend-Aufgaben

Das Frontend übernimmt:

* Benutzeroberfläche
* Taktikboard
* Trainingsplanung
* Offline-Interaktion

---

# 6. Taktikboard-Engine

Das Taktikboard wird als eigene Komponente betrachtet.

Nicht direkt mit UI vermischen.

Struktur:

```text id="8q4m6p"

Tactic Engine

↓

Rendering

↓

User Interface

```

---

# 7. Backend

Das Backend übernimmt:

* Geschäftslogik
* Benutzerverwaltung
* Berechtigungen
* Synchronisation
* Datenzugriffe

---

# 8. API-Prinzip

Die Schnittstelle soll:

* dokumentiert
* versionierbar
* nachvollziehbar

sein.

---

# 9. Datenbank

Empfehlung:

relationale Datenbank.

Warum:

* klare Beziehungen
* sichere Transaktionen
* gute Langzeitstabilität

---

Datenbank muss unterstützen:

* Migrationen
* Backups
* Export
* Versionierung

---

# 10. Lokale Speicherung

Für Offline-Nutzung:

Lokale Datenhaltung auf dem Gerät.

Ziel:

Auch ohne Internet arbeiten können.

---

# 11. Synchronisation

Synchronisation muss berücksichtigen:

* Änderungen
* Versionen
* Konflikte
* Wiederherstellung

---

# 12. Dateispeicherung

Für:

* Bilder
* Dokumente
* optionale Medien

---

Prinzip:

Keine unnötige Speicherung großer Dateien.

---

# 13. Authentifizierung

Anforderungen:

* sichere Anmeldung
* sichere Sitzungen
* klare Rollen

---

# 14. Berechtigungsmodell

Unterstützen:

* Benutzer
* Verein
* Team
* Inhalt

---

# 15. Hosting

Bevorzugt:

* EU-Hosting
* Self Hosting
* Containerbetrieb

---

# 16. Containerisierung

Empfohlen:

Container-basierter Betrieb.

Vorteile:

* einfache Installation
* reproduzierbare Umgebung
* leichter Wechsel von Servern

---

# 17. Entwicklungsumgebung

Ein Entwickler sollte starten können mit:

```text id="7p3m8q"

Repository klonen

↓

Abhängigkeiten installieren

↓

Testumgebung starten

↓

Entwickeln

```

---

# 18. Open-Source-Abhängigkeiten

Vor jeder Abhängigkeit prüfen:

* Lizenz
* Wartung
* Sicherheit
* Notwendigkeit

---

# 19. Keine unnötigen Cloud-Abhängigkeiten

Externe Dienste nur wenn:

* klarer Nutzen
* Datenschutz geprüft
* Alternative bewertet

---

# 20. KI-Integration

KI-Komponenten müssen austauschbar bleiben.

Keine Architektur darf vollständig von einem KI-Anbieter abhängen.

---

# 21. Datenhoheit

Datenmodelle müssen:

* dokumentiert
* exportierbar
* unabhängig

sein.

---

# 22. Entwicklungsreihenfolge

Empfohlen:

Phase 1:

```text id="2m8q5v"

Grundprojekt

↓

Datenmodell

↓

Taktikboard

↓

Speicherung

```

---

Phase 2:

```text id="4q9m7p"

Training

↓

Teams

↓

Synchronisation

```

---

Phase 3:

```text id="6p2m8n"

Community

↓

KI

↓

Erweiterungen

```

---

# 23. Architekturentscheidungen dokumentieren

Größere Entscheidungen benötigen:

* Problem
* Optionen
* Entscheidung
* Begründung

---

# 24. Claude-Code-Regel

Bei technischen Entscheidungen nicht fragen:

"Was ist aktuell am beliebtesten?"

Sondern:

"Was passt langfristig zu OpenFloorball?"

---

# 25. Leitgedanke

Die Technik ist nicht das Produkt.

Die Technik ist das Fundament, auf dem Trainer und Vereine zuverlässig arbeiten können.

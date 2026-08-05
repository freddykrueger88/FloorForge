# ARCHITECTURE.md

# OpenFloorball Coach Platform

## Technische Architektur und Entwicklungsrichtlinien

---

# 1. Architekturziel

Die Architektur von OpenFloorball Coach verfolgt ein Ziel:

Eine langfristig wartbare, sichere, offene und erweiterbare Coaching-Plattform zu schaffen.

Die Architektur muss ermöglichen:

* Webanwendung
* mobile Nutzung
* Desktop-Anwendung
* Self Hosting
* Cloud-Betrieb
* Offline-Nutzung
* Erweiterungen durch Plugins
* Integration externer Systeme

---

# 2. Architekturprinzipien

## Modularität

Jeder größere Funktionsbereich wird als eigenständiges Modul betrachtet.

Beispiele:

* Taktikeditor
* Trainingsplanung
* Videoanalyse
* Benutzerverwaltung
* KI-Service
* Medienverwaltung

Module sollen möglichst unabhängig voneinander entwickelt und ersetzt werden können.

---

## API First

Alle wichtigen Funktionen werden über klar definierte Schnittstellen erreichbar.

Die API ist kein Nebenprodukt.

Sie ist ein Kernbestandteil der Architektur.

Ziele:

* Mobile Apps
* Desktop Apps
* Integrationen
* Plugins
* externe Tools

---

## Open Standards

Verwende bevorzugt:

* REST
* GraphQL wenn sinnvoll
* WebSockets
* JSON
* OpenAPI
* OAuth2/OIDC

Vermeide proprietäre Schnittstellen.

---

## Offline First

Die Anwendung muss wichtige Funktionen lokal ausführen können.

Beispiele:

* Taktiken erstellen
* Übungen ansehen
* Trainings planen
* Notizen schreiben

Die Cloud dient zur Synchronisierung.

---

## Local First

Lokale Datenhaltung ist ein bewusstes Architekturprinzip.

Vorteile:

* Geschwindigkeit
* bessere Offline-Nutzung
* Datensouveränität
* geringere Cloud-Abhängigkeit

---

# 3. Empfohlene Systemarchitektur

## Überblick

```text
                    Nutzer
                      |
                      |
              Web / Mobile / Desktop
                      |
                      |
                Application Layer
                      |
        --------------------------------
        |              |               |
   Taktik Engine   Training       Analyse
        |
        |
              Domain Layer
        |
        |
              API Layer
        |
        |
          Daten & Synchronisation
        |
        |
   --------------------------------
   |                              |
Lokale Datenbank              Cloud Storage

```

---

# 4. Frontend Architektur

## Ziel

Eine schnelle, intuitive und responsive Anwendung.

Unterstützung:

* Desktop
* Tablet
* Smartphone
* Touch
* Stifteingabe

---

## Empfohlene Technologie

Bevorzugt:

* TypeScript
* React
* Next.js

Alternative Technologien müssen begründet werden.

---

## Frontend Prinzipien

Beachte:

* Komponenten wiederverwenden
* klare Zuständigkeiten
* geringe Komplexität
* gute Performance
* Accessibility

---

# 5. Taktikeditor Architektur

Der Taktikeditor ist eines der wichtigsten Module.

Er sollte unabhängig vom restlichen System funktionieren.

---

## Kernobjekte

Beispiele:

```
Tactic

Scene

Player

Movement

Arrow

Zone

Annotation

Timeline

Animation

Template
```

---

## Speicherung

Taktiken werden als offene strukturierte Daten gespeichert.

Beispiel:

```json
{
  "name": "Powerplay Variante 1",
  "sport": "floorball",
  "players": [],
  "movements": [],
  "scenes": []
}
```

---

## Vorteile

Dadurch möglich:

* Export
* Import
* Versionierung
* KI-Analyse
* Community-Sharing
* langfristige Archivierung

---

# 6. Synchronisation

Die Plattform benötigt eine robuste Synchronisationsstrategie.

Anforderungen:

* Offline Änderungen
* Konfliktlösung
* mehrere Geräte
* Zusammenarbeit

Bevorzugte Technologien:

* CRDT
* Event-basierte Synchronisation

Beispiele:

* Yjs
* Automerge

---

# 7. Backend Architektur

Das Backend verwaltet:

* Benutzer
* Teams
* Berechtigungen
* Synchronisation
* Medien
* Speicherung
* APIs

---

# 8. Datenbank

Bevorzugt:

* PostgreSQL

Warum:

* Open Source
* stabil
* leistungsfähig
* Self Hosting möglich

---

# 9. Datenmodell Prinzipien

Grundsätzlich:

So wenig personenbezogene Daten wie möglich.

Beispiel:

Spielerprofil:

Erlaubt:

* Name
* Nummer
* Position
* Teamrolle

Nur speichern, wenn notwendig:

* Geburtsdatum
* Kontaktinformationen
* Leistungsdaten

---

# 10. Medienarchitektur

Videos und Bilder benötigen getrennte Speicherung.

Unterstützung:

* lokale Speicherung
* S3-kompatible Speicherung
* Self Hosting

Keine direkte Abhängigkeit von einem Anbieter.

---

# 11. KI-Architektur

KI wird über eine eigene Abstraktionsschicht eingebunden.

Beispiel:

```
Application

↓

AI Interface

↓

--------------------------------
|              |               |
Lokales Modell  Cloud API   Spezialanbieter

```

---

# 12. Plugin-System

Langfristig soll die Plattform Erweiterungen ermöglichen.

Beispiele:

Plugins:

* neue Sportarten
* neue Analyseformen
* neue Exporte
* Verbandsmodule
* KI-Erweiterungen

---

# 13. Rollenmodell

Unterstützung für:

## Plattform

* Administrator

## Organisation

* Vereinsadministrator

## Team

* Cheftrainer
* Co-Trainer
* Spieler
* Zuschauer

Berechtigungen müssen granular sein.

---

# 14. Sicherheit

Pflicht:

* sichere Authentifizierung
* sichere Sessions
* Rollenprüfung
* Verschlüsselung
* sichere APIs

---

# 15. Deployment

Unterstützung:

## Cloud

Beispiel:

* Docker
* Kubernetes optional

## Self Hosting

Beispiel:

* Docker Compose
* lokale Datenbank
* eigene Speicherung

---

# 16. Monitoring

Monitoring muss datenschutzfreundlich sein.

Bevorzugt:

* Open Source Monitoring
* keine versteckte Nutzeranalyse

Beispiele:

* Prometheus
* Grafana

---

# 17. Testing Strategie

Ebenen:

## Unit Tests

Für:

* Logik
* Berechnungen
* Datenverarbeitung

---

## Integration Tests

Für:

* APIs
* Datenbank
* Synchronisation

---

## End-to-End Tests

Für:

* wichtige Nutzerabläufe

Beispiele:

Trainer erstellt Training.

Trainer erstellt Taktik.

Trainer teilt Szene.

---

# 18. Dokumentation

Jede größere Architekturentscheidung benötigt:

* ADR
* Erklärung
* Konsequenzen

Dokumentation ist Teil des Produkts.

---

# 19. Technische Entscheidungsregel

Wenn mehrere Architekturen möglich sind:

Bevorzuge:

1. offene Lösung
2. einfachere Lösung
3. wartbarere Lösung
4. datenschutzfreundlichere Lösung
5. Self-Hosting-fähige Lösung
6. langfristig skalierbare Lösung

---

# 20. Architekturvision

Die Architektur soll nicht nur heute funktionieren.

Sie soll ermöglichen, dass OpenFloorball Coach in zehn Jahren noch existiert.

Die wichtigste technische Entscheidung ist deshalb nicht:

"Was ist am schnellsten?"

Sondern:

"Was ermöglicht nachhaltiges Wachstum ohne Verlust von Offenheit und Kontrolle?"

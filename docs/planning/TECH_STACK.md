# TECH_STACK.md

# OpenFloorball Coach Platform

## Technologiestandard und Begründungen

---

# 1. Grundprinzip

Technologien werden nicht nach Trends ausgewählt.

Die Auswahl erfolgt nach:

1. langfristiger Wartbarkeit
2. Open-Source-Verfügbarkeit
3. Datenschutzfreundlichkeit
4. Self-Hosting-Fähigkeit
5. Entwicklerfreundlichkeit
6. Performance
7. Community-Unterstützung

---

# 2. Zielarchitektur

Die Plattform wird als moderne, modulare Anwendung entwickelt.

Grundstruktur:

```text
                    Nutzer

                      |

        Web App / Mobile App / Desktop App

                      |

              Application Layer

                      |

        --------------------------------

        |              |               |

   Taktik Engine   Training       Analyse

        |

        |

             Backend Services

        |

        |

        Datenbank + Storage

```

---

# 3. Programmiersprache

## TypeScript

Status:

Standard

---

## Gründe

TypeScript bietet:

* hohe Entwicklerproduktivität
* gute Wartbarkeit
* starke Typisierung
* große Open-Source-Community
* Nutzung im Frontend und Backend möglich

---

# 4. Frontend

## Framework

Empfehlung:

## React

mit

## Next.js

---

## Gründe

* etabliert
* große Community
* gute Performance
* gute Accessibility-Unterstützung
* geeignet für komplexe Anwendungen

---

# 5. Styling

## Tailwind CSS

---

## Gründe

* schnelle Entwicklung
* konsistente Designs
* gute Wartbarkeit
* keine komplexen CSS-Strukturen

---

# 6. Komponentenbibliothek

Empfohlen:

## shadcn/ui

---

## Gründe

* Open Source
* moderne Komponenten
* anpassbar
* keine harte Abhängigkeit

---

# 7. State Management

Empfehlung:

## Zustand

Für:

* UI-Zustand
* lokale Anwendungskomponenten

---

Zusätzlich:

## React Query / TanStack Query

Für:

* Serverdaten
* Synchronisation
* Caching

---

# 8. Taktikboard Engine

Dies ist ein kritisches Modul.

Anforderungen:

* Canvas
* Touch
* Animation
* Export
* Performance

---

Mögliche Technologie:

## Konva.js

oder

## SVG-basierte Eigenentwicklung

---

Entscheidung muss anhand folgender Kriterien getroffen werden:

* Touch-Unterstützung
* Animation
* Skalierung
* Exportmöglichkeiten
* Wartbarkeit

---

# 9. Backend

Empfehlung:

## NestJS

---

## Gründe

* TypeScript
* modulare Architektur
* klare Struktur
* gute Skalierbarkeit

---

# 10. API

Standard:

## REST API

mit

## OpenAPI Dokumentation

---

Optional:

GraphQL nur wenn ein echter Vorteil entsteht.

---

# 11. Datenbank

## PostgreSQL

Standarddatenbank.

---

## Gründe

* Open Source
* stabil
* leistungsfähig
* Self Hosting
* große Community

---

# 12. ORM

Empfehlung:

## Prisma

---

## Gründe

* gute TypeScript-Unterstützung
* sichere Queries
* einfache Migrationen

---

# 13. Lokale Speicherung

Für Local-First-Funktionen:

Empfohlen:

## IndexedDB

mit Abstraktionsschicht.

---

Mögliche Werkzeuge:

* Dexie.js
* RxDB

---

# 14. Synchronisation

Langfristiges Ziel:

CRDT-basierte Synchronisation.

Mögliche Technologien:

* Yjs
* Automerge

---

Grund:

Mehrere Trainer müssen später gleichzeitig arbeiten können.

---

# 15. Echtzeit-Kommunikation

Für:

* Zusammenarbeit
* Live-Änderungen
* Kommentare

Empfohlen:

* WebSockets

---

# 16. Dateispeicherung

Medien:

* Videos
* Bilder
* Exporte

nicht direkt in Datenbank speichern.

---

Empfehlung:

S3-kompatibler Storage.

Beispiele:

* MinIO
* eigene Storage-Lösung

---

# 17. Authentifizierung

Empfehlung:

## OpenID Connect

Unterstützung vorbereiten für:

* eigene Accounts
* Vereinsaccounts
* externe Identity Provider

---

# 18. Containerisierung

Standard:

## Docker

---

Gründe:

* einfache Entwicklung
* Self Hosting
* reproduzierbare Umgebung

---

# 19. Deployment

MVP:

Docker Compose

Später:

optional Kubernetes

---

# 20. Testing

## Unit Tests

Empfehlung:

Vitest

---

## End-to-End Tests

Empfehlung:

Playwright

---

## Komponenten Tests

Empfehlung:

Testing Library

---

# 21. Codequalität

Werkzeuge:

## ESLint

für:

* Codequalität
* Standards

---

## Prettier

für:

* einheitliche Formatierung

---

# 22. CI/CD

Empfohlen:

GitHub Actions

Aufgaben:

* Tests
* Build
* Security Checks
* Releases

---

# 23. Dokumentation

Technische Dokumentation:

* Markdown
* OpenAPI
* ADRs

---

# 24. Monitoring

Datenschutzfreundlich:

Empfohlen:

* Prometheus
* Grafana

Keine versteckte Nutzerüberwachung.

---

# 25. KI-Technologie

KI wird über eine eigene Schnittstelle eingebunden.

Nicht:

```text
App → Anbieter X
```

Sondern:

```text
App

↓

AI Interface

↓

Provider Adapter

↓

Modell
```

---

Unterstützung möglich für:

* lokale Modelle
* Open Source Modelle
* externe APIs

---

# 26. Mobile Strategie

Langfristig:

Option:

## React Native

oder

## Progressive Web App

---

Entscheidung abhängig von:

* Offline-Anforderungen
* Hardwarezugriff
* Performance

---

# 27. Desktop Strategie

Möglichkeiten:

* Progressive Web App
* Electron
* Tauri

Bevorzugt:

leichte Lösungen.

---

# 28. Verbotene Architekturentscheidungen

Nicht verwenden ohne ausdrückliche Begründung:

* proprietäre Kernabhängigkeiten
* geschlossene Datenformate
* Cloud-only Architektur
* Anbieterabhängige KI
* unnötige Microservices

---

# 29. Architekturregel

Die beste Technologie ist nicht die modernste.

Die beste Technologie ist die, die OpenFloorball Coach in zehn Jahren noch wartbar macht.

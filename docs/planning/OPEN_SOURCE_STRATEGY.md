# OPEN_SOURCE_STRATEGY.md

# OpenFloorball Coach Platform

## Open-Source-Strategie, Governance und Projektorganisation

> Zusammengeführt aus OPEN_SOURCE_STRATEGY.md und
> OPEN_SOURCE_GOVERNANCE.md im Zuge der Dokument-Konsolidierung nach
> der Projektanalyse. Die beiden Dokumente hatten leicht
> unterschiedliche Maintainer-Hierarchien (3-stufig "Core Maintainer/
> Domain Maintainer/Community Contributor" vs. 4-stufig "Community →
> Contributor → Maintainer → Core Team") – aufgelöst zugunsten der
> klareren 4-stufigen Aufstiegs-Pipeline, mit "Domain Maintainer" als
> Spezialisierung innerhalb der Maintainer-Stufe.

---

# 1. Grundidee

OpenFloorball Coach wird als offene Plattform entwickelt, die langfristig als offenes Projekt bestehen soll.

Offen bedeutet:

* offener Quellcode
* offene Datenformate
* transparente Entwicklung
* nachvollziehbare Entscheidungen
* gemeinschaftliche Verbesserung
* nachhaltige Pflege

---

# 2. Grundprinzipien

Das Projekt basiert auf:

* Offenheit
* Respekt
* Transparenz
* technischer Qualität
* gemeinsamer Verantwortung

Projektwerte: Wissen teilen, Vereine stärken, Nachwuchs fördern, digitale Selbstbestimmung.

---

# 3. Warum Open Source?

## Vertrauen

Nutzer können nachvollziehen, wie Daten verarbeitet werden, welche Funktionen existieren, welche Technologien genutzt werden.

## Nachhaltigkeit / keine Abhängigkeit von Einzelpersonen

Die Plattform hängt nicht ausschließlich von einem Unternehmen, einer Person oder einem einzelnen Verein ab.

## Gemeinschaft

Trainer, Vereine und Entwickler können gemeinsam verbessern.

## Innovation

Neue Ideen können schneller entstehen.

---

# 4. Lizenzstrategie

## Software

Eine Open-Source-Lizenz wird verwendet. Mögliche Optionen: AGPLv3, GPLv3, Apache License 2.0, MIT License.

Die endgültige Entscheidung benötigt Prüfung hinsichtlich: Community-Ziele, kommerzielle Nutzung, Schutz vor proprietären Ablegern.

Ziele der Lizenz: freie Nutzung ermöglichen, Beiträge schützen, Offenheit erhalten.

## Inhalte und Code trennen

Softwarelizenz ≠ Inhaltslizenz. Beispiel: Code unter Open-Source-Lizenz, Taktiken/Übungen unter separater Inhaltslizenz.

## Daten gehören den Nutzern

Die Softwarelizenz und die Datenhoheit sind getrennte Themen. Der Nutzer besitzt seine Inhalte (Taktiken, Übungen, Trainingspläne, Analysen, Vereinswissen).

---

# 5. Offene Datenformate

Vermeiden: Daten nur innerhalb der Plattform nutzbar machen.

Unterstützen: JSON, CSV, offene Standards.

---

# 6. Projektstruktur / Rollen-Hierarchie

```text
Community
  ↓
Contributor
  ↓
Maintainer
  ↓
Core Team
```

## Community

Können: Ideen einbringen, Fehler melden, Dokumentation verbessern, Inhalte teilen.

## Contributor

Leisten aktive Beiträge: Code, Übersetzungen, Designs, Tests, Floorball-Wissen.

## Maintainer

Verantworten: Qualität, Reviews, Releases, technische Richtung. Innerhalb dieser Stufe gibt es fachliche Spezialisierung als **Domain Maintainer** – Experten für Floorball, UX, Datenschutz oder KI, die nicht zwingend für die gesamte Architektur verantwortlich sind.

## Core Team

Entscheidet über: Architektur, langfristige Strategie, wichtige Änderungen.

---

# 7. Entscheidungsprozesse

Entscheidungen sollen nachvollziehbar, dokumentiert und offen diskutierbar sein.

Größere technische Entscheidungen benötigen ein Dokument:

```text
Problem → Optionen → Bewertung → Entscheidung
```

(siehe ADR-Format in DECISIONS.md)

---

# 8. Beitragsmodell

* Entwickler: Code, Tests, Architektur
* Trainer: Anforderungen, Feedback, Übungen, Taktiken
* Designer: UX, Grafiken, Bedienkonzepte
* Übersetzer: Sprache, Fachbegriffe

Jeder Beitrag sollte verständlich, getestet und dokumentiert sein.

---

# 9. Umgang mit Beiträgen / Feature-Anfragen

Jeder Beitrag bzw. jede neue Idee wird bewertet nach:

1. Nutzerwert / Nutzen
2. Qualität / Aufwand
3. Sicherheit
4. Datenschutz
5. Wartbarkeit

Nicht jede Idee wird umgesetzt – Frage: Verbessert es wirklich Training oder Vereinsarbeit? (keine Feature-Überladung)

---

# 10. Pull Requests und Code Review

Ein Pull Request benötigt: Beschreibung, Begründung, Tests, mögliche Auswirkungen.

Code Review prüft: Funktion, Sicherheit, Datenschutz, Architektur, Wartbarkeit.

Branch-Strategie:

```text
main → development → feature branches
```

---

# 11. Dokumentationspflicht

Ein Open-Source-Projekt lebt von Dokumentation. Pflicht: Installation, Entwicklung, Architektur, Beiträge, Nutzung.

Neue Funktionen benötigen: technische Dokumentation, Nutzerbeschreibung, gegebenenfalls Beispiele.

---

# 12. Beispiele und Vorlagen

Die Community soll Inhalte teilen können (Trainingsübungen, Taktikvorlagen, Standardsituationen).

Dabei beachten: Urheberrechte, Datenschutz, Einwilligungen.

---

# 13. Community-Kultur und Code of Conduct

Grundregeln: Wir diskutieren Ideen, wir respektieren Menschen, respektvolle Kommunikation, konstruktive Kritik, faire Zusammenarbeit.

Nicht akzeptiert: persönliche Angriffe, Diskriminierung, Belästigung, absichtliche Sabotage, Missbrauch der Plattform.

(vollständiger Verhaltenskodex siehe CODE_OF_CONDUCT.md)

---

# 14. Datenschutz in der Community

Offene Entwicklung bedeutet nicht offene persönliche Daten.

Schutz: keine privaten Nutzerdaten im Repository, keine echten Spielerinformationen in Tests.

---

# 15. Sicherheit melden

Sicherheitsprobleme nicht öffentlich veröffentlichen.

```text
Meldung → Prüfung → Behebung → Veröffentlichung
```

---

# 16. Roadmap-Entwicklung

Die Community kann mitgestalten, aber die Strategie bleibt nachvollziehbar und transparent dokumentiert.

---

# 17. Kommerzielle Nutzung und Finanzierung

Open Source bedeutet nicht automatisch kostenloser Betrieb. Mögliche Modelle:

* Support für Vereine, Verbände, Bildungseinrichtungen
* Hosting (verwaltete Instanzen, professionelle Services)
* Entwicklungspartnerschaften mit Verbänden, Vereinen, Bildungspartnern
* Spenden, Förderungen, Vereinsunterstützung

Nicht: Verkauf persönlicher Daten, verstecktes Tracking, Werbeprofile, Datenweitergabe ohne Zustimmung.

---

# 18. Community-Wissen

Floorball-Fachwissen ist wertvoll. Daher: Autoren sichtbar machen, Quellen respektieren, Lizenzen beachten.

---

# 19. Langfristige Nachhaltigkeit

Das Projekt benötigt: aktive Maintainer, klare Finanzierung, gute Dokumentation, stabile Architektur, stabile Releases, aktive Community, einfache Mitarbeit.

Neue Funktionen entstehen durch echte Probleme, Trainerfeedback, technische Möglichkeiten – nicht durch kurzfristige Trends.

---

# 20. Claude-Code-Regeln

Bei Projektentscheidungen prüfen:

1. Unterstützt es Offenheit?
2. Ist es langfristig wartbar?
3. Gibt es eine Community-Perspektive?
4. Werden Nutzerrechte respektiert?
5. Vermeidet es Abhängigkeiten?

---

# 21. Vision

OpenFloorball Coach soll zeigen: Eine moderne Sportplattform kann gleichzeitig leistungsfähig, offen, sicher, datenschutzfreundlich und gemeinschaftlich sein.

---

# 22. Leitgedanke

Der Code gehört der Community. Das Wissen gehört den Trainern. Die Kontrolle bleibt bei den Nutzern.

Open Source bedeutet nicht nur, Code sichtbar zu machen – es bedeutet, gemeinsam Verantwortung zu übernehmen.

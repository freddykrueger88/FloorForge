# DECISIONS.md

# OpenFloorball Coach Platform

## Architecture Decision Records

---

# Zweck

Dieses Dokument hält wichtige technische Entscheidungen fest.

Warum?

Weil zukünftige Entwickler verstehen müssen:

* was entschieden wurde
* warum es entschieden wurde
* welche Alternativen betrachtet wurden

---

# Format

Jede Entscheidung folgt diesem Muster:

---

# ADR-XXXX: Titel

## Datum

YYYY-MM-DD

---

## Status

Optionen:

* vorgeschlagen
* akzeptiert
* abgelehnt
* ersetzt

---

## Kontext

Welches Problem muss gelöst werden?

Welche Anforderungen bestehen?

---

## Entscheidung

Welche Lösung wurde gewählt?

---

## Alternativen

Welche anderen Lösungen wurden betrachtet?

---

## Begründung

Warum wurde diese Lösung gewählt?

---

## Konsequenzen

Welche Vorteile entstehen?

Welche Nachteile entstehen?

---

# Beispiel ADR-0001

## Titel

Local First Architektur

---

## Status

Akzeptiert

---

## Kontext

Trainer arbeiten häufig in Umgebungen mit schlechter Internetverbindung.

Die Plattform muss zuverlässig funktionieren.

---

## Entscheidung

Die Anwendung wird nach Local-First-Prinzipien entwickelt.

Lokale Datenhaltung ist Standard.

Cloud dient zur Synchronisation.

---

## Alternativen

### Cloud First

Vorteile:

* einfache zentrale Verwaltung

Nachteile:

* abhängig vom Internet
* weniger Datensouveränität

---

### Offline Export

Vorteile:

* einfach

Nachteile:

* keine echte Zusammenarbeit

---

## Begründung

Local First unterstützt:

* Datenschutz
* Geschwindigkeit
* Offline Nutzung
* Nutzerkontrolle

---

## Konsequenzen

Vorteile:

* bessere Nutzererfahrung
* weniger Abhängigkeit

Nachteile:

* komplexere Synchronisation

---

# Beispiel ADR-0002

## Titel

Offene Datenformate

---

## Status

Akzeptiert

---

## Entscheidung

Alle Kernobjekte werden in offenen Formaten gespeichert.

---

## Begründung

Die Nutzer besitzen ihre Daten.

Export und Migration müssen jederzeit möglich sein.

---

# Beispiel ADR-0003

## Titel

KI-Abstraktionsschicht

---

## Status

Akzeptiert

---

## Entscheidung

KI-Funktionen werden über eine austauschbare Schnittstelle integriert.

---

## Begründung

Keine Abhängigkeit von einem einzelnen Anbieter.

Unterstützung für:

* lokale Modelle
* Open Source
* verschiedene Anbieter

---

# Regel

Architekturentscheidungen werden nicht vergessen.

Sie werden dokumentiert.

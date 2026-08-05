# CODING_GUIDELINES.md

# OpenFloorball Coach Platform

## Entwicklungsstandards und Code-Richtlinien

---

# 1. Ziel

Der Code von OpenFloorball Coach soll langfristig verständlich bleiben.

Auch Entwickler, die Jahre später am Projekt arbeiten, müssen nachvollziehen können:

* warum etwas existiert
* wie etwas funktioniert
* wo Änderungen vorgenommen werden

---

# 2. Grundprinzipien

## Lesbarkeit vor Kürze

Bevorzuge:

verständlichen Code

gegenüber:

möglichst wenig Codezeilen

---

## Einfachheit vor Abstraktion

Keine Abstraktionen ohne echten Nutzen.

Nicht:

"Vielleicht brauchen wir das irgendwann."

Sondern:

"Wir brauchen diese Struktur jetzt."

---

## Klare Verantwortlichkeiten

Jede Komponente und jedes Modul besitzt eine eindeutige Aufgabe.

Vermeiden:

* riesige Komponenten
* vermischte Logik
* globale Seiteneffekte

---

# 3. Projektstruktur

Empfohlene Struktur:

```text id="8r8x6r"
/src

/components

/features

/domain

/services

/hooks

/lib

/types

/tests
```

---

# 4. Architekturregeln

## Domain Logic

Fachliche Logik gehört nicht direkt in UI-Komponenten.

Beispiel:

Nicht:

```text id="4sl7o4"
Button klickt
→ berechnet Taktik
→ speichert Daten
```

Besser:

```text id="okv6or"
Button

↓

Use Case

↓

Domain Logic

↓

Storage
```

---

# 5. Komponenten-Regeln

Komponenten sollen:

* klein
* verständlich
* wiederverwendbar

sein.

---

Vermeiden:

Komponenten mit:

* 1000+ Zeilen
* vielen Zuständen
* mehreren Aufgaben

---

# 6. Naming

Namen müssen Bedeutung vermitteln.

Gut:

```text id="1qv0ut"
PlayerPositionEditor

TacticTimeline

TrainingSessionCard
```

Schlecht:

```text id="5v7ewr"
Thing

Manager

Helper2
```

---

# 7. TypeScript Regeln

Bevorzugt:

* strikte Typisierung
* Interfaces für Datenmodelle
* keine unnötigen any-Typen

---

Vermeiden:

```typescript id="myc9xh"
any
```

wenn eine genaue Definition möglich ist.

---

# 8. Datenmodellierung

Datenobjekte müssen:

* klar definiert
* dokumentiert
* versionierbar

sein.

---

Beispiel:

```typescript id="j0z6o6"
interface Tactic {
 id: string;
 name: string;
 scenes: Scene[];
}
```

---

# 9. Fehlerbehandlung

Fehler dürfen nicht ignoriert werden.

Schlecht:

```typescript id="n4g1yy"
catch {}
```

---

Besser:

* Fehler erfassen
* Nutzer informieren
* technische Details loggen

---

# 10. Logging

Logs müssen helfen.

Nicht speichern:

* Passwörter
* private Inhalte
* sensible Daten

---

# 11. State Management

Regeln:

Lokaler Zustand:

für UI-Zustände.

Globaler Zustand:

für gemeinsam genutzte Anwendungselemente.

Serverdaten:

über definierte Datenzugriffsschicht.

---

# 12. API Regeln

Jede API benötigt:

* klare Eingaben
* klare Ausgaben
* Validierung
* Fehlerfälle

---

# 13. Validierung

Keine Nutzereingabe ungeprüft verarbeiten.

Prüfen:

* Typ
* Länge
* Format
* Berechtigung

---

# 14. Tests

Neue Funktionen benötigen Tests.

---

## Unit Tests

Für:

* Berechnungen
* Logik
* Transformationen

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

---

# 15. Testfälle aus Nutzersicht

Beispiele:

## Taktik erstellen

Test:

Trainer erstellt neue Taktik und speichert sie.

---

## Spieler bewegen

Test:

Spieler kann verschoben werden.

---

## Export

Test:

Taktik kann exportiert und wieder importiert werden.

---

# 16. Git-Regeln

Commits sollen:

* klein
* verständlich
* thematisch geschlossen

sein.

---

Beispiel:

Gut:

```text
Add player drag interaction
```

Schlecht:

```text
Changes
```

---

# 17. Pull Request Regeln

Jeder größere PR beschreibt:

## Problem

Was soll gelöst werden?

---

## Lösung

Wie wurde es umgesetzt?

---

## Auswirkungen

Welche Bereiche ändern sich?

---

## Tests

Was wurde geprüft?

---

# 18. Security Regeln

Vor jedem Merge prüfen:

* Berechtigungen
* Datenzugriffe
* Eingaben
* externe Abhängigkeiten

---

# 19. Datenschutz im Code

Code muss Datenschutz unterstützen.

Beispiele:

Gut:

```text
Spieler-ID speichern
```

Schlechter:

```text
unnötige persönliche Details speichern
```

---

# 20. Dokumentation im Code

Kommentiere nicht offensichtlichen Code.

Erkläre:

Warum?

Nicht:

Was?

---

Schlecht:

```typescript
// erhöht i um 1
i++;
```

Gut:

```typescript
// Spielerposition wird nach jeder Bewegung aktualisiert,
// damit Animationen synchron bleiben
```

---

# 21. Abhängigkeiten

Neue Libraries benötigen Prüfung:

* Lizenz
* Wartung
* Sicherheit
* Nutzen

---

# 22. Performance

Beachte:

* unnötige Renderings vermeiden
* große Dateien optimieren
* Daten sparsam laden

---

# 23. Open-Source-Qualität

Code soll so geschrieben sein, dass externe Entwickler ihn verstehen können.

---

# 24. Regel für Claude Code

Vor jeder Implementierung:

1. Architektur prüfen
2. bestehende Muster suchen
3. kleinste sinnvolle Änderung wählen
4. testen
5. dokumentieren

---

# 25. Leitgedanke

Guter Code ist nicht der Code, der heute schnell geschrieben wird.

Guter Code ist der Code, den jemand in fünf Jahren noch versteht.

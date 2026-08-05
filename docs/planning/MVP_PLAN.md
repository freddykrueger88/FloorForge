# MVP_PLAN.md

# OpenFloorball Coach Platform

## Minimum Viable Product – Definition, erste 30 Tage und Entwicklungsplan

> Zusammengeführt aus MVP_PLAN.md, MVP_DEFINITION.md und
> FIRST_30_DAYS_PLAN.md im Zuge der Dokument-Konsolidierung nach der
> Projektanalyse. Die drei Dokumente widersprachen sich an zwei
> Stellen, die hier explizit aufgelöst wurden:
> 1. **Export-Reihenfolge**: MVP_PLAN nannte PNG/PDF/JSON gleichrangig
>    in Sprint 7, FIRST_30_DAYS_PLAN nur JSON als "erste Version" in
>    Woche 4. Aufgelöst zugunsten von FIRST_30_DAYS_PLAN: JSON-Export
>    ist Teil der ersten 30 Tage, PNG/PDF sind bewusst ein Fast-Follow
>    danach (siehe Abschnitt 9).
> 2. **Zwei parallele Zeitpläne** (Sprints 1–8 vs. Woche 1–4): zu einer
>    durchgehenden Zeitleiste zusammengeführt (siehe Abschnitt 9) statt
>    zwei separate, sich überlappende Aufteilungen zu pflegen.

---

# 1. MVP-Ziel

Das erste Ziel ist nicht, die komplette Plattform zu bauen. Das erste Ziel ist:

> Ein Floorball-Trainer kann innerhalb weniger Minuten eine Taktik digital erstellen, speichern, bearbeiten und erklären.

Wenn dieses Problem hervorragend gelöst ist, wird die Plattform erweitert. Das MVP ist nicht die fertige Plattform – es ist die erste stabile Grundlage.

**Kernfrage**, die das MVP beantworten muss: "Kann ein Floorball-Trainer seine Idee schneller und verständlicher vermitteln?"

---

# 2. Nutzergruppe

Primäre Nutzer: Trainer (Jugendtrainer, Vereinstrainer, Assistenztrainer).

Sekundäre Nutzer: Spieler, Trainerteams.

---

# 3. MVP-Fokus

Der MVP konzentriert sich auf drei Kernbereiche:

1. Virtuelles Floorball-Taktikboard
2. Speicherung und Verwaltung von Taktiken
3. Teilen und Wiederverwenden von Inhalten

---

# 4. MVP-Funktionen

## 4.1 Digitales Floorball-Taktikboard (Spielfeldeditor)

Unterstützung für: offizielles Floorballfeld, Angriffsrichtung, Zonen, Mittellinie, Tore.

Der Nutzer kann: Spielfeld anzeigen, Spieler platzieren, Ball platzieren, Gegner darstellen, Laufwege zeichnen, Passwege zeichnen. Spielerobjekte können hinzugefügt, verschoben, benannt und nummeriert werden (eigener Spieler, Gegner, Torhüter).

**Akzeptanzkriterien**: ✅ Spielfeld sichtbar ✅ Objekte bewegbar ✅ Bewegungen speicherbar ✅ Darstellung wiederherstellbar

## 4.2 Zeichenwerkzeuge

Unterstützung für Bewegung (Laufwege, Richtungen, Geschwindigkeit), Ballaktionen (Pass, Schuss, Ballführung), Markierungen (Zonen, Hinweise, Texte).

## 4.3 Szenensystem

Eine Taktik kann mehrere Szenen enthalten (z.B. Ausgangssituation → Bewegung → Abschluss).

**Akzeptanzkriterien**: Der Trainer kann zwischen Szenen wechseln.

## 4.4 Animation

Minimal: Start, Pause, Zurück, Wiederholen. Später: Zeitachsen, Geschwindigkeit, mehrere Animationsebenen.

## 4.5 Taktiken speichern

Ein Trainer kann eine neue Taktik erstellen, einen Namen vergeben, eine Beschreibung hinzufügen, speichern und erneut öffnen. MVP unterstützt lokale Speicherung, Export und Import im JSON-Format.

**Akzeptanzkriterien**: Eine gespeicherte Taktik bleibt nach Neustart verfügbar.

## 4.6 Export einer Taktik

Ziel: Teilen, Backup, Austausch. Bevorzugtes Format: offenes, lesbares Datenformat (siehe Abschnitt 9 zur zeitlichen Reihenfolge JSON → PNG/PDF).

## 4.7 Grundlegende Benutzerverwaltung

Unterstützen: Benutzerkonto, Anmeldung, einfache Rollen.

**Nicht im MVP**: komplexes Rechtesystem, große Organisationsverwaltung.

## 4.8 Responsive Nutzung

Die Anwendung funktioniert auf Tablet und Desktop – Priorität: Tablet zuerst.

---

# 5. Bewusst nicht im MVP

* komplexe KI (automatische Taktikerstellung, Spielanalyse, Spielerbewertung)
* Videoanalyse / Videoplattform (Streaming)
* Heatmaps, automatische Spieleranalyse
* umfangreiche Statistiken (Leistungsdaten, Scouting, Rankings)
* soziale Netzwerke (öffentliche Profile, Follower, Likes)
* komplexe Vereinsverwaltung

Grund: Der Kernnutzen muss zuerst bewiesen werden.

---

# 6. MVP-Nutzerfluss

```text
Registrieren
  ↓
Neues Taktikboard erstellen / Floorballfeld auswählen
  ↓
Spieler platzieren
  ↓
Laufweg / Bewegungen einzeichnen
  ↓
Animation abspielen
  ↓
Speichern
  ↓
Erneut öffnen
  ↓
Exportieren oder teilen
```

---

# 7. Technischer MVP-Stack

Siehe TECH_STACK.md für die vollständige, begründete Technologieauswahl. Kurzfassung für den MVP:

* **Frontend**: TypeScript, React, Next.js, Tailwind CSS
* **Zeichenengine**: Konva.js, Fabric.js oder SVG-basierte Eigenentwicklung (Bewertungskriterien: Performance, Touch-Unterstützung, Animation, Export)
* **Backend**: Option A – Local First ohne Backend; Option B – leichtes Backend mit Node.js + PostgreSQL

---

# 8. MVP-Datenmodell

```text
User → Tactic → Scene → Objects
```

```json
// Tactic
{ "id": "", "name": "", "created": "", "updated": "", "scenes": [] }

// Scene
{ "id": "", "objects": [], "duration": 10 }

// Object
{ "type": "player", "position": {}, "properties": {} }
```

---

# 9. Entwicklungsplan: die ersten 30 Tage

Entwicklungsprinzip: Grundlage → Architektur → Kernfunktion → Nutzerfeedback → Erweiterung.

## Woche 1 – Fundament

**Ziel**: Ein professionelles Entwicklungssetup erstellen.

* Repository, Branch-Struktur, README, Lizenzdatei, Dokumentationsordner (siehe REPOSITORY_STRUCTURE.md für die kanonische Ordnerstruktur)
* Entwicklungsumgebung: TypeScript, Framework, Linter, Formatter, Testing Framework

**Ergebnis**: Ein Entwickler kann Projekt starten, Code schreiben, Tests ausführen, Dokumentation lesen.

## Woche 2 – Design und Architektur

**Ziel**: Die visuelle und technische Grundlage schaffen.

* Designsystem: Farben, Typografie, Buttons, Navigation, Karten, Dialoge (siehe DESIGN_SYSTEM.md)
* Grundseiten: Dashboard, Taktikbereich, Trainingsbereich, Einstellungen
* Architektur: Datenfluss, Komponentenstruktur, Feature-Struktur

**Ergebnis**: Eine leere, aber professionelle Anwendung.

## Woche 3 – Erstes Taktikboard

**Ziel**: Der wichtigste Kern wird sichtbar.

* Spielfeld: Floorballfeld, Linien, Tore, Orientierung
* Interaktion: Zoom, Verschieben, Touch-Bedienung
* Erste Objekte: Spieler, Gegner, Torhüter

**Ergebnis**: Ein Trainer kann ein Feld öffnen, Spieler platzieren, Positionen verändern.

## Woche 4 – Erste echte Taktik

**Ziel**: Vom Zeichenbrett zur nutzbaren Taktik.

* Bewegungen: Laufwege, Pfeile, Passwege
* Speicherung: lokale Speicherung, Laden, Löschen
* Export: erste Version – **nur JSON** (PNG/PDF folgen danach, siehe unten)

**Ergebnis**: Ein Trainer kann Taktik erstellen, speichern, erneut öffnen, teilen.

## Woche 5+ (Fast-Follow, nicht mehr Teil der ersten 30 Tage)

* Szenensystem vertiefen: mehrere Szenen speichern/wechseln/verwalten
* Animation vertiefen: Timeline-Grundlage
* Export erweitern: PNG, PDF (zusätzlich zu JSON)
* Qualität: Tests, Performance, Accessibility

---

# 10. Nach 30 Tagen muss funktionieren

**Kernfunktion**: Ein Trainer kann eine Floorball-Situation digital darstellen.

**Noch nicht erforderlich**: KI, Community, Videoanalyse, komplexe Statistiken, Vereinsverwaltung.

---

# 11. Definition of Done

Eine MVP-Funktion ist fertig, wenn:

* **Funktion** – sie funktioniert vollständig
* **Qualität** – Tests, Dokumentation, Fehlerbehandlung vorhanden
* **Datenschutz** – geprüft, welche Daten gespeichert werden und warum
* **UX** – ein Trainer versteht die Funktion ohne Erklärung

---

# 12. Qualitätsprüfung nach 30 Tagen

* **Technik**: Ist die Architektur sauber?
* **UX**: Kann ein Trainer ohne Erklärung starten?
* **Datenschutz**: Werden unnötige Daten gespeichert?
* **Open Source**: Kann ein Fremder das Projekt verstehen?

---

# 13. Erfolgsmessung

Nicht messen: Anzahl der Funktionen.

Messen: Können Trainer damit arbeiten? Verstehen Spieler die Darstellung? Spart es Zeit? Wird es wieder verwendet?

Der MVP ist erfolgreich, wenn ein Trainer sagt: "Ich kann meine Floorball-Idee besser erklären als mit Papier oder einer normalen Zeichnung – und schneller als vorher."

---

# 14. Testgruppe und Feedback

Empfohlen: kleine Gruppe von 3–10 Trainern mit unterschiedlichen Erfahrungsstufen.

Feedbackfragen – nicht nur "Gefällt es?", sondern:

* Welche Aufgabe wurde einfacher? / Welche Aufgabe wolltet ihr lösen?
* Wo entstehen Probleme? / Wo wart ihr schneller?
* Welche Funktion fehlt wirklich? / Was hat gefehlt? Was war unverständlich?
* Würdet ihr es im Training einsetzen?

Nach 30 Tagen nicht sofort skalieren – erste Rückmeldungen von aktiven Trainern, Jugendtrainern und Vereinen sammeln, dann priorisieren: verbessern, vereinfachen oder erweitern.

---

# 15. Entwicklerregel / Claude-Code-Arbeitsregel

Nicht fragen: "Welche Technologie können wir verwenden?" Sondern: "Welches Trainerproblem lösen wir?"

Während der MVP-Entwicklung nicht erweitern, bevor der Kern funktioniert. Bei einer neuen Idee fragen:

1. Hilft sie dem MVP-Ziel?
2. Ist sie notwendig?
3. Kann sie warten?

---

# 16. Leitgedanke

Ein kleines funktionierendes Werkzeug ist wertvoller als eine große unfertige Plattform.

Die ersten 30 Tage bauen keine fertige Plattform – sie bauen den Kern, auf dem eine gute Plattform entstehen kann.

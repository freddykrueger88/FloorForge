# DATABASE_ARCHITECTURE.md

# OpenFloorball Coach Platform

## Datenbankarchitektur und Datenmanagement

---

# 1. Ziel

Die Datenbank bildet die Grundlage für:

* Taktiken
* Trainingsplanung
* Vereine
* Teams
* Benutzer
* Wissensbibliothek

---

# 2. Grundprinzipien

Die Datenbank folgt:

* Datenminimierung
* klare Beziehungen
* Erweiterbarkeit
* Exportierbarkeit
* sichere Trennung von Daten

---

# 3. Architekturprinzip

Die Plattform verwendet eine getrennte Struktur:

```text id="8p4m7x"

Frontend

↓

API

↓

Business Logic

↓

Database

```

---

# 4. Datenbankanforderungen

Die Datenbank muss unterstützen:

* relationale Daten
* Versionierung
* Migrationen
* Transaktionen
* Suche

---

# 5. Empfohlenes Modell

Primär:

relationale Datenbank

---

Geeignet für:

* Benutzer
* Vereine
* Teams
* Rechte
* Inhalte

---

# 6. Haupttabellen

Übersicht:

```text id="3k9m5q"

users

clubs

teams

players

tactics

scenes

trainings

drills

library_items

permissions

versions

```

---

# 7. Benutzer Tabelle

Beispiel:

```sql id="7q2m8n"

users

id

username

email

password_hash

created_at

updated_at

```

---

# 8. Vereinsstruktur

Beziehung:

```text id="5n8r3p"

Club

↓

Teams

↓

Spieler

```

---

# 9. Teams

Beispiel:

```sql id="2m6k9v"

teams

id

club_id

name

age_group

created_at

```

---

# 10. Spieler

Minimalprinzip.

Beispiel:

```sql id="4p7x1m"

players

id

team_id

display_name

position

```

---

# 11. Keine unnötigen Felder

Nicht standardmäßig speichern:

* Geburtsdatum
* Adresse
* private Informationen

---

# 12. Taktikmodell

Eine Taktik besteht aus:

```text id="6q9m2k"

Tactic

↓

Scenes

↓

Objects

↓

Actions

```

---

# 13. Taktik Tabelle

Beispiel:

```sql id="9v3p6r"

tactics

id

owner_id

title

category

visibility

created_at

```

---

# 14. Szenen

Eine Taktik kann mehrere Szenen besitzen.

Beispiel:

```sql id="1m8q4s"

scenes

id

tactic_id

order_number

duration

```

---

# 15. Spielfeldobjekte

Objekte werden flexibel gespeichert.

Beispiele:

* Spieler
* Ball
* Gegner
* Markierungen

---

Beispiel:

```json id="5r2n7m"
{
"type":"player",
"x":40,
"y":60
}
```

---

# 16. Trainingsmodell

Struktur:

```text id="8m5q1z"

Training

↓

Exercises

↓

Coaching Points

```

---

# 17. Bibliothek

Gemeinsame Wissensbasis.

Beispiele:

* Übungen
* Taktiken
* Dokumente

---

# 18. Versionierung

Wichtige Inhalte speichern:

* Version
* Autor
* Zeitpunkt
* Änderung

---

Beispiel:

```text id="3q7m9p"

Taktik v1

↓

Taktik v2

↓

Taktik v3

```

---

# 19. Soft Delete

Wenn notwendig:

Nicht sofort physisch löschen.

---

Vorteile:

* Wiederherstellung
* Fehlerkorrektur

---

# 20. Datenschutz und Datenbank

Grundsatz:

Keine Daten speichern, die nicht benötigt werden.

---

# 21. Mandantenfähigkeit

Vereine müssen getrennt bleiben.

Beispiel:

```text id="4x8n2k"

Verein A

|

Verein B

```

---

Ein Verein darf niemals automatisch Daten eines anderen sehen.

---

# 22. Berechtigungen

Berechtigungen können auf mehreren Ebenen existieren:

* Benutzer
* Verein
* Team
* Inhalt

---

# 23. Synchronisationsdaten

Für Offline-Unterstützung notwendig:

Beispiele:

* Änderungszeitpunkt
* Version
* Synchronisationsstatus

---

# 24. Migrationen

Jede Datenänderung benötigt:

* Migration
* Dokumentation
* Test

---

# 25. Backup

Backups müssen:

* regelmäßig erfolgen
* geprüft werden
* geschützt sein

---

# 26. Suche

Die Datenbank unterstützt:

* Titel
* Tags
* Kategorien
* Inhalte

---

Später möglich:

semantische Suche.

---

# 27. Performance

Beachten:

* Indexierung
* effiziente Abfragen
* große Bibliotheken

---

# 28. Datenexport

Alle wichtigen Daten müssen exportierbar sein.

---

Beispiele:

```text id="6k4p8m"

JSON

CSV

offene Formate

```

---

# 29. Open-Source-Anforderungen

Keine proprietären Datenformate.

---

Datenmodell muss:

* dokumentiert
* verständlich
* migrierbar

sein.

---

# 30. Claude-Code-Regeln

Vor jeder Datenbankänderung prüfen:

1. Brauchen wir diese Daten wirklich?
2. Welche Beziehung entsteht?
3. Wie wird gelöscht?
4. Wie wird exportiert?
5. Wie funktioniert Offline-Synchronisation?

---

# 31. Leitgedanke

Eine gute Datenbank speichert nicht möglichst viele Informationen.

Sie speichert die richtigen Informationen in einer verständlichen Struktur.

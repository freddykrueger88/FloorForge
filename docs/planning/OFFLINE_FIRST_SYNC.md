# OFFLINE_FIRST_SYNC.md

# OpenFloorball Coach Platform

## Offline-First Architektur und Synchronisation

---

# 1. Ziel

OpenFloorball Coach soll auch ohne permanente Internetverbindung zuverlässig funktionieren.

Typische Situationen:

* Trainer in der Sporthalle
* schlechte WLAN-Verbindung
* mobile Nutzung
* Vereinsserver nicht erreichbar

---

# 2. Grundprinzip

Die Anwendung folgt dem Prinzip:

> Arbeiten funktioniert immer. Synchronisation passiert, wenn sie möglich ist.

---

# 3. Architekturprinzip

Nicht:

```text id="4r9m2p"

App

↓

Server

↓

Daten

```

---

Sondern:

```text id="8v3k6n"

App

↓

Lokaler Speicher

↓

Synchronisation

↓

Server

```

---

# 4. Lokale Datenhaltung

Die Anwendung besitzt einen lokalen Datenspeicher.

Geeignet:

* IndexedDB
* lokale Datenbank
* verschlüsselter Speicher

---

Lokale Speicherung für:

* Taktiken
* Szenen
* Übungen
* Trainingspläne

---

# 5. Local First

Der Nutzer soll nicht merken:

"Ich bin offline."

---

Beispiele:

Trainer kann:

* Taktik öffnen
* Spieler bewegen
* Animation starten
* Notizen hinzufügen

---

# 6. Synchronisationsmodell

Synchronisation erfolgt:

* automatisch
* kontrolliert
* nachvollziehbar

---

Ablauf:

```text id="9x1d5v"

Lokale Änderung

↓

Änderung markieren

↓

Verbindung prüfen

↓

Synchronisieren

↓

Bestätigung

```

---

# 7. Änderungsverfolgung

Jede Änderung benötigt Metadaten.

Beispiel:

```typescript id="7p3m8q"
Change {

 id

 objectId

 timestamp

 deviceId

 operation

}
```

---

# 8. Konfliktlösung

Konflikte können entstehen:

Beispiel:

Trainer A ändert Taktik.

Trainer B ändert dieselbe Taktik.

---

Nicht automatisch:

Eine Version überschreiben.

---

Stattdessen:

Konflikt anzeigen.

---

# 9. Konfliktansicht

Beispiel:

```text id="3z6n8a"

Version A:

Powerplay links

↓

Version B:

Powerplay rechts

```

---

Der Nutzer entscheidet.

---

# 10. Geräteverwaltung

Ein Nutzer kann mehrere Geräte verwenden.

Beispiele:

* Laptop
* Tablet
* Smartphone

---

Das System erkennt:

* Gerät
* letzte Synchronisation
* Status

---

# 11. Offline-Sicherheit

Lokale Daten müssen geschützt werden.

Maßnahmen:

* sichere Speicherung
* Zugriffsschutz
* automatische Sperren

---

# 12. Datenschutz

Offline bedeutet nicht:

Alles speichern.

---

Auch lokal gilt:

* Datenminimierung
* Löschbarkeit
* Zugriffskontrolle

---

# 13. Synchronisationsumfang

Nicht alles muss sofort synchronisiert werden.

Priorisierung:

---

## Wichtig

* Taktiken
* Trainingspläne

---

## Optional

* Vorschaubilder
* größere Medien

---

# 14. Medienstrategie

Videos und große Dateien benötigen besondere Behandlung.

Möglichkeiten:

* lokale Referenzen
* Streaming
* verzögerte Synchronisation

---

# 15. Versionshistorie

Wichtige Inhalte können Versionen speichern.

Beispiel:

```text id="4k9s2m"

Taktik Version 1

↓

Taktik Version 2

↓

Taktik Version 3

```

---

# 16. Backup

Offline-Daten dürfen nicht verloren gehen.

Unterstützen:

* manuellen Export
* automatische Sicherung
* Wiederherstellung

---

# 17. Export als Sicherheitsnetz

Jeder Nutzer kann seine Inhalte exportieren.

Beispiele:

* komplette Bibliothek
* einzelne Taktik
* Trainingssammlung

---

# 18. Offline UX

Der Nutzer muss erkennen:

Status:

* synchronisiert
* wartet
* Konflikt
* Fehler

---

Beispiel:

```text id="5q8m1r"

✓ Gespeichert

⟳ Synchronisierung wartet

⚠ Konflikt benötigt Entscheidung

```

---

# 19. Technische Grenzen

Die Offline-Funktion darf nicht führen zu:

* unkontrolliertem Datenwachstum
* Sicherheitsproblemen
* komplizierter Bedienung

---

# 20. Server-Synchronisation

Der Server bleibt:

* zentrale gemeinsame Quelle
* Speicher für Teams
* Austauschpunkt

---

Aber:

Nicht zwingend für jede Aktion notwendig.

---

# 21. Zukunftserweiterungen

Möglich:

* Peer-to-Peer Austausch
* lokales Vereinsnetzwerk
* QR-Code Export
* direkte Geräteübertragung

---

# 22. Claude-Code-Regeln

Bei jeder neuen Funktion prüfen:

1. Muss sie offline funktionieren?
2. Welche Daten müssen lokal verfügbar sein?
3. Wie wird synchronisiert?
4. Was passiert bei Konflikten?
5. Kann der Nutzer seine Daten behalten?

---

# 23. Leitgedanke

Eine gute Sportsoftware funktioniert nicht nur im Büro.

Sie funktioniert dort, wo Sport passiert.

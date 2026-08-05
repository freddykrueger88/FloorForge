# DEPLOYMENT_AND_HOSTING.md

# OpenFloorball Coach Platform

## Deployment-, Hosting- und Betriebsstrategie

---

# 1. Ziel

OpenFloorball soll einfach betreibbar sein:

* für Entwickler
* für Vereine
* für Organisationen
* für öffentliche Installationen

---

# 2. Grundprinzipien

Der Betrieb folgt:

* Open Source
* Transparenz
* EU-Datenschutz
* Sicherheit
* Portabilität

---

# 3. Hosting-Philosophie

Die Plattform darf nicht von einem einzelnen Anbieter abhängig sein.

---

Ziele:

* Self Hosting möglich
* Anbieterwechsel möglich
* offene Standards

---

# 4. Betriebsmodelle

Unterstützt werden:

---

## Modell A: Vereinsbetrieb

Ein Verein betreibt seine eigene Instanz.

Geeignet für:

* größere Vereine
* Verbände
* Akademien

---

## Modell B: Gemeinschaftliches Hosting

Mehrere Vereine nutzen eine Plattform.

Mit:

* sauberer Datentrennung
* eigenen Bereichen

---

## Modell C: Entwicklerumgebung

Für:

* Beiträge
* Tests
* Weiterentwicklung

---

# 5. Containerisierung

Bevorzugt:

Container-basierter Betrieb.

Beispiel:

```text id="5m8q3q"

Frontend

↓

Backend

↓

Database

↓

Storage

```

---

# 6. Docker-Unterstützung

Das Projekt sollte enthalten:

* Dockerfile
* Compose-Konfiguration
* Entwicklungsumgebung

---

# 7. Umgebungen

Trennung:

```text id="7q2m9x"

Development

↓

Testing

↓

Production

```

---

# 8. Konfiguration

Keine sensiblen Daten im Code.

Beispiele:

Nicht speichern:

* Passwörter
* API-Schlüssel
* Tokens

---

Verwenden:

* Environment Variables
* Secret Management

---

# 9. Datenbankbetrieb

Anforderungen:

* regelmäßige Backups
* sichere Updates
* Migrationen

---

# 10. Dateispeicher

Für:

* Bilder
* Videos
* Dokumente

---

Anforderungen:

* Zugriffskontrolle
* Löschbarkeit
* Größenlimits

---

# 11. EU-Hosting

Bevorzugen:

* Rechenzentren innerhalb EU
* transparente Datenschutzbedingungen

---

Vor Nutzung prüfen:

* Auftragsverarbeitung
* Sicherheitsstandards
* Datenstandort

---

# 12. Self Hosting

Ein Verein sollte die Möglichkeit haben:

```text id="4n8p2k"

Server

↓

Installation

↓

Konfiguration

↓

Betrieb

```

---

# 13. Update-System

Updates müssen:

* nachvollziehbar
* sicher
* rücksetzbar

sein.

---

# 14. Release-Prozess

Ablauf:

```text id="9r3m6v"

Entwicklung

↓

Tests

↓

Release Candidate

↓

Veröffentlichung

```

---

# 15. Backup-Strategie

Backups für:

* Datenbank
* Dateien
* Konfiguration

---

Regeln:

* regelmäßig
* verschlüsselt
* getestet

---

# 16. Wiederherstellung

Ein Backup ist nur wertvoll, wenn Wiederherstellung funktioniert.

Testen:

* Datenbank Restore
* Dateiwiederherstellung
* Systemstart

---

# 17. Monitoring

Überwachen:

* Verfügbarkeit
* Fehler
* Systemzustand

---

Nicht überwachen:

* unnötiges Nutzerverhalten

---

# 18. Logging

Logs enthalten:

* technische Ereignisse
* Fehler
* Systeminformationen

---

Nicht enthalten:

* Passwörter
* private Inhalte
* sensible Nutzerdaten

---

# 19. Performance

Beobachten:

* Ladezeiten
* Datenbankleistung
* Speicherverbrauch

---

# 20. Sicherheit im Betrieb

Regelmäßig:

* Updates einspielen
* Abhängigkeiten prüfen
* Zugriffe kontrollieren

---

# 21. Lizenzierung

Die Software benötigt:

* klare Open-Source-Lizenz
* dokumentierte Beiträge
* transparente Regeln

---

# 22. Abhängigkeiten

Jede Abhängigkeit prüfen:

* Lizenz
* Wartung
* Sicherheitsstatus

---

# 23. Dokumentation

Bereitstellen:

* Installationsanleitung
* Update-Anleitung
* Backup-Anleitung
* Entwicklerdokumentation

---

# 24. Entwicklerfreundlichkeit

Ein neuer Entwickler sollte:

1. Repository klonen
2. Umgebung starten
3. Tests ausführen
4. Änderung machen können

---

# 25. Datenschutz im Betrieb

Administratoren müssen wissen:

* welche Daten existieren
* wo sie liegen
* wie sie gelöscht werden

---

# 26. Cloud-Dienste

Vor Nutzung prüfen:

Fragen:

* Brauchen wir den Dienst?
* Gibt es eine offene Alternative?
* Werden Daten übertragen?

---

# 27. Zukunftssicherheit

Architektur vermeiden:

* proprietäre Datenformate
* Anbieterabhängigkeiten
* geschlossene Systeme

---

# 28. Claude-Code-Regeln

Bei Deployment-Änderungen prüfen:

1. Ist Self Hosting möglich?
2. Sind Daten geschützt?
3. Ist der Betrieb dokumentiert?
4. Können Nutzer migrieren?
5. Werden offene Standards genutzt?

---

# 29. Leitgedanke

Eine offene Plattform gehört nicht nur denen, die sie entwickeln.

Sie gehört auch denen, die sie betreiben und nutzen.

# DEPLOYMENT.md

# OpenFloorball Coach Platform

## Deployment-, Hosting- und Betriebsstrategie

---

# 1. Ziel

OpenFloorball Coach soll flexibel betrieben werden können.

Unterstützte Szenarien:

* lokale Entwicklung
* eigener Vereinsserver
* private Cloud
* öffentliche Hosting-Umgebung

---

# 2. Betriebsprinzipien

Der Betrieb folgt diesen Regeln:

* Nutzer behalten Kontrolle über ihre Daten
* keine unnötige Cloud-Abhängigkeit
* transparente Infrastruktur
* sichere Updates
* einfache Wiederherstellung

---

# 3. Betriebsmodelle

## Modell A – Lokaler Betrieb

Geeignet für:

* Entwicklung
* kleine Vereine
* Tests

Beispiel:

```text
Trainer-PC

↓

Docker Umgebung

↓

OpenFloorball
```

---

## Modell B – Vereinsserver

Geeignet für:

* Vereine
* Schulen
* Verbände

Beispiel:

```text
Verein

↓

eigener Server

↓

OpenFloorball

↓

eigene Daten
```

---

## Modell C – Managed Hosting

Geeignet für:

* größere Organisationen
* mehrere Teams
* professionelle Nutzung

Grundregel:

Auch beim Hosting bleiben Datenhoheit und Transparenz erhalten.

---

# 4. Containerstrategie

Standard:

Docker

---

Ziel:

Eine Installation soll reproduzierbar sein.

---

Beispiel:

```text
docker-compose.yml

|

├── frontend

├── backend

├── database

├── storage

└── monitoring
```

---

# 5. Entwicklungsumgebung

Lokaler Start:

Ein Entwickler benötigt:

* Git
* Docker
* Node.js
* Paketmanager

---

Ziel:

Ein neuer Entwickler kann das Projekt schnell starten.

---

# 6. Umgebungen

Es gibt mindestens drei Umgebungen:

---

## Development

Für:

* Entwicklung
* Experimente

---

## Testing

Für:

* automatische Tests
* Qualitätssicherung

---

## Production

Für:

* echte Nutzer
* echte Daten

---

# 7. Konfiguration

Keine geheimen Daten im Code.

Nicht:

```text
Passwörter im Repository
```

---

Verwenden:

* Environment Variables
* Secret Management

---

# 8. Datenbankbetrieb

Standard:

PostgreSQL

---

Anforderungen:

* regelmäßige Backups
* Migrationen
* Verschlüsselung
* Zugriffskontrolle

---

# 9. Backup-Strategie

Backups müssen enthalten:

* Datenbank
* Benutzerinhalte
* Taktiken
* Trainingsdaten
* Medien

---

Backup-Regeln:

* automatisiert
* verschlüsselt
* regelmäßig getestet

---

# 10. Wiederherstellung

Ein Backup ist nur wertvoll, wenn es zurückgespielt werden kann.

Regel:

Recovery-Prozesse regelmäßig testen.

---

# 11. Updates

Updates müssen sicher erfolgen.

Ablauf:

```text
Neue Version

↓

Tests

↓

Backup

↓

Update

↓

Kontrolle
```

---

# 12. Versionierung

Verwenden:

Semantic Versioning

Beispiel:

```text
1.4.2
```

Bedeutung:

Major.Minor.Patch

---

# 13. Monitoring

Monitoring soll technische Probleme erkennen.

Beobachten:

* Systemzustand
* Fehler
* Geschwindigkeit
* Speicher

---

Nicht überwachen:

* Trainingsverhalten
* persönliche Aktivitäten
* unnötige Nutzerdaten

---

# 14. Logging

Logs enthalten nur notwendige Informationen.

Keine Speicherung von:

* Passwörtern
* privaten Inhalten
* unnötigen Personeninformationen

---

# 15. Datenschutz im Betrieb

Pflichten:

* Datenminimierung
* Löschbarkeit
* Zugriffskontrolle
* Transparenz

---

# 16. Rechteverwaltung

Zugriffe nach Prinzip:

"Nur was notwendig ist."

---

Beispiele:

Trainer:

* eigene Teams
* eigene Inhalte

Administrator:

* Verwaltung

Spieler:

* freigegebene Inhalte

---

# 17. Sicherheit

Regelmäßige Prüfungen:

* Abhängigkeiten
* Sicherheitsupdates
* Berechtigungen
* Konfiguration

---

# 18. Skalierung

Nicht früh überdimensionieren.

Start:

eine stabile Anwendung.

---

Später:

* mehrere Instanzen
* Caching
* verteilte Systeme

---

# 19. Offline First

Besonderer Fokus:

Sportumgebungen haben nicht immer perfekte Verbindung.

Unterstützen:

* lokale Speicherung
* Synchronisation
* Konfliktlösung

---

# 20. Export und Migration

Ein Nutzer muss seine Daten jederzeit mitnehmen können.

Unterstützen:

* kompletter Export
* offene Formate
* Import in andere Systeme

---

# 21. Abhängigkeiten

Externe Dienste werden dokumentiert.

Für jede Abhängigkeit prüfen:

* Lizenz
* Datenschutz
* Verfügbarkeit
* Alternative

---

# 22. Disaster Recovery

Für kritische Systeme:

Dokumentieren:

* Wiederherstellung
* Verantwortlichkeiten
* Notfallmaßnahmen

---

# 23. Hosting-Grundsatz

Die Plattform darf nicht nur funktionieren, wenn ein einzelner Anbieter existiert.

---

# 24. Claude-Code-Regeln

Bei jeder Infrastrukturänderung prüfen:

1. Ist Self Hosting weiterhin möglich?
2. Werden Daten minimiert?
3. Sind Backups vorhanden?
4. Ist die Änderung dokumentiert?
5. Kann ein anderer Entwickler sie verstehen?

---

# 25. Leitgedanke

Eine gute Plattform ist nicht nur eine Anwendung.

Sie ist ein System, das auch nach Jahren zuverlässig, sicher und unabhängig betrieben werden kann.

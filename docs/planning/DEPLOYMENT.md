# DEPLOYMENT.md

# OpenFloorball Coach Platform

## Deployment-, Hosting- und Betriebsstrategie

> Zusammengeführt aus DEPLOYMENT.md und DEPLOYMENT_AND_HOSTING.md
> (beide Dokumente deckten denselben Inhalt mit fast identischer
> Struktur ab) im Zuge der Dokument-Konsolidierung nach der
> Projektanalyse.

---

# 1. Ziel

OpenFloorball Coach soll flexibel betrieben werden können.

Unterstützte Szenarien:

* lokale Entwicklung
* eigener Vereinsserver
* private Cloud
* öffentliche Hosting-Umgebung
* gemeinschaftliches Hosting mehrerer Vereine (mit sauberer Datentrennung)

---

# 2. Betriebsprinzipien

Der Betrieb folgt diesen Regeln:

* Nutzer behalten Kontrolle über ihre Daten
* keine unnötige Cloud-Abhängigkeit
* transparente Infrastruktur
* sichere Updates
* einfache Wiederherstellung
* Open Source, EU-Datenschutz, Portabilität

---

# 3. Hosting-Philosophie

Die Plattform darf nicht von einem einzelnen Anbieter abhängig sein.

Ziele: Self Hosting möglich, Anbieterwechsel möglich, offene Standards.

---

# 4. Betriebsmodelle

## Modell A – Lokaler Betrieb

Geeignet für: Entwicklung, kleine Vereine, Tests.

```text
Trainer-PC → Docker Umgebung → OpenFloorball
```

---

## Modell B – Vereinsserver

Geeignet für: Vereine, Schulen, Verbände, Akademien. Ein Verein betreibt seine eigene Instanz.

```text
Verein → eigener Server → OpenFloorball → eigene Daten
```

---

## Modell C – Managed / Gemeinschaftliches Hosting

Geeignet für größere Organisationen, mehrere Teams, mehrere Vereine auf einer Plattform –
mit sauberer Datentrennung und eigenen Bereichen je Verein.

Grundregel: Auch beim Hosting bleiben Datenhoheit und Transparenz erhalten.

---

## Modell D – Entwicklerumgebung

Für Beiträge, Tests, Weiterentwicklung.

---

# 5. Containerstrategie

Standard: Docker. Ziel: Eine Installation soll reproduzierbar sein.

```text
docker-compose.yml
├── frontend
├── backend
├── database
├── storage
└── monitoring
```

Das Projekt sollte enthalten: Dockerfile, Compose-Konfiguration, Entwicklungsumgebung.

---

# 6. Entwicklungsumgebung

Ein Entwickler benötigt: Git, Docker, Node.js, Paketmanager.

Ein neuer Entwickler sollte:

1. Repository klonen
2. Umgebung starten
3. Tests ausführen
4. Änderung machen können

---

# 7. Umgebungen

Es gibt mindestens drei Umgebungen:

## Development

Für Entwicklung, Experimente.

## Testing

Für automatische Tests, Qualitätssicherung.

## Production

Für echte Nutzer, echte Daten.

---

# 8. Konfiguration

Keine geheimen Daten im Code (nicht: Passwörter, API-Schlüssel, Tokens im Repository).

Verwenden: Environment Variables, Secret Management.

---

# 9. Datenbankbetrieb

Standard: PostgreSQL.

Anforderungen: regelmäßige Backups, Migrationen, Verschlüsselung, Zugriffskontrolle, sichere Updates.

---

# 10. Dateispeicher

Für Bilder, Videos, Dokumente.

Anforderungen: Zugriffskontrolle, Löschbarkeit, Größenlimits.

---

# 11. EU-Hosting

Bevorzugen: Rechenzentren innerhalb der EU, transparente Datenschutzbedingungen.

Vor Nutzung prüfen: Auftragsverarbeitung, Sicherheitsstandards, Datenstandort.

---

# 12. Backup-Strategie

Backups müssen enthalten: Datenbank, Benutzerinhalte, Taktiken, Trainingsdaten, Medien, Konfiguration.

Backup-Regeln: automatisiert, verschlüsselt, regelmäßig getestet.

---

# 13. Wiederherstellung

Ein Backup ist nur wertvoll, wenn es zurückgespielt werden kann.

Regelmäßig testen: Datenbank-Restore, Dateiwiederherstellung, Systemstart.

---

# 14. Updates

```text
Neue Version → Tests → Backup → Update → Kontrolle
```

Updates müssen nachvollziehbar, sicher und rücksetzbar sein.

---

# 15. Versionierung

Semantic Versioning, z.B. `1.4.2` = Major.Minor.Patch

---

# 16. Release-Prozess

```text
Entwicklung → Tests → Release Candidate → Veröffentlichung
```

---

# 17. Monitoring

Beobachten: Systemzustand, Fehler, Geschwindigkeit, Speicher, Verfügbarkeit, Ladezeiten, Datenbankleistung.

Nicht überwachen: Trainingsverhalten, persönliche Aktivitäten, unnötige Nutzerdaten.

---

# 18. Logging

Logs enthalten nur notwendige technische Informationen (Ereignisse, Fehler, Systeminformationen).

Keine Speicherung von: Passwörtern, privaten Inhalten, unnötigen Personeninformationen.

---

# 19. Datenschutz im Betrieb

Pflichten: Datenminimierung, Löschbarkeit, Zugriffskontrolle, Transparenz.

Administratoren müssen wissen: welche Daten existieren, wo sie liegen, wie sie gelöscht werden.

---

# 20. Rechteverwaltung

Zugriffe nach Prinzip "Nur was notwendig ist":

* Trainer: eigene Teams, eigene Inhalte
* Administrator: Verwaltung
* Spieler: freigegebene Inhalte

---

# 21. Sicherheit im Betrieb

Regelmäßig: Updates einspielen, Abhängigkeiten prüfen, Berechtigungen/Zugriffe kontrollieren, Konfiguration prüfen.

---

# 22. Skalierung

Nicht früh überdimensionieren. Start: eine stabile Anwendung.

Später: mehrere Instanzen, Caching, verteilte Systeme.

---

# 23. Offline First

Sportumgebungen haben nicht immer perfekte Verbindung.

Unterstützen: lokale Speicherung, Synchronisation, Konfliktlösung.

---

# 24. Export und Migration

Ein Nutzer muss seine Daten jederzeit mitnehmen können.

Unterstützen: kompletter Export, offene Formate, Import in andere Systeme.

---

# 25. Lizenzierung

Die Software benötigt: klare Open-Source-Lizenz, dokumentierte Beiträge, transparente Regeln.

---

# 26. Abhängigkeiten

Für jede externe Abhängigkeit/jeden externen Dienst prüfen: Lizenz, Datenschutz, Wartungsstatus, Verfügbarkeit, Alternative.

---

# 27. Cloud-Dienste

Vor Nutzung eines Cloud-Dienstes prüfen:

* Brauchen wir den Dienst wirklich?
* Gibt es eine offene Alternative?
* Werden Daten übertragen – wohin?

---

# 28. Disaster Recovery

Für kritische Systeme dokumentieren: Wiederherstellung, Verantwortlichkeiten, Notfallmaßnahmen.

---

# 29. Dokumentation

Bereitstellen: Installationsanleitung, Update-Anleitung, Backup-Anleitung, Entwicklerdokumentation.

---

# 30. Hosting-Grundsatz

Die Plattform darf nicht nur funktionieren, wenn ein einzelner Anbieter existiert.

---

# 31. Zukunftssicherheit

Architektur vermeiden: proprietäre Datenformate, Anbieterabhängigkeiten, geschlossene Systeme.

---

# 32. Claude-Code-Regeln

Bei jeder Infrastruktur-/Deployment-Änderung prüfen:

1. Ist Self Hosting weiterhin möglich?
2. Werden Daten minimiert/geschützt?
3. Sind Backups vorhanden?
4. Ist die Änderung dokumentiert?
5. Können Nutzer migrieren?
6. Werden offene Standards genutzt?
7. Kann ein anderer Entwickler sie verstehen?

---

# 33. Leitgedanke

Eine gute Plattform ist nicht nur eine Anwendung.

Sie ist ein System, das auch nach Jahren zuverlässig, sicher und unabhängig betrieben werden kann – und das nicht nur denen gehört, die es entwickeln, sondern auch denen, die es betreiben und nutzen.

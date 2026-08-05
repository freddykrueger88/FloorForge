# SECURITY.md

# OpenFloorball Coach Platform

## Sicherheitskonzept

---

# 1. Ziel

Die Plattform verarbeitet Trainingsdaten, Vereinswissen und möglicherweise personenbezogene Informationen.

Sicherheit ist daher ein Grundbestandteil des Produkts.

---

# 2. Security by Design

Sicherheit wird bereits bei Architekturentscheidungen berücksichtigt.

Nicht:

Feature bauen → Sicherheit nachrüsten

Sondern:

Sicherheit planen → Feature entwickeln

---

# 3. Bedrohungsmodell

Berücksichtige:

## Unberechtigter Zugriff

Schutz durch:

* Authentifizierung
* Rollen
* Berechtigungen

---

## Datenverlust

Schutz durch:

* Backups
* Wiederherstellung
* Synchronisation

---

## Datenlecks

Schutz durch:

* Verschlüsselung
* minimale Datenspeicherung
* sichere APIs

---

## Missbrauch von Berechtigungen

Schutz durch:

* Least Privilege Prinzip
* klare Rollen
* Audit Logs

---

# 4. Authentifizierung

Unterstützung:

* sichere Passwörter
* optionale Mehrfaktor-Authentifizierung
* sichere Sessionverwaltung

---

# 5. Autorisierung

Jeder Zugriff wird geprüft.

Beispiel:

Ein Spieler darf nicht automatisch:

* Trainerdaten sehen
* interne Notizen lesen
* Vereinsverwaltung ändern

---

# 6. Verschlüsselung

Verwende:

* sichere Transportverschlüsselung
* sichere Speicherung sensibler Daten

---

# 7. Secrets Management

Keine Secrets im Code.

Nicht erlaubt:

* API Keys im Repository
* Passwörter in Konfigurationen
* Tokens in Logs

---

# 8. Logging

Logs dürfen keine sensiblen Daten enthalten.

Nicht speichern:

* Passwörter
* private Inhalte
* unnötige personenbezogene Daten

---

# 9. Dependency Security

Regelmäßig prüfen:

* Sicherheitsupdates
* bekannte Schwachstellen
* veraltete Bibliotheken

---

# 10. Open Source Sicherheit

Open Source bedeutet:

Transparenz.

Nicht:

fehlende Sicherheit.

Bevorzuge:

* nachvollziehbaren Code
* Reviews
* automatisierte Tests
* klare Verantwortlichkeiten

---

# 11. Backup Konzept

Backups müssen:

* verschlüsselt sein
* getestet werden
* wiederherstellbar sein

Ein Backup gilt erst als Backup, wenn Wiederherstellung funktioniert.

---

# 12. Sicherheitsmeldungen

Das Projekt sollte einen klaren Prozess besitzen:

* Sicherheitslücken melden
* Bewertung durchführen
* Lösungen veröffentlichen

---

# 13. Sichere Entwicklung

Jede Änderung prüfen auf:

* Datenschutz
* Berechtigungen
* Eingabevalidierung
* Fehlerbehandlung
* Datenzugriffe

---

# 14. Grundregel

Die Plattform schützt nicht nur Daten.

Sie schützt das Vertrauen der Trainer und Vereine.

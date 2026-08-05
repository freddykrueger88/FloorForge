# USER_ROLES_AND_PERMISSIONS.md

# OpenFloorball Coach Platform

## Rollen-, Rechte- und Zugriffskonzept

---

# 1. Ziel

Das Berechtigungssystem stellt sicher:

* Nutzer sehen nur relevante Inhalte
* Vereine können gemeinsam arbeiten
* persönliche Daten bleiben geschützt
* Inhalte bleiben kontrollierbar

---

# 2. Grundprinzipien

Das System folgt:

* Least Privilege
* Need-to-Know-Prinzip
* Datenschutz durch Zugriffskontrolle
* transparente Berechtigungen

---

# 3. Rollenmodell

Die Plattform unterscheidet:

```text id="8q3m7x"

System

↓

Organisation

↓

Team

↓

Inhalt

```

---

# 4. Systemrollen

---

# 4.1 Plattform-Administrator

Zuständig für:

* technische Verwaltung
* Systembetrieb
* Sicherheit

Darf:

* System konfigurieren
* technische Einstellungen ändern

Darf nicht automatisch:

* Vereinsinhalte lesen

---

# 4.2 Vereinsadministrator

Zuständig für:

* Vereinsorganisation

Darf:

* Teams verwalten
* Trainer einladen
* Vereinsbereiche verwalten

---

# 5. Trainerrollen

---

# 5.1 Cheftrainer

Darf:

* Team verwalten
* Taktiken erstellen
* Trainings planen
* Inhalte teilen

---

# 5.2 Co-Trainer

Darf:

* Trainings ansehen
* Taktiken bearbeiten
* Kommentare hinzufügen

Einschränkungen:

* keine Teamverwaltung
* keine Benutzerverwaltung

---

# 5.3 Jugendtrainer

Darf:

* eigene Mannschaft verwalten
* eigene Inhalte erstellen

Darf nicht automatisch:

* andere Teams sehen

---

# 6. Spielerrollen

---

# 6.1 Spieler

Darf:

* freigegebene Inhalte ansehen
* eigene Notizen erstellen

Nicht automatisch:

* Taktiken verändern

---

# 6.2 Mannschaftskapitän

Optional.

Darf:

* freigegebene Team-Inhalte ansehen
* Kommunikation unterstützen

---

# 7. Externe Rollen

---

# 7.1 Gast

Darf:

* öffentliche Inhalte ansehen

Kein Zugriff auf:

* private Vereinsdaten
* interne Taktiken

---

# 7.2 Eltern/Betreuer

Optional.

Mögliche Rechte:

* Trainingsinformationen
* Termine

Keine Einsicht in:

* interne Trainerarbeit

---

# 8. Inhaltsrechte

Jedes Objekt besitzt Rechte.

Beispiele:

* Taktik
* Training
* Übung
* Dokument

---

# 9. Standardrechte

Grundrechte:

```text id="6m4p9r"

VIEW

CREATE

EDIT

DELETE

SHARE

EXPORT

```

---

# 10. Eigentum

Jeder Inhalt besitzt einen Eigentümer.

Beispiel:

```typescript id="4n8k2s"
ContentOwner {

 userId

 organizationId

}
```

---

# 11. Teilen von Inhalten

Freigaben erfolgen bewusst.

Beispiele:

Trainer erstellt Taktik:

Privat

↓

Team

↓

Verein

↓

Öffentlich

---

# 12. Sichtbarkeitsebenen

---

## Privat

Nur Eigentümer.

---

## Team

Mitglieder eines Teams.

---

## Verein

Vereinsmitglieder mit Berechtigung.

---

## Öffentlich

Für Community oder Bibliothek.

---

# 13. Rollenänderungen

Änderungen benötigen:

* Berechtigung
* Protokollierung
* nachvollziehbaren Ablauf

---

# 14. Austritt aus Verein

Wichtig:

Wenn ein Trainer den Verein verlässt:

Klären:

* Wem gehören Inhalte?
* Welche Inhalte bleiben beim Verein?
* Welche Inhalte dürfen exportiert werden?

---

# 15. Datenschutz bei Kindern und Jugendlichen

Besondere Vorsicht.

Grundsatz:

So wenig personenbezogene Daten wie möglich.

---

Vermeiden:

* unnötige Spielerprofile
* öffentliche Informationen
* Leistungsbewertungen

---

# 16. Spielerbewertung

Nicht Teil des Kernsystems.

Keine automatische:

* Rangliste
* Bewertung
* Scoring

---

# 17. Delegation

Trainer können Aufgaben übertragen.

Beispiel:

Cheftrainer erlaubt Co-Trainer:

"Trainings bearbeiten"

---

# 18. Berechtigungsprüfung

Jede Aktion prüft:

```text id="7s5k2m"

Wer?

↓

Was?

↓

Worauf?

↓

Warum?

```

---

# 19. Benutzerfreundlichkeit

Berechtigungen müssen verständlich sein.

Nicht:

"RBAC_POLICY_ERROR"

Sondern:

"Du hast keine Berechtigung, diese Taktik zu bearbeiten."

---

# 20. Audit

Bei wichtigen Aktionen speichern:

* was wurde geändert
* wann
* durch wen

Nur notwendige Informationen.

---

# 21. Zukunft

Mögliche Erweiterungen:

* Verbände
* Trainerlizenzen
* Akademien
* öffentliche Bibliotheken

---

# 22. Claude-Code-Regeln

Bei jeder neuen Funktion prüfen:

1. Welche Rolle benötigt Zugriff?
2. Welche Rolle benötigt keinen Zugriff?
3. Was ist die kleinste notwendige Berechtigung?
4. Sind Kinder- und Jugenddaten geschützt?
5. Kann der Nutzer verstehen, warum Zugriff erlaubt oder verweigert wird?

---

# 23. Leitgedanke

Gute Berechtigungen verhindern nicht Zusammenarbeit.

Sie ermöglichen sichere Zusammenarbeit.

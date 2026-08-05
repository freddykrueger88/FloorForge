# PRIVACY.md

# OpenFloorball Coach Platform

## Datenschutzkonzept, DSGVO-Compliance und Datenmodell für Nutzer

> Zusammengeführt aus PRIVACY_POLICY_AND_DATA_MODEL.md und
> GDPR_COMPLIANCE.md im Zuge der Dokument-Konsolidierung nach der
> Projektanalyse. Die ursprüngliche PRIVACY.md wurde entfernt: ihr
> Inhalt war fälschlich ein Sicherheitskonzept (deckungsgleich mit
> SECURITY.md/SECURITY_ARCHITECTURE.md) statt Datenschutzinhalt –
> vermutlich ein Kopierfehler beim Anlegen der Dokumente. Dieses
> Dokument ist jetzt die korrekt benannte, einzige Quelle für
> Datenschutz-/DSGVO-Themen.

---

# 1. Ziel

OpenFloorball verarbeitet Daten nur, wenn dies für den Zweck der Plattform notwendig ist.

Grundsatz: So wenig Daten wie möglich, so viel Funktionalität wie nötig.

Die Plattform fragt nicht "Welche Daten können wir sammeln?", sondern "Welche Daten benötigen wir wirklich?".

---

# 2. Datenschutzprinzipien (DSGVO Art. 5)

Die Plattform folgt DSGVO, Privacy by Design, Privacy by Default, Datenminimierung, Transparenz, Nutzerkontrolle. Konkret nach Art. 5 DSGVO:

* **Rechtmäßigkeit** – jede Verarbeitung benötigt eine nachvollziehbare Grundlage
* **Zweckbindung** – Daten werden nur für den angegebenen Zweck genutzt
* **Datenminimierung** – nur notwendige Daten speichern
* **Richtigkeit** – Nutzer können Daten korrigieren
* **Speicherbegrenzung** – Daten werden nicht unbegrenzt behalten
* **Integrität und Vertraulichkeit** – Daten werden geschützt

---

# 3. Zweck der Datenverarbeitung

Daten werden verarbeitet für: Benutzerverwaltung, Zusammenarbeit innerhalb von Teams, Speicherung von Taktiken, Trainingsplanung, technische Sicherheit.

---

# 4. Dateninventar

Vor jeder neuen Funktion dokumentieren, welche Daten entstehen:

```text
Funktion: Trainingsplanung
Daten: Titel, Beschreibung, Datum
Personenbezug: möglich
```

---

# 5. Nutzergruppen

```text
Administrator → Vereinsverantwortlicher → Trainer → Spieler → Gast/Nutzer
```

---

# 6. Datenkategorien

* **Technische Daten** – Version, Gerätestatus, Fehlerinformationen
* **Kontodaten** – Benutzername, Login-Daten
* **Vereinsdaten** – Vereinsname, Teamstruktur, Organisationsstruktur
* **Sportdaten** – Taktiken, Übungen, Trainingspläne
* **Personenbezogene Daten** – Name, Kontaktinformationen

Grundsatz der Datentrennung: persönliche Kontodaten, Vereinsdaten, Trainingsdaten und taktische Inhalte werden getrennt gehalten.

---

# 7. Benutzerdaten

Minimal notwendig: Benutzername, Login-Information, Rolle, technische Sicherheitsinformationen.

Nicht standardmäßig speichern: Adresse, Geburtsdatum, private Telefonnummer, persönliche Leistungsprofile.

---

# 8. Vereins- und Teamdaten

Ein Verein kann speichern: Vereinsname, Teams, Inhalte, Organisationsstruktur.

Ein Team kann speichern: Teamname, Altersgruppe, Trainingsinhalte, gemeinsame Ressourcen.

---

# 9. Spielerdaten und Nachwuchsbereich

Grundprinzip: so wenig wie möglich. Mögliche Speicherung: Anzeigename, Position, Trainingszuordnung.

Besondere Vorsicht bei Kindern, Jugendlichen und personenbezogenen Informationen – Regel: keine unnötigen personenbezogenen Daten.

---

# 10. Keine unnötigen Spielerprofile

Die Plattform erstellt keine automatischen Leistungsrankings, Talentbewertungen oder Persönlichkeitsprofile, und entscheidet nicht automatisch über Spielerqualität, Talent, Auswahl oder Entwicklungschancen.

---

# 11. Taktik- und Trainingsdaten

Taktiken gehören grundsätzlich den Nutzern bzw. Organisationen, die sie erstellen. Gespeichert werden: Positionen, Bewegungen, Beschreibungen, Varianten.

Trainingsdaten: Übungen, Trainingspläne, Coachingpunkte.

---

# 12. Registrierung und Gastnutzung

Registrierung nach Minimalprinzip: nur notwendige Informationen (Benutzername, sichere Anmeldung). Nicht automatisch: Geburtsdatum, Adresse, Telefonnummer.

Wo möglich: Funktionen ohne Konto ermöglichen (z.B. Taktik ansehen, Beispielinhalte testen).

---

# 13. Datenzugriff

Zugriff erfolgt nach Rollen, z.B. Trainer darf Team-Inhalte bearbeiten, Spieler darf freigegebene Inhalte ansehen.

---

# 14. Einwilligungen

Wenn eine Einwilligung notwendig ist, muss sie freiwillig, verständlich und widerrufbar sein.

---

# 15. Transparenz

Nutzer müssen jederzeit verstehen: welche Daten gespeichert werden, warum, und wie lange.

---

# 16. Nutzerrechte

Die Plattform unterstützt:

* **Auskunft** – welche Daten gespeichert sind
* **Berichtigung** – Daten ändern
* **Löschung** – Daten entfernen
* **Export** – Daten mitnehmen
* **Einschränkung** – Verarbeitung begrenzen

---

# 17. Löschkonzept

Daten werden nicht unbegrenzt behalten (Aufbewahrung nicht länger als notwendig).

Beim Löschen eines Kontos:

```text
Konto gelöscht → personenbezogene Daten entfernen → Inhalte prüfen → Besitz übertragen oder löschen
```

---

# 18. Vereinswechsel

Wichtiger Fall: ein Trainer verlässt den Verein. Zu klären: Wem gehören Taktiken? Was bleibt Vereinswissen? Was darf exportiert werden?

---

# 19. Datenexport

Export muss vollständige Daten in offenen Formaten ermöglichen (JSON, CSV, offene Dokumentformate), ohne künstliche Sperre.

---

# 20. Analyse, Statistik, Cookies und Tracking

Keine versteckte Nutzerüberwachung/-verfolgung. Statistiken bevorzugt anonymisiert und aggregiert.

Grundsatz zu Cookies/Tracking: so wenig wie möglich. Keine Werbeprofile, Tracking-Netzwerke oder unnötigen Cookies/Tracking-Technologien.

---

# 21. Hosting und Drittanbieter

Bevorzugt: EU-Hosting, transparente Anbieter, offene Infrastruktur. Zu prüfen: Auftragsverarbeitung, Speicherort, Sicherheitsmaßnahmen.

Jeder externe Dienst benötigt Prüfung: Brauchen wir ihn wirklich? Welche Daten erhält er? Gibt es eine datenschutzfreundliche Alternative? Nur nutzen, wenn notwendig, datenschutzrechtlich geprüft und transparent dokumentiert.

---

# 22. KI-Verarbeitung und Datenschutz

Vor KI-Verarbeitung prüfen: Welche Daten gehen an das Modell? Ist die Verarbeitung notwendig? Welche Rechtsgrundlage? Gibt es lokale Alternativen?

Nicht ohne klare Grundlage senden: private Spielerdaten, Kinderinformationen, sensible Vereinsdaten.

---

# 23. Datenschutz durch Architektur

Gutes Beispiel: lokale Taktikspeicherung.

Schlechtes Beispiel: jede Bewegung jedes Nutzers zentral speichern.

---

# 24. Privacy Review für neue Funktionen

```text
Neue Funktion → Datenanalyse → Risiko prüfen → Alternative suchen → Umsetzen
```

---

# 25. Betreiberpflichten und Dokumentation

Betreiber müssen wissen: welche Daten gespeichert werden, wer Zugriff hat, wie Löschung funktioniert.

Pflicht: Datenfluss, Speicherorte und Verantwortlichkeiten dokumentieren.

---

# 26. Sicherheitsverletzungen

Bei Datenschutzproblemen: erkennen, bewerten, dokumentieren, reagieren.

---

# 27. Open-Source-Transparenz

Offener Code bedeutet, dass Menschen nachvollziehen können, wie Daten verarbeitet werden – das bedeutet aber nicht, persönliche Daten offenzulegen.

---

# 28. Verantwortung

Datenschutz ist nicht nur eine rechtliche Pflicht. Er ist Teil des Vertrauens zwischen Spielern, Trainern, Vereinen und Plattform. Datenschutz ist kein Hindernis für Innovation – er ist die Grundlage für Vertrauen.

---

# 29. Claude-Code-Regeln

Bei jeder neuen Datenfunktion / vor jeder Implementierung prüfen:

1. Ist diese Information / dieser Datenpunkt notwendig?
2. Gibt es eine weniger sensible / lokale Alternative?
3. Kann der Nutzer Kontrolle behalten und selbst löschen?
4. Kann die Information exportiert und gelöscht werden?
5. Ist Zweck und Verarbeitung dokumentiert?

---

# 30. Leitgedanke

Eine gute Sportplattform sammelt nicht möglichst viele Daten. Sie schützt das Vertrauen der Menschen, die sie nutzen.

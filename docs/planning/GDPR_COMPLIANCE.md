# GDPR_COMPLIANCE.md

# OpenFloorball Coach Platform

## Datenschutzkonzept nach DSGVO

---

# 1. Ziel

OpenFloorball wird nach den Prinzipien entwickelt:

* Privacy by Design
* Privacy by Default
* Datenminimierung
* Transparenz
* Nutzerkontrolle

---

# 2. Grundhaltung

Die Plattform fragt nicht:

"Welche Daten können wir sammeln?"

Sondern:

"Welche Daten benötigen wir wirklich?"

---

# 3. Datenschutzprinzipien

Die Entwicklung folgt Artikel 5 DSGVO:

---

## Rechtmäßigkeit

Jede Verarbeitung benötigt eine nachvollziehbare Grundlage.

---

## Zweckbindung

Daten werden nur für den angegebenen Zweck genutzt.

---

## Datenminimierung

Nur notwendige Daten speichern.

---

## Richtigkeit

Nutzer können Daten korrigieren.

---

## Speicherbegrenzung

Daten werden nicht unbegrenzt behalten.

---

## Integrität und Vertraulichkeit

Daten werden geschützt.

---

# 4. Dateninventar

Vor jeder neuen Funktion dokumentieren:

Welche Daten entstehen?

Beispiel:

```text id="5m8k3p"

Funktion:

Trainingsplanung


Daten:

Titel

Beschreibung

Datum


Personenbezug:

möglich

```

---

# 5. Datenkategorien

---

# Technische Daten

Beispiele:

* Version
* Gerätestatus
* Fehlerinformationen

---

# Kontodaten

Beispiele:

* Benutzername
* Login-Daten

---

# Vereinsdaten

Beispiele:

* Vereinsname
* Teamstruktur

---

# Sportdaten

Beispiele:

* Taktiken
* Übungen
* Trainingspläne

---

# Personenbezogene Daten

Beispiele:

* Name
* Kontaktinformationen

---

# 6. Besondere Schutzbereiche

Besonders sorgfältig behandeln:

* Kinder und Jugendliche
* Spielerinformationen
* Leistungsdaten

---

# 7. Keine unnötigen Spielerprofile

Die Plattform erstellt keine automatischen:

* Leistungsrankings
* Talentbewertungen
* Persönlichkeitsprofile

---

# 8. Registrierung

Minimalprinzip:

Nur notwendige Informationen.

Mögliche Basis:

* Benutzername
* sichere Anmeldung

---

Nicht automatisch:

* Geburtsdatum
* Adresse
* Telefonnummer

---

# 9. Gastnutzung

Wo möglich:

Funktionen ohne Konto ermöglichen.

Beispiele:

* Taktik ansehen
* Beispielinhalte testen

---

# 10. Einwilligungen

Wenn Einwilligung notwendig ist:

Sie muss sein:

* freiwillig
* verständlich
* widerrufbar

---

# 11. Transparenz

Nutzer müssen verstehen:

* welche Daten gespeichert werden
* warum sie gespeichert werden
* wie lange

---

# 12. Nutzerrechte

Die Plattform unterstützt:

---

## Auskunft

Welche Daten gespeichert sind.

---

## Berichtigung

Daten ändern.

---

## Löschung

Daten entfernen.

---

## Export

Daten mitnehmen.

---

## Einschränkung

Verarbeitung begrenzen.

---

# 13. Löschkonzept

Daten werden nicht einfach unbegrenzt behalten.

---

Beispiel:

Konto gelöscht:

↓

personenbezogene Daten entfernen

↓

Inhalte prüfen

↓

Besitz übertragen oder löschen

---

# 14. Vereinswechsel

Wichtiger Fall:

Trainer verlässt Verein.

Fragen:

* Wem gehören Taktiken?
* Was bleibt Vereinswissen?
* Was darf exportiert werden?

---

# 15. Datenexport

Export muss ermöglichen:

* vollständige Daten
* offene Formate
* keine künstliche Sperre

---

Beispiele:

* JSON
* offene Dokumentformate

---

# 16. Hosting

Bevorzugt:

* EU-Hosting
* transparente Anbieter
* offene Infrastruktur

---

Zu prüfen:

* Auftragsverarbeitung
* Speicherort
* Sicherheitsmaßnahmen

---

# 17. Drittanbieter

Jeder externe Dienst benötigt Prüfung.

Fragen:

* Brauchen wir ihn?
* Welche Daten erhält er?
* Gibt es eine Alternative?

---

# 18. Analytics

Keine versteckte Nutzerverfolgung.

Bevorzugt:

* keine Analytics

oder:

* datenschutzfreundliche Lösungen
* anonymisierte Statistiken

---

# 19. Cookies und Tracking

Grundsatz:

So wenig wie möglich.

Keine:

* Werbeprofile
* Tracking-Netzwerke
* unnötige Cookies

---

# 20. KI und Datenschutz

Vor KI-Verarbeitung prüfen:

* Welche Daten gehen an das Modell?
* Ist Verarbeitung notwendig?
* Gibt es lokale Alternativen?

---

# 21. KI-Regeln

Nicht senden:

* private Spielerdaten
* Kinderinformationen
* sensible Vereinsdaten

ohne klare Grundlage.

---

# 22. Privacy Review

Neue Funktionen benötigen Prüfung:

```text id="7n4p2m"

Neue Funktion

↓

Datenanalyse

↓

Risiko prüfen

↓

Alternative suchen

↓

Umsetzen

```

---

# 23. Datenschutz durch Architektur

Beispiele:

Gut:

Lokale Taktikspeicherung

---

Schlecht:

Jede Bewegung jedes Nutzers zentral speichern.

---

# 24. Dokumentation

Pflicht:

* Datenfluss dokumentieren
* Speicherorte dokumentieren
* Verantwortlichkeiten dokumentieren

---

# 25. Sicherheitsverletzungen

Bei Datenschutzproblemen:

* erkennen
* bewerten
* dokumentieren
* reagieren

---

# 26. Open Source und Datenschutz

Offener Code unterstützt:

* Transparenz
* Prüfung
* Vertrauen

---

Aber:

Offen bedeutet nicht:

persönliche Daten offenlegen.

---

# 27. Claude-Code-Prüfung

Vor jeder Implementierung fragen:

1. Welche Daten brauchen wir?
2. Können wir weniger speichern?
3. Kann der Nutzer löschen?
4. Ist der Zweck klar?
5. Ist eine lokale Lösung möglich?

---

# 28. Leitgedanke

Datenschutz ist kein Hindernis für Innovation.

Datenschutz ist die Grundlage für Vertrauen.

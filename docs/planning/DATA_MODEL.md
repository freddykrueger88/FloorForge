# DATA_MODEL.md

# OpenFloorball Coach Platform

## Datenmodell und Domänenstruktur

---

# 1. Grundprinzipien des Datenmodells

Das Datenmodell folgt diesen Regeln:

* Daten gehören dem Nutzer
* Datenstrukturen bleiben offen
* Personenbezogene Daten werden minimiert
* Sportwissen wird unabhängig von Personen gespeichert
* Export und Migration müssen jederzeit möglich sein

---

# 2. Domänenübersicht

Die Plattform besteht aus folgenden Hauptbereichen:

```text id="r7k3vx"
Organisation

    |

Team

    |

---------------------------------

|              |                |

Spieler      Training       Taktik


                   |

                Szene

                   |

              Animation


                   |

              Analyse


                   |

                Wissen
```

---

# 3. Organisation

Eine Organisation repräsentiert:

* Verein
* Verband
* Schule
* Leistungszentrum

---

## Entity: Organisation

```json
{
  "id": "uuid",
  "name": "Beispielverein",
  "createdAt": "date",
  "settings": {}
}
```

---

## Eigenschaften

Erlaubt:

* Name
* Logo
* Einstellungen

Nicht standardmäßig:

* unnötige Kontaktdaten
* externe Profile
* Trackinginformationen

---

# 4. Benutzer

Ein Benutzer ist eine Person, die das System verwendet.

---

## Entity: User

```json
{
  "id": "uuid",
  "name": "",
  "email": "",
  "roles": []
}
```

---

## Rollen

Mögliche Rollen:

* Administrator
* Trainer
* Co-Trainer
* Spieler
* Betrachter

---

# Datenschutz

Benutzerdaten nur speichern, wenn notwendig.

---

# 5. Team

Ein Team verbindet Spieler und Trainer.

---

## Entity: Team

```json
{
  "id": "uuid",
  "name": "U15",
  "organizationId": "uuid",
  "season": ""
}
```

---

Eigenschaften:

* Name
* Altersgruppe optional
* Saison

---

# 6. Spieler

Spieler sind nicht automatisch Benutzer.

Ein Spielerprofil kann existieren, ohne einen Account zu besitzen.

---

## Entity: Player

```json
{
  "id": "uuid",
  "name": "",
  "number": 10,
  "position": "",
  "role": ""
}
```

---

## Positionen

Beispiele:

* Torhüter
* Verteidiger
* Center
* Stürmer

---

# Datenschutz

Nicht speichern ohne klare Funktion:

* Geburtsdatum
* Adresse
* private Kontakte
* medizinische Daten

---

# 7. Taktik

Die zentrale Wissenseinheit.

Eine Taktik beschreibt ein Spielsystem oder eine Spielsituation.

---

## Entity: Tactic

```json
{
  "id": "uuid",
  "name": "",
  "description": "",
  "sport": "floorball",
  "scenes": []
}
```

---

Beispiele:

* Powerplay Variante
* Forechecking System
* Spielaufbau
* Defensive Formation

---

# 8. Szene

Eine Taktik besteht aus mehreren Szenen.

---

## Entity: Scene

```json
{
  "id": "uuid",
  "name": "",
  "duration": 10,
  "objects": []
}
```

---

Beispiel:

```text
Szene 1

Aufstellung


Szene 2

Rotation


Szene 3

Abschluss
```

---

# 9. Taktikobjekte

Alle visuellen Elemente sind Objekte.

---

## Entity: TacticalObject

Basis:

```json
{
"type":"",
"x":0,
"y":0,
"properties":{}
}
```

---

Typen:

## PlayerObject

Spieler auf dem Feld.

---

## MovementObject

Bewegung.

---

## PassObject

Passweg.

---

## ShotObject

Schuss.

---

## ZoneObject

Bereich.

---

## AnnotationObject

Text oder Hinweis.

---

# 10. Animation

Animation beschreibt Veränderung über Zeit.

---

## Entity: Animation

```json
{
"id":"",
"target":"",
"timeline":[]
}
```

---

Timeline:

```json
[
{
"time":0,
"x":100,
"y":200
},
{
"time":5,
"x":300,
"y":200
}
]
```

---

# 11. Trainingseinheit

Eine Trainingseinheit verbindet Übungen und Ziele.

---

## Entity: TrainingSession

```json
{
"id":"",
"title":"",
"date":"",
"duration":90,
"blocks":[]
}
```

---

# 12. Trainingsblock

Beispiel:

```text
Warm-up

Technik

Taktik

Spiel

Cool-down
```

---

## Entity: TrainingBlock

```json
{
"type":"",
"duration":15,
"content":[]
}
```

---

# 13. Übung

Eine Übung ist wiederverwendbares Trainerwissen.

---

## Entity: Exercise

```json
{
"id":"",
"name":"",
"description":"",
"category":"",
"duration":10
}
```

---

Kategorien:

* Technik
* Taktik
* Kondition
* Spielverständnis
* Nachwuchs

---

# 14. Medien

Medien werden getrennt verwaltet.

---

## Entity: Media

```json
{
"id":"",
"type":"video",
"url":"",
"metadata":{}
}
```

---

Typen:

* Video
* Bild
* PDF
* Animation

---

# 15. Videoanalyse

---

## Entity: Analysis

```json
{
"id":"",
"videoId":"",
"markers":[]
}
```

---

Marker:

* Zeitpunkt
* Kommentar
* Zeichnung
* Taktikelement

---

# 16. Wissen

Langfristiges Vereinswissen.

---

## Entity: KnowledgeItem

```json
{
"id":"",
"title":"",
"content":"",
"category":""
}
```

---

Beispiele:

* Spielphilosophie
* Standards
* Trainingsprinzipien

---

# 17. KI-Kontext

KI bekommt nicht automatisch alle Daten.

---

## Entity: AIRequestContext

```json
{
"purpose":"",
"allowedData":[],
"provider":""
}
```

---

Regeln:

* minimale Daten
* klare Zustimmung
* nachvollziehbare Nutzung

---

# 18. Versionierung

Wichtige Inhalte benötigen Versionierung.

Beispiele:

* Taktik geändert
* Training angepasst
* Vorlage aktualisiert

---

## Entity: Version

```json
{
"id":"",
"entity":"",
"createdAt":"",
"author":""
}
```

---

# 19. Exportformat

Alle Kernobjekte müssen exportierbar sein.

Bevorzugt:

```text
JSON
```

Beispiel:

```json
{
"type":"tactic",
"version":"1.0",
"data":{}
}
```

---

# 20. Datenmodell-Regel

Bei jeder neuen Entität fragen:

1. Gehört diese Information wirklich ins System?
2. Ist sie personenbezogen?
3. Kann sie offen exportiert werden?
4. Kann ein Nutzer sie löschen?
5. Unterstützt sie Trainer?

---

# 21. Langfristige Vision

Das Datenmodell soll nicht nur Software ermöglichen.

Es soll Floorball-Wissen bewahren.

Eine Taktik, eine Übung oder eine Trainingsidee soll auch in zehn Jahren noch verständlich und nutzbar sein.

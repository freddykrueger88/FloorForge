# 🤖 KI-Assistenten

Vier optionale, textbasierte Assistenten (`/api/ai/*`), sichtbar nur
wenn diese Instanz einen KI-Anbieter konfiguriert hat. Kein Assistent
speichert automatisch etwas – jeder liefert nur einen Textentwurf, den
der Trainer prüft, bearbeitet und explizit übernimmt.

## Konfiguration (Admin)

Unter [Einstellungen](./Einstellungen.md#admin-einstellungen) → Admin:
Basis-URL, Modell, Timeout, API-Key. Die API funktioniert mit jedem
Anbieter, der eine OpenAI-kompatible `/v1/chat/completions`-Schnittstelle
bereitstellt – lokal (z. B. Ollama, LM Studio) oder als Cloud-Dienst.
Kein Vendor-Lock-in auf einen bestimmten Anbieter. Der API-Key wird nie
an das Frontend zurückgegeben (nur ob einer gesetzt ist).

Alternativ per Umgebungsvariablen (`AI_PROVIDER_*` in `.env`, siehe
[Umgebungsvariablen](./Umgebungsvariablen.md)) – die Admin-UI-Werte
haben Vorrang, sobald sie einmal gesetzt wurden.

## Die vier Assistenten

| Assistent | Seite | Eingabe | Ausgabe |
|---|---|---|---|
| Trainingsassistent | Trainingspläne | Altersgruppe (feste Liste), Ziel, Dauer, Spieleranzahl | Textentwurf einer Trainingseinheit (Warm-up/Technik/Taktik/Spielform/Cool-down) |
| Taktikassistent | Boards | Kategorie (Forechecking/Powerplay/Boxplay/Allgemein), Frage | 2–3 taktische Varianten mit Vor-/Nachteilen |
| Analyseassistent | Boards | Freitext-Beobachtungen zu einem Spiel/einer Situation | Zusammenfassung, erkannte Muster, Anschlussfragen |
| Wissensassistent | Wissen | Frage in natürlicher Sprache | Antwort auf Basis eigener Boards/Trainings/Bibliothekseinträge, mit Quellenangaben |

## Datenschutz und Grenzen

- Keine Spieler- oder Talentbewertung, keine Rankings einzelner
  Personen – die Prompt-Vorlagen (`backend/src/services/ai/prompts/`)
  schreiben das explizit vor.
- Der Analyseassistent zeigt im UI einen sichtbaren Hinweis, keine
  Namen/Rückennummern einzutragen.
- Der Wissensassistent ruft die KI **gar nicht erst auf**, wenn keine
  passenden eigenen Einträge gefunden werden – verhindert erfundene
  Antworten ohne echte Grundlage. Die Quellenliste kommt direkt aus
  der Datenbank-Suche, nicht aus dem KI-Text.
- Trainingsassistent/Taktikassistent nutzen bewusst feste Auswahllisten
  statt Freitext für Personendaten-sensible Felder.

## Verwandte Seiten

- [Architektur – KI-Anbieter](./Architektur.md#ki-anbieter-optional)
- [Einstellungen](./Einstellungen.md)

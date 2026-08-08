/**
 * fake-ai-server – Dev-/Verifikationswerkzeug, KEIN Produktionscode.
 *
 * Minimaler OpenAI-kompatibler Server (/v1/chat/completions), damit der
 * komplette KI-Assistenten-Codepfad (Config lesen -> HTTP-Call -> Antwort
 * parsen -> UI anzeigen) ohne echtes Modell, ohne Kosten und ohne API-Key
 * verifiziert werden kann. Erkennt anhand eines Substrings im User-Prompt
 * grob, welcher der vier Assistenten (Training/Taktik/Analyse/Wissen)
 * gemeint ist, und antwortet mit einem passenden statischen Beispieltext.
 *
 * Nutzung: `node scripts/fake-ai-server.js` (Port via PORT-Env, Default
 * 8080), dann AI_PROVIDER_BASE_URL=http://<host>:8080/v1 setzen.
 */
import { createServer } from 'http';

const PORT = process.env.PORT || 8080;

const FAKE_TRAINING_PLAN = `## Warm-up
Dauer: 10 Minuten. Mögliche Übung wäre Lauf-ABC mit Ball.

## Technik
Dauer: 20 Minuten. Mögliche Übung wäre Passtafel zu zweit. Ein denkbarer Coachingpunkt könnte sein: Schlägerkopf tief halten.

## Taktik
Dauer: 25 Minuten. Mögliche Übung wäre 3 gegen 2 im Umschaltspiel. Ein denkbarer Coachingpunkt könnte sein: früh anlaufen.

## Spielform
Dauer: 25 Minuten. Mögliche Übung wäre Kleinfeld-Turnier 3v3.

## Cool-down
Dauer: 10 Minuten. Mögliche Übung wäre lockeres Auslaufen mit Dehnen.

Bitte vor dem Einsatz an die Gruppe anpassen.`;

const FAKE_TACTIC_SUGGESTION = `### Variante 1: 2-1-2 mit früher Störung
Mögliche Kurzbeschreibung: Der erste Stürmer läuft den ballführenden Verteidiger früh an, der zweite deckt den Passweg zum Center.
**Vorteile**
- Erzwingt frühe Fehler beim Spielaufbau
**Nachteile**
- Hoher Laufaufwand, anfällig bei langen Bällen
Mögliche Anpassung wäre, bei Ermüdung auf Mid Press zu wechseln.

### Variante 2: 1-2-2 mit Zonensicherung
Mögliche Kurzbeschreibung: Ein Stürmer presst vorne, die restliche Formation sichert die Zonen dahinter ab.
**Vorteile**
- Weniger Laufaufwand, stabiler gegen langen Aufbau
**Nachteile**
- Weniger Balldruck vorne, Gegner kann sich sortieren

Bitte anhand der eigenen Mannschaft und Gegneranalyse prüfen und anpassen.`;

const FAKE_ANALYSIS = `## Zusammenfassung
Es könnte ein Muster sein, dass Ballverluste vor allem beim Übergang von der Abwehr ins Angriffsdrittel auftreten.

## Erkannte Muster
- Häufige Balleroberungen des Gegners im neutralen Drittel
- Wenig Anspielstationen für den ersten Aufbaupass

## Anschlussfragen für das nächste Training
1. Wie können wir im Training gezielt Anspielstationen für den ersten Aufbaupass schaffen?
2. Welche Übung könnte die Entscheidungsgeschwindigkeit beim Übergang verbessern?

Diese Einschätzung basiert ausschließlich auf deiner Beschreibung – bitte durch eigene Beobachtung ergänzen.`;

const FAKE_KNOWLEDGE_ANSWER = `Dazu findet sich in den gespeicherten Einträgen dieser Instanz einiges: die passenden Boards und Trainingseinheiten sind unten als Quellen aufgeführt. Es könnte sich lohnen, dort zuerst nachzusehen, bevor eine neue Variante erstellt wird.

Diese Antwort basiert ausschließlich auf den gefundenen Einträgen dieser Instanz.`;

function pickFakeResponse(userPromptContent) {
  if (userPromptContent.includes('Beobachtungen:')) return FAKE_ANALYSIS;
  if (userPromptContent.includes('Gefundene Einträge')) return FAKE_KNOWLEDGE_ANSWER;
  if (userPromptContent.includes('Frage/Kontext:')) return FAKE_TACTIC_SUGGESTION;
  return FAKE_TRAINING_PLAN;
}

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
    res.writeHead(404).end();
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    const parsed = JSON.parse(body || '{}');
    const userMessage = parsed.messages?.find((m) => m.role === 'user')?.content || '';
    console.log('fake-ai-server: Anfrage erhalten', parsed.model);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content: pickFakeResponse(userMessage) } }] }));
  });
});

server.listen(PORT, () => console.log(`fake-ai-server: hört auf Port ${PORT}`));

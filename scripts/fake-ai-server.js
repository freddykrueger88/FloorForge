/**
 * fake-ai-server – Dev-/Verifikationswerkzeug, KEIN Produktionscode.
 *
 * Minimaler OpenAI-kompatibler Server (/v1/chat/completions), damit der
 * komplette KI-Trainingsassistent-Codepfad (Config lesen -> HTTP-Call
 * -> Antwort parsen -> UI anzeigen) ohne echtes Modell, ohne Kosten und
 * ohne API-Key verifiziert werden kann. Antwortet immer mit einem
 * statischen Beispielplan.
 *
 * Nutzung: `node scripts/fake-ai-server.js` (Port via PORT-Env, Default
 * 8080), dann AI_PROVIDER_BASE_URL=http://<host>:8080/v1 setzen.
 */
import { createServer } from 'http';

const PORT = process.env.PORT || 8080;

const FAKE_PLAN = `## Warm-up
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

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/v1/chat/completions') {
    res.writeHead(404).end();
    return;
  }
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    console.log('fake-ai-server: Anfrage erhalten', JSON.parse(body || '{}').model);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content: FAKE_PLAN } }] }));
  });
});

server.listen(PORT, () => console.log(`fake-ai-server: hört auf Port ${PORT}`));

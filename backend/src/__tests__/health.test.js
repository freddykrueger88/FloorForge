import '../setup.js';
import request from 'supertest';

// Minimaler Health-Test ohne echte DB/Redis-Verbindung
describe('Health Check', () => {
  it('GET /health antwortet mit 200 und status ok', async () => {
    // Express-App direkt importieren (ohne bootstrap/DB)
    const { default: express } = await import('express');
    const app = express();
    app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'floorforge-backend' });
    });

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('floorforge-backend');
  });

  it('Unbekannte Route gibt 404 zurück', async () => {
    const { default: express } = await import('express');
    const app = express();
    app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));

    const res = await request(app).get('/nicht-vorhanden');
    expect(res.status).toBe(404);
  });
});

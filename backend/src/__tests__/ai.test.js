import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'ai-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { id: res.body.data.user.id, email, cookie: res.headers['set-cookie'][0] };
}

async function forceRole(userId, role) {
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
}

// Die Rolle steckt im JWT-Payload (Stand beim Login/Register) – nach
// forceRole() muss neu eingeloggt werden, damit requireAdmin-geschützte
// Routen die aktualisierte Rolle sehen (siehe backup.test.js/admin.test.js).
// Explizites forceRole(user, 'user') ist auch für den "regular"-Nutzer
// nötig: würde diese Testdatei als allererste in einer leeren Test-DB
// laufen, würde der erste registrierte Account sonst automatisch Admin
// (siehe admin.test.js-Kommentar) – ohne den expliziten Reset auf 'user'
// hinge dieser Test von der Jest-Dateireihenfolge ab.
async function relogin(email, password = 'Testpass123') {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let user;
let admin;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  user = await registerAndLogin('user');
  await forceRole(user.id, 'user');
  user = await relogin(user.email);

  const adminReg = await registerAndLogin('admin');
  await forceRole(adminReg.id, 'admin');
  admin = await relogin(adminReg.email);
});

afterAll(async () => {
  // Standardzustand für andere Testläufe wiederherstellen
  await pool.query(
    `UPDATE app_config SET ai_provider_base_url = '', ai_provider_api_key = '',
                            ai_provider_model = '', ai_provider_timeout_ms = 30000`
  );
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('GET /api/ai/status', () => {
  it('lehnt nicht eingeloggte Anfragen ab', async () => {
    const res = await request(app).get('/api/ai/status');
    expect(res.status).toBe(401);
  });

  it('meldet configured:false, solange AI_PROVIDER_BASE_URL nicht gesetzt ist (Testumgebung)', async () => {
    const res = await request(app).get('/api/ai/status').set('Cookie', user.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ configured: false, model: null });
  });
});

describe('POST /api/ai/training-plan', () => {
  const validBody = {
    ageGroup: 'U15', goal: 'Umschaltspiel', durationMinutes: 90, playerCount: 14, focus: 'Pressing',
  };

  it('lehnt nicht eingeloggte Anfragen ab', async () => {
    const res = await request(app).post('/api/ai/training-plan').send(validBody);
    expect(res.status).toBe(401);
  });

  it('lehnt eine ungültige Altersgruppe ab (feste Liste statt Freitext)', async () => {
    const res = await request(app).post('/api/ai/training-plan')
      .set('Cookie', user.cookie)
      .send({ ...validBody, ageGroup: 'Max Müller, 15 Jahre' });
    expect(res.status).toBe(422);
  });

  it('lehnt eine zu lange Dauer ab', async () => {
    const res = await request(app).post('/api/ai/training-plan')
      .set('Cookie', user.cookie)
      .send({ ...validBody, durationMinutes: 999 });
    expect(res.status).toBe(422);
  });

  it('liefert 503, solange kein KI-Anbieter konfiguriert ist', async () => {
    const res = await request(app).post('/api/ai/training-plan')
      .set('Cookie', user.cookie)
      .send(validBody);
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
  });
});

describe('Admin AI-Config', () => {
  afterEach(async () => {
    // Jeden Test mit einer leeren Konfiguration starten/beenden, damit sich
    // die Tests nicht gegenseitig beeinflussen.
    await pool.query(
      `UPDATE app_config SET ai_provider_base_url = '', ai_provider_api_key = '',
                              ai_provider_model = '', ai_provider_timeout_ms = 30000`
    );
  });

  it('lehnt Nicht-Admins mit 403 ab', async () => {
    const res = await request(app).get('/api/admin/ai-config').set('Cookie', user.cookie);
    expect(res.status).toBe(403);
  });

  it('liefert die aktuelle Konfiguration ohne den API-Key im Klartext', async () => {
    const res = await request(app).get('/api/admin/ai-config').set('Cookie', admin.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ baseUrl: '', model: '', timeoutMs: 30000, apiKeySet: false });
  });

  it('speichert eine neue Konfiguration inkl. API-Key', async () => {
    const res = await request(app)
      .put('/api/admin/ai-config')
      .set('Cookie', admin.cookie)
      .send({ baseUrl: 'http://ollama:11434/v1', model: 'llama3.1', timeoutMs: 20000, apiKey: 'geheim' });
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      baseUrl: 'http://ollama:11434/v1', model: 'llama3.1', timeoutMs: 20000, apiKeySet: true,
    });

    const statusRes = await request(app).get('/api/ai/status').set('Cookie', user.cookie);
    expect(statusRes.body.data).toEqual({ configured: true, model: 'llama3.1' });
  });

  it('lässt einen gesetzten API-Key unverändert, wenn apiKey im Body fehlt', async () => {
    await request(app).put('/api/admin/ai-config').set('Cookie', admin.cookie)
      .send({ baseUrl: 'http://ollama:11434/v1', model: 'm', timeoutMs: 20000, apiKey: 'geheim' });

    const res = await request(app).put('/api/admin/ai-config').set('Cookie', admin.cookie)
      .send({ baseUrl: 'http://ollama:11434/v1', model: 'm2', timeoutMs: 20000 });
    expect(res.status).toBe(200);
    expect(res.body.data.apiKeySet).toBe(true);
    expect(res.body.data.model).toBe('m2');
  });

  it('entfernt den API-Key, wenn explizit apiKey: "" gesendet wird', async () => {
    await request(app).put('/api/admin/ai-config').set('Cookie', admin.cookie)
      .send({ baseUrl: 'http://ollama:11434/v1', model: 'm', timeoutMs: 20000, apiKey: 'geheim' });

    const res = await request(app).put('/api/admin/ai-config').set('Cookie', admin.cookie)
      .send({ baseUrl: 'http://ollama:11434/v1', model: 'm', timeoutMs: 20000, apiKey: '' });
    expect(res.body.data.apiKeySet).toBe(false);
  });

  it('lehnt einen zu großen Timeout mit 422 ab', async () => {
    const res = await request(app).put('/api/admin/ai-config').set('Cookie', admin.cookie)
      .send({ baseUrl: '', model: '', timeoutMs: 999999 });
    expect(res.status).toBe(422);
  });
});

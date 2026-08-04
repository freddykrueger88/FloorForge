import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'lines-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let owner;
let other;
let boardId;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  owner = await registerAndLogin('owner');
  other = await registerAndLogin('other');

  const boardRes = await request(app)
    .post('/api/boards')
    .set('Cookie', owner.cookie)
    .send({ name: 'Lines Test Board', fieldType: 'large' });
  boardId = boardRes.body.data._id;
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('GET /api/boards/:id/lines', () => {
  it('liefert eine leere Liste für ein frisches Board', async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('verweigert einem fremden User den Zugriff mit 404', async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}/lines`)
      .set('Cookie', other.cookie);
    expect(res.status).toBe(404);
  });
});

describe('POST /api/boards/:id/lines', () => {
  it('legt eine neue Line an', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Sturm 1', color: '#3b82f6', type: 'offense', playerIds: ['h1', 'h2'] });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Sturm 1');
    expect(res.body.data.color).toBe('#3b82f6');
    expect(res.body.data.type).toBe('offense');
    expect(res.body.data.playerIds).toEqual(['h1', 'h2']);
    expect(res.body.data.order).toBe(0);
  });

  it('nutzt Standardwerte für Farbe/Typ, wenn nicht angegeben', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Ohne Farbe' });
    expect(res.status).toBe(201);
    expect(res.body.data.color).toBe('#facc15');
    expect(res.body.data.type).toBe('offense');
  });

  it('lehnt eine Line ohne Namen mit 422 ab', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ color: '#ffffff' });
    expect(res.status).toBe(422);
  });

  it('lehnt eine ungültige Farbe mit 422 ab', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Bad Color', color: 'not-a-hex-color' });
    expect(res.status).toBe(422);
  });

  it('verweigert einem fremden User das Anlegen mit 404', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', other.cookie)
      .send({ name: 'Fremd' });
    expect(res.status).toBe(404);
  });

  it('lehnt eine 11. Line mit 400 ab (Maximal 10 Lines pro Board)', async () => {
    // Board hat bereits 2 Lines aus den Tests oben – 8 weitere bis zum
    // Limit auffüllen, dann die 11. testen.
    for (let i = 0; i < 8; i++) {
      const res = await request(app)
        .post(`/api/boards/${boardId}/lines`)
        .set('Cookie', owner.cookie)
        .send({ name: `Line ${i}` });
      expect(res.status).toBe(201);
    }
    const overLimit = await request(app)
      .post(`/api/boards/${boardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Zu viel' });
    expect(overLimit.status).toBe(400);
  });
});

describe('PUT /api/boards/:id/lines/:lineId', () => {
  let lineId;
  let boardId2;

  beforeAll(async () => {
    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', owner.cookie)
      .send({ name: 'Update Lines Board', fieldType: 'large' });
    boardId2 = boardRes.body.data._id;
    const res = await request(app)
      .post(`/api/boards/${boardId2}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Original' });
    lineId = res.body.data._id;
  });

  it('aktualisiert nur die übergebenen Felder', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId2}/lines/${lineId}`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Umbenannt' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Umbenannt');
    expect(res.body.data.color).toBe('#facc15'); // unverändert
  });

  it('lehnt einen leeren Update-Body mit 400 ab', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId2}/lines/${lineId}`)
      .set('Cookie', owner.cookie)
      .send({});
    expect(res.status).toBe(400);
  });

  it('liefert 404 für eine nicht existierende Line', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId2}/lines/00000000-0000-0000-0000-000000000000`)
      .set('Cookie', owner.cookie)
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });

  it('verweigert einem fremden User das Ändern mit 404', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId2}/lines/${lineId}`)
      .set('Cookie', other.cookie)
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/boards/:id/lines/active + DELETE', () => {
  let activeBoardId;
  let lineId;

  beforeAll(async () => {
    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', owner.cookie)
      .send({ name: 'Active Line Board', fieldType: 'large' });
    activeBoardId = boardRes.body.data._id;
    const lineRes = await request(app)
      .post(`/api/boards/${activeBoardId}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Aktive Line' });
    lineId = lineRes.body.data._id;
  });

  it('setzt eine Line als aktiv', async () => {
    const res = await request(app)
      .put(`/api/boards/${activeBoardId}/lines/active`)
      .set('Cookie', owner.cookie)
      .send({ lineId });
    expect(res.status).toBe(200);
    expect(res.body.data.activeLineId).toBe(lineId);
  });

  it('liefert 404 für eine nicht existierende Line als aktiv', async () => {
    const res = await request(app)
      .put(`/api/boards/${activeBoardId}/lines/active`)
      .set('Cookie', owner.cookie)
      .send({ lineId: '00000000-0000-0000-0000-000000000000' });
    expect(res.status).toBe(404);
  });

  it('setzt die aktive Line auf null zurück', async () => {
    const res = await request(app)
      .put(`/api/boards/${activeBoardId}/lines/active`)
      .set('Cookie', owner.cookie)
      .send({ lineId: null });
    expect(res.status).toBe(200);
    expect(res.body.data.activeLineId).toBeNull();
  });

  it('entfernt die active_line_id-Referenz beim Löschen der aktiven Line', async () => {
    await request(app)
      .put(`/api/boards/${activeBoardId}/lines/active`)
      .set('Cookie', owner.cookie)
      .send({ lineId });

    const delRes = await request(app)
      .delete(`/api/boards/${activeBoardId}/lines/${lineId}`)
      .set('Cookie', owner.cookie);
    expect(delRes.status).toBe(200);

    const board = await request(app).get(`/api/boards/${activeBoardId}`).set('Cookie', owner.cookie);
    expect(board.body.data.activeLineId).toBeNull();
  });

  it('liefert 404 beim Löschen einer nicht existierenden Line', async () => {
    const res = await request(app)
      .delete(`/api/boards/${activeBoardId}/lines/00000000-0000-0000-0000-000000000000`)
      .set('Cookie', owner.cookie);
    expect(res.status).toBe(404);
  });
});

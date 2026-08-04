import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'boards-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let userA;
let userB;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  userA = await registerAndLogin('owner');
  userB = await registerAndLogin('other');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('Board CRUD', () => {
  let boardId;

  it('legt ein neues Board an', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Test Board', fieldType: 'large' });

    expect(res.status).toBe(201);
    expect(res.body.data.fieldType).toBe('large');
    boardId = res.body.data._id;
  });

  it('legt sofort einen ersten Frame mit Standard-Aufstellung an', async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}/frames`)
      .set('Cookie', userA.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].players).toHaveLength(12); // Großfeld: 6 Heim + 6 Auswärts
    expect(res.body.data[0].players.some((p) => p.team === 'home' && p.role === 'TW')).toBe(true);
    expect(res.body.data[0].players.some((p) => p.team === 'away' && p.role === 'TW')).toBe(true);
  });

  it('legt bei anderem Feldtyp die passende Spieleranzahl an', async () => {
    const createRes = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Kleinfeld Board', fieldType: 'small' });
    expect(createRes.status).toBe(201);

    const framesRes = await request(app)
      .get(`/api/boards/${createRes.body.data._id}/frames`)
      .set('Cookie', userA.cookie);
    expect(framesRes.body.data).toHaveLength(1);
    expect(framesRes.body.data[0].players).toHaveLength(8); // Kleinfeld: 4 Heim + 4 Auswärts

    await request(app).delete(`/api/boards/${createRes.body.data._id}`).set('Cookie', userA.cookie);
  });

  it('lehnt einen ungültigen Feldtyp mit 422 ab', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Ungültig', fieldType: 'riesenfeld' });
    expect(res.status).toBe(422);
  });

  it('listet nur eigene Boards auf', async () => {
    const res = await request(app).get('/api/boards').set('Cookie', userA.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.some((b) => b._id === boardId)).toBe(true);
  });

  it('erlaubt dem Eigentümer, das Board zu ändern', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId}`)
      .set('Cookie', userA.cookie)
      .send({ fieldType: '3v3' });
    expect(res.status).toBe(200);
    expect(res.body.data.fieldType).toBe('3v3');
  });

  it('verweigert einem fremden User den Zugriff (GET) mit 404', async () => {
    const res = await request(app).get(`/api/boards/${boardId}`).set('Cookie', userB.cookie);
    expect(res.status).toBe(404);
  });

  it('verweigert einem fremden User das Ändern (PUT) mit 404', async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId}`)
      .set('Cookie', userB.cookie)
      .send({ name: 'Übernommen' });
    expect(res.status).toBe(404);
  });

  it('verweigert einem fremden User das Löschen (DELETE) mit 404', async () => {
    const res = await request(app).delete(`/api/boards/${boardId}`).set('Cookie', userB.cookie);
    expect(res.status).toBe(404);
  });

  it('erlaubt dem Eigentümer, das Board zu löschen', async () => {
    const res = await request(app).delete(`/api/boards/${boardId}`).set('Cookie', userA.cookie);
    expect(res.status).toBe(200);
  });

  it('liefert 404 für ein gelöschtes (soft-deleted) Board', async () => {
    const res = await request(app).get(`/api/boards/${boardId}`).set('Cookie', userA.cookie);
    expect(res.status).toBe(404);
  });
});

describe('Board playbookId (Issue #52)', () => {
  let playbookId;
  let foreignPlaybookId;

  beforeAll(async () => {
    const pbRes = await request(app)
      .post('/api/playbooks')
      .set('Cookie', userA.cookie)
      .send({ name: 'Standardsituationen' });
    playbookId = pbRes.body.data._id;

    const foreignRes = await request(app)
      .post('/api/playbooks')
      .set('Cookie', userB.cookie)
      .send({ name: 'Fremdes Playbook' });
    foreignPlaybookId = foreignRes.body.data._id;
  });

  it('legt ein Board mit eigener playbookId an', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Zugeordnetes Board', fieldType: 'large', playbookId });
    expect(res.status).toBe(201);
    expect(res.body.data.playbookId).toBe(playbookId);
  });

  it('lehnt das Anlegen mit einer fremden playbookId mit 404 ab', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Fremdzuordnung', fieldType: 'large', playbookId: foreignPlaybookId });
    expect(res.status).toBe(404);
  });

  it('erlaubt das Ändern der playbookId auf ein eigenes Playbook', async () => {
    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Wird umgehängt', fieldType: 'large' });
    const boardId = boardRes.body.data._id;

    const res = await request(app)
      .put(`/api/boards/${boardId}`)
      .set('Cookie', userA.cookie)
      .send({ playbookId });
    expect(res.status).toBe(200);
    expect(res.body.data.playbookId).toBe(playbookId);
  });

  it('lehnt das Ändern der playbookId auf ein fremdes Playbook mit 404 ab', async () => {
    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Bleibt ohne Playbook', fieldType: 'large' });
    const boardId = boardRes.body.data._id;

    const res = await request(app)
      .put(`/api/boards/${boardId}`)
      .set('Cookie', userA.cookie)
      .send({ playbookId: foreignPlaybookId });
    expect(res.status).toBe(404);
  });

  it('setzt playbookId auf null, wenn das zugehörige Playbook gelöscht wird', async () => {
    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Wird verwaist', fieldType: 'large', playbookId });
    const boardId = boardRes.body.data._id;

    await request(app).delete(`/api/playbooks/${playbookId}`).set('Cookie', userA.cookie);

    const res = await request(app).get(`/api/boards/${boardId}`).set('Cookie', userA.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.playbookId).toBeNull();
  });
});

describe('Frames ownership', () => {
  let boardId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Cookie', userA.cookie)
      .send({ name: 'Frames Board', fieldType: 'large' });
    boardId = res.body.data._id;
  });

  it('erlaubt dem Eigentümer, ein Frame anzulegen', async () => {
    const res = await request(app)
      .post(`/api/boards/${boardId}/frames`)
      .set('Cookie', userA.cookie)
      .send({ players: [], elements: [] });
    expect(res.status).toBe(201);
  });

  it('verweigert einem fremden User den Zugriff auf die Frames', async () => {
    const res = await request(app)
      .get(`/api/boards/${boardId}/frames`)
      .set('Cookie', userB.cookie);
    expect(res.status).toBe(404);
  });
});

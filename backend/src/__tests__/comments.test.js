/**
 * comments.test.js – Kommentare auf Boards und Trainingseinheiten
 * (ROADMAP Phase 2)
 */
import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'comments-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let owner;
let collaborator;
let stranger;
let boardId;
let sessionId;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  owner = await registerAndLogin('owner');
  collaborator = await registerAndLogin('collaborator');
  stranger = await registerAndLogin('stranger');

  const boardRes = await request(app).post('/api/boards').set('Cookie', owner.cookie).send({ name: 'Kommentar-Board', fieldType: 'large' });
  boardId = boardRes.body.data._id;
  await request(app).post(`/api/boards/${boardId}/collaborators`).set('Cookie', owner.cookie).send({ email: collaborator.email, permission: 'read' });

  const sessionRes = await request(app).post('/api/trainings').set('Cookie', owner.cookie).send({ name: 'Kommentar-Training' });
  sessionId = sessionRes.body.data._id;
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('Kommentare auf Boards', () => {
  let commentId;

  it('lehnt Zugriff durch einen Fremden mit 404 ab', async () => {
    const res = await request(app).get(`/api/boards/${boardId}/comments`).set('Cookie', stranger.cookie);
    expect(res.status).toBe(404);
  });

  it('owner kann einen Kommentar hinzufügen', async () => {
    const res = await request(app).post(`/api/boards/${boardId}/comments`).set('Cookie', owner.cookie).send({ text: 'Guter Spielzug!' });
    expect(res.status).toBe(201);
    expect(res.body.data.text).toBe('Guter Spielzug!');
    expect(res.body.data.email).toBe(owner.email);
    commentId = res.body.data._id;
  });

  it('read-Kollaborator kann den Kommentar lesen und selbst kommentieren', async () => {
    const listRes = await request(app).get(`/api/boards/${boardId}/comments`).set('Cookie', collaborator.cookie);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);

    const addRes = await request(app).post(`/api/boards/${boardId}/comments`).set('Cookie', collaborator.cookie).send({ text: 'Stimme zu' });
    expect(addRes.status).toBe(201);
  });

  it('lehnt Bearbeiten eines fremden Kommentars mit 403 ab', async () => {
    const res = await request(app).put(`/api/boards/${boardId}/comments/${commentId}`).set('Cookie', collaborator.cookie).send({ text: 'Sollte fehlschlagen' });
    expect(res.status).toBe(403);
  });

  it('Autor kann den eigenen Kommentar bearbeiten', async () => {
    const res = await request(app).put(`/api/boards/${boardId}/comments/${commentId}`).set('Cookie', owner.cookie).send({ text: 'Bearbeitet' });
    expect(res.status).toBe(200);
    expect(res.body.data.text).toBe('Bearbeitet');
  });

  it('read-Kollaborator (kein write) kann fremden Kommentar NICHT löschen', async () => {
    const res = await request(app).delete(`/api/boards/${boardId}/comments/${commentId}`).set('Cookie', collaborator.cookie);
    expect(res.status).toBe(403);
  });

  it('owner kann jeden Kommentar auf dem eigenen Board löschen (Moderation)', async () => {
    const res = await request(app).delete(`/api/boards/${boardId}/comments/${commentId}`).set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
  });
});

describe('Kommentare auf Trainingseinheiten', () => {
  it('lehnt Zugriff durch einen Fremden mit 404 ab', async () => {
    const res = await request(app).get(`/api/trainings/${sessionId}/comments`).set('Cookie', stranger.cookie);
    expect(res.status).toBe(404);
  });

  it('owner kann einen Kommentar hinzufügen und lesen', async () => {
    const addRes = await request(app).post(`/api/trainings/${sessionId}/comments`).set('Cookie', owner.cookie).send({ text: 'Gute Einheit' });
    expect(addRes.status).toBe(201);

    const listRes = await request(app).get(`/api/trainings/${sessionId}/comments`).set('Cookie', owner.cookie);
    expect(listRes.body.data).toHaveLength(1);
  });

  it('Kommentare verschwinden, wenn die Trainingseinheit gelöscht wird', async () => {
    await request(app).delete(`/api/trainings/${sessionId}`).set('Cookie', owner.cookie);
    const count = await pool.query("SELECT COUNT(*)::int AS count FROM comments WHERE resource_type = 'training_session' AND resource_id = $1", [sessionId]);
    expect(count.rows[0].count).toBe(0);
  });
});

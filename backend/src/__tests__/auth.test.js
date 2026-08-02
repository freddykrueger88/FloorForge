import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'auth-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('POST /api/auth/register', () => {
  it('legt einen neuen User an und setzt ein Cookie', async () => {
    const email = uniqueEmail('register');
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Testpass123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.password_hash).toBeUndefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/^token=/);
  });

  it('lehnt eine bereits registrierte E-Mail mit 409 ab', async () => {
    const email = uniqueEmail('dup');
    await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'AnderesPass123' });

    expect(res.status).toBe(409);
  });

  it('lehnt ungültige E-Mail-Adressen mit 422 ab', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'keine-email', password: 'Testpass123' });

    expect(res.status).toBe(422);
  });

  it('lehnt zu schwache Passwörter mit 422 ab', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail('weak'), password: 'nurklein' });

    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  const email = uniqueEmail('login');
  const password = 'Testpass123';

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ email, password });
  });

  it('meldet mit korrekten Zugangsdaten an und setzt ein Cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(email);
    expect(res.headers['set-cookie']?.[0]).toMatch(/^token=/);
  });

  it('lehnt falsches Passwort mit 401 ab', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'FalschesPass123' });
    expect(res.status).toBe(401);
  });

  it('lehnt unbekannte E-Mail mit 401 ab (kein User-Enumeration-Hinweis)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: uniqueEmail('unknown'), password: 'Testpass123' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Ungültige Anmeldedaten');
  });
});

describe('GET /api/auth/me + POST /api/auth/logout', () => {
  const email = uniqueEmail('me');
  const password = 'Testpass123';
  let cookie;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password });
    cookie = res.headers['set-cookie'][0];
  });

  it('lehnt /me ohne Cookie mit 401 ab', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('liefert die eigenen Userdaten mit gültigem Cookie', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(email);
  });

  it('invalidiert das Cookie nach Logout (Redis-Blacklist)', async () => {
    const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(logoutRes.status).toBe(200);

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meRes.status).toBe(401);
  });
});

import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'user-stats-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let owner;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  owner = await registerAndLogin('owner');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('GET /api/user/stats', () => {
  it('liefert Nullwerte für einen frischen Nutzer ohne Boards', async () => {
    const res = await request(app).get('/api/user/stats').set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.totalBoards).toBe(0);
    expect(res.body.data.fieldTypeCounts).toEqual({ large: 0, small: 0, street: 0, '3v3': 0 });
    expect(res.body.data.totalLines).toBe(0);
  });

  it('zählt Boards nach Feldtyp und Lines nach Typ', async () => {
    const large1 = await request(app).post('/api/boards').set('Cookie', owner.cookie).send({ name: 'B1', fieldType: 'large' });
    await request(app).post('/api/boards').set('Cookie', owner.cookie).send({ name: 'B2', fieldType: 'large' });
    await request(app).post('/api/boards').set('Cookie', owner.cookie).send({ name: 'B3', fieldType: 'small' });

    await request(app)
      .post(`/api/boards/${large1.body.data._id}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Sturm 1', type: 'offense' });
    await request(app)
      .post(`/api/boards/${large1.body.data._id}/lines`)
      .set('Cookie', owner.cookie)
      .send({ name: 'Def 1', type: 'defense' });

    const res = await request(app).get('/api/user/stats').set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.totalBoards).toBe(3);
    expect(res.body.data.fieldTypeCounts.large).toBe(2);
    expect(res.body.data.fieldTypeCounts.small).toBe(1);
    expect(res.body.data.totalLines).toBe(2);
    expect(res.body.data.lineTypeCounts.offense).toBe(1);
    expect(res.body.data.lineTypeCounts.defense).toBe(1);
  });

  it('zählt keine Boards/Lines eines gelöschten (soft-deleted) Boards', async () => {
    const board = await request(app).post('/api/boards').set('Cookie', owner.cookie).send({ name: 'To Delete', fieldType: '3v3' });
    await request(app).delete(`/api/boards/${board.body.data._id}`).set('Cookie', owner.cookie);

    const res = await request(app).get('/api/user/stats').set('Cookie', owner.cookie);
    expect(res.body.data.fieldTypeCounts['3v3']).toBe(0);
  });

  it('lehnt nicht authentifizierte Anfragen mit 401 ab', async () => {
    const res = await request(app).get('/api/user/stats');
    expect(res.status).toBe(401);
  });
});

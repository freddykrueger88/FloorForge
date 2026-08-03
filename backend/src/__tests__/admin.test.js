import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'admin-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { id: res.body.data.user.id, email, cookie: res.headers['set-cookie'][0] };
}

async function forceRole(userId, role) {
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
}

let admin;
let regular;
let victim;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  admin   = await registerAndLogin('admin');
  regular = await registerAndLogin('regular');
  victim  = await registerAndLogin('victim');
  await forceRole(admin.id, 'admin');
  await forceRole(regular.id, 'user');
  await forceRole(victim.id, 'user');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('GET /api/admin/users', () => {
  it('lehnt Nicht-Admins mit 403 ab', async () => {
    const res = await request(app).get('/api/admin/users').set('Cookie', regular.cookie);
    expect(res.status).toBe(403);
  });

  it('listet alle User für Admins', async () => {
    const res = await request(app).get('/api/admin/users').set('Cookie', admin.cookie);
    expect(res.status).toBe(200);
    const emails = res.body.data.map((u) => u.email);
    expect(emails).toEqual(expect.arrayContaining([admin.email, regular.email, victim.email]));
  });
});

describe('DELETE /api/admin/users/:id', () => {
  it('lehnt Selbstlöschung mit 400 ab', async () => {
    const res = await request(app).delete(`/api/admin/users/${admin.id}`).set('Cookie', admin.cookie);
    expect(res.status).toBe(400);
  });

  it('löscht einen anderen User', async () => {
    const res = await request(app).delete(`/api/admin/users/${victim.id}`).set('Cookie', admin.cookie);
    expect(res.status).toBe(200);

    const check = await pool.query('SELECT id FROM users WHERE id = $1', [victim.id]);
    expect(check.rows).toHaveLength(0);
  });
});

describe('PUT /api/admin/users/:id/role', () => {
  it('lehnt Degradierung des letzten Admins mit 400 ab', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${admin.id}/role`)
      .set('Cookie', admin.cookie)
      .send({ role: 'user' });
    expect(res.status).toBe(400);
  });

  it('befördert einen normalen User zu Admin', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${regular.id}/role`)
      .set('Cookie', admin.cookie)
      .send({ role: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('admin');
  });
});

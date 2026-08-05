import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'teams-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let owner;
let coach;
let member;
let stranger;
let teamId;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  owner = await registerAndLogin('owner');
  coach = await registerAndLogin('coach');
  member = await registerAndLogin('member');
  stranger = await registerAndLogin('stranger');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('Team anlegen', () => {
  it('legt ein Team an, Ersteller wird automatisch owner', async () => {
    const res = await request(app)
      .post('/api/teams')
      .set('Cookie', owner.cookie)
      .send({ name: 'HC Test' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('HC Test');
    expect(res.body.data.role).toBe('owner');
    teamId = res.body.data._id;
  });

  it('erscheint in der eigenen Team-Liste', async () => {
    const res = await request(app).get('/api/teams').set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.some((t) => t._id === teamId)).toBe(true);
  });

  it('ein fremder Nutzer sieht das Team nicht (404 bei Detail-Abruf)', async () => {
    const res = await request(app).get(`/api/teams/${teamId}`).set('Cookie', stranger.cookie);
    expect(res.status).toBe(404);
  });
});

describe('Mitgliederverwaltung (Owner-only)', () => {
  let coachMemberId;

  it('lehnt Einladung durch einen Nicht-Owner mit 404 ab', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', stranger.cookie)
      .send({ email: coach.email, role: 'coach' });
    expect(res.status).toBe(404);
  });

  it('lehnt Einladung eines nicht existierenden Nutzers mit 404 ab', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', owner.cookie)
      .send({ email: 'nichtexistent-xyz@example.com', role: 'coach' });
    expect(res.status).toBe(404);
  });

  it('lehnt Selbst-Einladung mit 400 ab', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', owner.cookie)
      .send({ email: owner.email, role: 'coach' });
    expect(res.status).toBe(400);
  });

  it('owner lädt einen Co-Trainer ein', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', owner.cookie)
      .send({ email: coach.email, role: 'coach' });
    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('coach');
    coachMemberId = res.body.data._id;
  });

  it('lehnt doppelte Einladung mit 400 ab', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', owner.cookie)
      .send({ email: coach.email, role: 'member' });
    expect(res.status).toBe(400);
  });

  it('owner lädt ein Spieler-Mitglied (member) ein', async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/members`)
      .set('Cookie', owner.cookie)
      .send({ email: member.email, role: 'member' });
    expect(res.status).toBe(201);
  });

  it('eingeladenes Mitglied sieht das Team jetzt', async () => {
    const res = await request(app).get(`/api/teams/${teamId}`).set('Cookie', coach.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('coach');
  });

  it('listet alle Mitglieder (für jedes Mitglied sichtbar)', async () => {
    const res = await request(app).get(`/api/teams/${teamId}/members`).set('Cookie', coach.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3); // owner + coach + member
  });

  it('lehnt Rollenänderung durch einen Nicht-Owner (coach) mit 404 ab', async () => {
    const res = await request(app)
      .put(`/api/teams/${teamId}/members/${coachMemberId}`)
      .set('Cookie', coach.cookie)
      .send({ role: 'owner' });
    expect(res.status).toBe(404);
  });

  it('owner stuft den Co-Trainer auf member herab', async () => {
    const res = await request(app)
      .put(`/api/teams/${teamId}/members/${coachMemberId}`)
      .set('Cookie', owner.cookie)
      .send({ role: 'member' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('member');
  });

  it('owner kann sich nicht selbst degradieren, wenn er der letzte owner ist', async () => {
    const membersRes = await request(app).get(`/api/teams/${teamId}/members`).set('Cookie', owner.cookie);
    const ownerMemberId = membersRes.body.data.find((m) => m.email === owner.email)._id;
    const res = await request(app)
      .put(`/api/teams/${teamId}/members/${ownerMemberId}`)
      .set('Cookie', owner.cookie)
      .send({ role: 'coach' });
    expect(res.status).toBe(400);
  });

  it('owner kann das Team nicht verlassen, solange er der letzte owner ist', async () => {
    const membersRes = await request(app).get(`/api/teams/${teamId}/members`).set('Cookie', owner.cookie);
    const ownerMemberId = membersRes.body.data.find((m) => m.email === owner.email)._id;
    const res = await request(app)
      .delete(`/api/teams/${teamId}/members/${ownerMemberId}`)
      .set('Cookie', owner.cookie);
    expect(res.status).toBe(400);
  });

  it('ein Mitglied kann sich selbst entfernen (Team verlassen)', async () => {
    const res = await request(app)
      .delete(`/api/teams/${teamId}/members/${coachMemberId}`)
      .set('Cookie', coach.cookie);
    expect(res.status).toBe(200);
  });

  it('verlassenes Mitglied sieht das Team nicht mehr', async () => {
    const res = await request(app).get(`/api/teams/${teamId}`).set('Cookie', coach.cookie);
    expect(res.status).toBe(404);
  });
});

describe('Team umbenennen und löschen', () => {
  it('lehnt Umbenennen durch einen Nicht-Owner mit 404 ab', async () => {
    const res = await request(app)
      .put(`/api/teams/${teamId}`)
      .set('Cookie', member.cookie)
      .send({ name: 'Sollte fehlschlagen' });
    expect(res.status).toBe(404);
  });

  it('owner benennt das Team um', async () => {
    const res = await request(app)
      .put(`/api/teams/${teamId}`)
      .set('Cookie', owner.cookie)
      .send({ name: 'HC Test Umbenannt' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('HC Test Umbenannt');
  });

  it('lehnt Löschen durch ein Nicht-Owner-Mitglied mit 404 ab', async () => {
    const res = await request(app).delete(`/api/teams/${teamId}`).set('Cookie', member.cookie);
    expect(res.status).toBe(404);
  });

  it('owner löscht das Team', async () => {
    const res = await request(app).delete(`/api/teams/${teamId}`).set('Cookie', owner.cookie);
    expect(res.status).toBe(200);
  });

  it('gelöschtes Team ist für niemanden mehr sichtbar', async () => {
    const res = await request(app).get(`/api/teams/${teamId}`).set('Cookie', owner.cookie);
    expect(res.status).toBe(404);
  });
});

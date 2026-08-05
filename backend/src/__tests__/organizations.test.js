/**
 * organizations.test.js – Verein-Ebene als reine Verwaltungsebene über
 * mehreren Teams (ROADMAP Phase 2)
 */
import './setup.js';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/pool.js';
import redisClient, { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';

const TEST_EMAIL_PREFIX = 'orgs-test-';
const uniqueEmail = (tag) => `${TEST_EMAIL_PREFIX}${tag}-${Math.floor(Math.random() * 1e9)}@example.com`;

async function registerAndLogin(tag) {
  const email = uniqueEmail(tag);
  const res = await request(app).post('/api/auth/register').send({ email, password: 'Testpass123' });
  return { email, cookie: res.headers['set-cookie'][0] };
}

let admin;
let member;
let stranger;

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
  admin = await registerAndLogin('admin');
  member = await registerAndLogin('member');
  stranger = await registerAndLogin('stranger');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email LIKE $1', [`${TEST_EMAIL_PREFIX}%`]);
  await pool.end();
  await redisClient.quit();
});

describe('Verein anlegen und verwalten', () => {
  let orgId;

  it('Ersteller wird atomar als admin angelegt', async () => {
    const res = await request(app).post('/api/organizations').set('Cookie', admin.cookie).send({ name: 'Verein Musterstadt' });
    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('admin');
    orgId = res.body.data._id;
  });

  it('Fremder sieht den Verein nicht', async () => {
    const res = await request(app).get(`/api/organizations/${orgId}`).set('Cookie', stranger.cookie);
    expect(res.status).toBe(404);
  });

  it('admin lädt ein bestehendes Mitglied per E-Mail ein', async () => {
    const res = await request(app).post(`/api/organizations/${orgId}/members`).set('Cookie', admin.cookie).send({ email: member.email });
    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('member');
  });

  it('lehnt Einladung eines unbekannten Nutzers ab', async () => {
    const res = await request(app).post(`/api/organizations/${orgId}/members`).set('Cookie', admin.cookie).send({ email: 'unbekannt@example.com' });
    expect(res.status).toBe(404);
  });

  it('lehnt Doppel-Einladung ab', async () => {
    const res = await request(app).post(`/api/organizations/${orgId}/members`).set('Cookie', admin.cookie).send({ email: member.email });
    expect(res.status).toBe(400);
  });

  it('member (kein admin) darf niemanden einladen', async () => {
    const res = await request(app).post(`/api/organizations/${orgId}/members`).set('Cookie', member.cookie).send({ email: stranger.email });
    expect(res.status).toBe(404);
  });

  it('letzter Admin kann nicht degradiert werden', async () => {
    const membersRes = await request(app).get(`/api/organizations/${orgId}/members`).set('Cookie', admin.cookie);
    const adminMember = membersRes.body.data.find((m) => m.email === admin.email);
    const res = await request(app).put(`/api/organizations/${orgId}/members/${adminMember._id}`).set('Cookie', admin.cookie).send({ role: 'member' });
    expect(res.status).toBe(400);
  });

  it('member kann den Verein selbst verlassen', async () => {
    const membersRes = await request(app).get(`/api/organizations/${orgId}/members`).set('Cookie', admin.cookie);
    const memberRow = membersRes.body.data.find((m) => m.email === member.email);
    const res = await request(app).delete(`/api/organizations/${orgId}/members/${memberRow._id}`).set('Cookie', member.cookie);
    expect(res.status).toBe(200);
  });

  it('Team einem Verein zuordnen erfordert Org-Admin-Rolle', async () => {
    const asMember = await request(app).post('/api/teams').set('Cookie', member.cookie).send({ name: 'Sollte fehlschlagen', organizationId: orgId });
    expect(asMember.status).toBe(404);

    const asAdmin = await request(app).post('/api/teams').set('Cookie', admin.cookie).send({ name: 'Verwaltetes Team', organizationId: orgId });
    expect(asAdmin.status).toBe(201);
    expect(asAdmin.body.data.organizationId).toBe(orgId);
  });

  it('Org-Admin sieht das Team auch ohne eigene Team-Mitgliedschaft', async () => {
    const teamRes = await request(app).post('/api/teams').set('Cookie', member.cookie).send({ name: 'Team von Member' });
    const teamId = teamRes.body.data._id;
    await pool.query('UPDATE teams SET organization_id = $1 WHERE id = $2', [orgId, teamId]);

    const listRes = await request(app).get('/api/teams').set('Cookie', admin.cookie);
    const seen = listRes.body.data.find((t) => t._id === teamId);
    expect(seen).toBeDefined();
    expect(seen.role).toBe('org_admin');
  });

  it('Verein löschen setzt organization_id der Teams auf NULL, Teams bleiben erhalten', async () => {
    const teamRes = await request(app).get('/api/teams').set('Cookie', admin.cookie);
    const managedTeam = teamRes.body.data.find((t) => t.organizationId === orgId && t.role !== 'org_admin');

    const delRes = await request(app).delete(`/api/organizations/${orgId}`).set('Cookie', admin.cookie);
    expect(delRes.status).toBe(200);

    const check = await pool.query('SELECT organization_id FROM teams WHERE id = $1', [managedTeam._id]);
    expect(check.rows[0].organization_id).toBeNull();
  });
});

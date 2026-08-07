import './setup.js';
import request from 'supertest';
import app from '../server.js';

// COOKIE_SECURE ist in setup.js nicht gesetzt → HSTS_ENABLED in server.js
// ist standardmäßig aktiv (HSTS_ENABLED = COOKIE_SECURE !== 'false').
// Der deaktivierte Pfad (COOKIE_SECURE=false, z.B. Homelab-Deployment ohne
// verlässliches TLS davor) ist reine Boolean-Logik auf demselben, bereits
// an anderer Stelle getesteten Env-Flag – hier nur der Default-Fall.
describe('Security-Header (Helmet/HSTS)', () => {
  it('sendet standardmäßig einen Strict-Transport-Security-Header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('CSP script-src erlaubt kein unsafe-inline (Vite-Build lädt Skripte nur extern)', async () => {
    const res = await request(app).get('/health');
    const csp = res.headers['content-security-policy'];
    expect(csp).toBeDefined();
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'));
    expect(scriptSrc).not.toContain('unsafe-inline');
  });
});

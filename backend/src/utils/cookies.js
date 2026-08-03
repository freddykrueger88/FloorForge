/**
 * cookies – Gemeinsame Cookie-Optionen für das Auth-Token
 *
 * secure: true sendet das Cookie nur über HTTPS – Browser verwerfen es sonst
 * stillschweigend. Läuft die Instanz ohne TLS-Reverse-Proxy davor (z.B.
 * Homelab-Deployment über reines HTTP), muss COOKIE_SECURE=false gesetzt
 * werden, sonst wird jedes Login-Cookie sofort verworfen.
 */
export const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage in ms
  path: '/',
};

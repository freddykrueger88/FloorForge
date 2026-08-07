/**
 * presenceServer – Echtzeit-Präsenz MVP (ROADMAP-Backlog:
 * Echtzeit-Co-Editing / Live-Cursor)
 *
 * Umfang dieser ersten Ausbaustufe bewusst schmal: zeigt an, wer gerade
 * dasselbe Board geöffnet hat ("Anna, Max sind auch hier"). KEINE
 * Live-Cursor-Positionen, KEINE Konflikt-Auflösung bei simultanem
 * Bearbeiten derselben Ressource – beides bräuchte ein eigenes UX-Konzept
 * (wessen Änderung "gewinnt"?) und ist deutlich größerer Scope.
 *
 * WebSocket statt Server-Sent-Events, weil künftige Ausbaustufen
 * (Live-Cursor) ohnehin bidirektional sein müssen – SSE wäre für reine
 * Präsenz zwar auch ausreichend, aber eine spätere Migration auf WS für
 * Cursor-Daten würde den Client-Code doppelt anfassen.
 *
 * Auth: WebSocket-Upgrade-Requests laufen NICHT durch die normale Express-
 * Middleware-Kette (kein cookie-parser) – das Auth-Cookie wird hier daher
 * manuell aus dem rohen Cookie-Header gelesen, sonst identische Prüfung
 * wie middleware/auth.js (JWT verifizieren, Redis-Blacklist prüfen).
 */
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import redisClient from '../db/redis.js';
import logger from '../utils/logger.js';
import { assertBoardAccess } from '../utils/boardAccess.js';

const HEARTBEAT_INTERVAL_MS = 30_000;

// boardId -> Map<ws, { userId, displayName }>
const rooms = new Map();

function parseCookieHeader(header = '') {
  const out = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    if (!key) return;
    out[key] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

async function authenticateUpgrade(req) {
  const cookies = parseCookieHeader(req.headers.cookie);
  const token = cookies.token;
  if (!token) return null;

  try {
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const userRes = await pool.query('SELECT email, display_name FROM users WHERE id = $1', [decoded.sub]);
    if (userRes.rows.length === 0) return null;

    const { email, display_name: displayName } = userRes.rows[0];
    return { id: decoded.sub, displayName: displayName || email.split('@')[0] };
  } catch {
    return null;
  }
}

function broadcastPresence(boardId) {
  const room = rooms.get(boardId);
  if (!room) return;
  // Ein User kann (Tab-Duplikat, mehrere Geräte) mehrfach im selben Board-
  // Room sein – für die Anzeige nach userId deduplizieren.
  const seen = new Map();
  for (const { userId, displayName } of room.values()) {
    seen.set(userId, displayName);
  }
  const users = [...seen.entries()].map(([userId, displayName]) => ({ userId, displayName }));
  const msg = JSON.stringify({ type: 'presence', users });
  for (const ws of room.keys()) {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  }
}

export function attachPresenceServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    let url;
    try {
      url = new URL(req.url, 'http://localhost');
    } catch {
      socket.destroy();
      return;
    }
    if (url.pathname !== '/api/ws/presence') return; // fremder Upgrade-Pfad – nicht anfassen

    (async () => {
      const boardId = url.searchParams.get('boardId');
      const user = boardId ? await authenticateUpgrade(req) : null;
      if (!user || !(await assertBoardAccess(boardId, user.id, 'read'))) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, { user, boardId });
      });
    })().catch((err) => {
      logger.error('[presenceServer] upgrade error', err);
      socket.destroy();
    });
  });

  wss.on('connection', (ws, { user, boardId }) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    if (!rooms.has(boardId)) rooms.set(boardId, new Map());
    rooms.get(boardId).set(ws, { userId: user.id, displayName: user.displayName });
    broadcastPresence(boardId);

    ws.on('close', () => {
      const room = rooms.get(boardId);
      if (!room) return;
      room.delete(ws);
      if (room.size === 0) rooms.delete(boardId);
      else broadcastPresence(boardId);
    });
    ws.on('error', () => {});
  });

  // Tote Verbindungen (z.B. Laptop zugeklappt, kein sauberes close-Event)
  // regelmäßig aussortieren, sonst bleiben sie für immer als "anwesend" stehen.
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL_MS);
  wss.on('close', () => clearInterval(interval));

  return wss;
}

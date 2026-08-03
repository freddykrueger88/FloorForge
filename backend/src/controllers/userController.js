/**
 * userController – Account-Selbstverwaltung (Issue #22)
 * DELETE /api/user/account – Löscht den eigenen Account inkl. aller Daten.
 * Cascade-Deletes (settings/boards/frames/lines/exports → users) übernehmen
 * das Aufräumen, siehe backend/src/db/migrate.js.
 */
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import redisClient from '../db/redis.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';
import { COOKIE_OPTS } from '../utils/cookies.js';

export async function deleteAccount(req, res) {
  try {
    const userResult = await pool.query('SELECT email, role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json(error('Benutzer nicht gefunden'));
    }
    const user = userResult.rows[0];

    if ((req.body.email ?? '').trim().toLowerCase() !== user.email.toLowerCase()) {
      return res.status(400).json(error('E-Mail-Bestätigung stimmt nicht überein'));
    }

    if (user.role === 'admin') {
      const adminCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      if (parseInt(adminCount.rows[0].count, 10) <= 1) {
        return res.status(403).json(error('Letzter Admin-Account kann nicht gelöscht werden'));
      }
    }

    // Aktuelles Token blacklisten (analog Logout)
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await redisClient.setEx(`blacklist:${token}`, ttl, '1');
      }
    }

    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });

    logger.info(`User deleted own account: ${req.user.id}`);
    return res.json(success({ message: 'Account gelöscht' }));
  } catch (err) {
    logger.error('[deleteAccount]', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
}

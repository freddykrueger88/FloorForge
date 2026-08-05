/**
 * OpenFloorball – Auth Middleware
 */
import jwt from 'jsonwebtoken';
import redisClient from '../db/redis.js';
import { error } from '../utils/apiResponse.js';

export async function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json(error('Nicht authentifiziert'));
  }

  try {
    // Token-Blacklist prüfen
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(401).json(error('Token ungültig (ausgeloggt)'));
    }

    // Hinweis: `role` stammt aus dem Token-Payload (Stand beim Login), nicht
    // aus einer Live-Abfrage der DB. Ändert sich die Rolle eines Users später
    // (z.B. über ein künftiges Admin-Panel, Issue #26), wirkt das erst nach
    // Ablauf/Neu-Login des bestehenden Tokens (JWT_EXPIRES_IN).
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json(error('Token abgelaufen'));
    }
    return res.status(401).json(error('Ungültiger Token'));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json(error('Keine Berechtigung'));
  }
  next();
}

/**
 * FloorForge – Auth Middleware
 */
import jwt from 'jsonwebtoken';
import redisClient from '../db/redis.js';
import { error } from '../utils/apiResponse.js';

export async function authenticate(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json(error('Nicht authentifiziert'));
  }

  try {
    // Token-Blacklist prüfen
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(401).json(error('Token ungültig (ausgeloggt)'));
    }

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

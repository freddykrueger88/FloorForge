/**
 * FloorForge – Auth Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 */
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';
import redisClient from '../db/redis.js';
import { authenticate } from '../middleware/auth.js';
import { success, created, error } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

const router = Router();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Cookie-Optionen
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage in ms
  path: '/',
};

// ── Validierungsregeln ─────────────────────────
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Ungültige E-Mail-Adresse'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Passwort muss mindestens 8 Zeichen haben')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Passwort muss Groß-, Kleinbuchstaben und eine Zahl enthalten'),
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name zu lang'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Ungültige E-Mail-Adresse'),
  body('password').notEmpty().withMessage('Passwort erforderlich'),
];

// ── Helper: JWT erstellen ──────────────────────
function signToken(userId, role) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' }
  );
}

// ── POST /api/auth/register ────────────────────
router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(error('Validierungsfehler', errors.array()));
  }

  const { email, password, name } = req.body;

  try {
    // Prüfen ob bereits ein User existiert → erster User = Admin
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const isFirstUser = parseInt(countResult.rows[0].count, 10) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // E-Mail Duplikat prüfen
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json(error('E-Mail bereits registriert'));
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // User anlegen
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role, name, created_at`,
      [email, passwordHash, role, name || null]
    );
    const user = result.rows[0];

    // JWT
    const token = signToken(user.id, user.role);
    res.cookie('token', token, COOKIE_OPTS);

    logger.info(`User registered: ${email} (role: ${role})`);
    return res.status(201).json(created({ user: { id: user.id, email: user.email, role: user.role, name: user.name } }));
  } catch (err) {
    logger.error('Register error:', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
});

// ── POST /api/auth/login ───────────────────────
router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(error('Validierungsfehler', errors.array()));
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Timing-Safe: auch hash wenn kein User (verhindert User-Enumeration)
      await bcrypt.hash('dummy', 10);
      return res.status(401).json(error('Ungültige Anmeldedaten'));
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json(error('Ungültige Anmeldedaten'));
    }

    const token = signToken(user.id, user.role);
    res.cookie('token', token, COOKIE_OPTS);

    logger.info(`User logged in: ${email}`);
    return res.json(success({ user: { id: user.id, email: user.email, role: user.role, name: user.name } }));
  } catch (err) {
    logger.error('Login error:', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
});

// ── POST /api/auth/logout ──────────────────────
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Token in Redis-Blacklist für verbleibende Gültigkeit
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redisClient.setEx(`blacklist:${token}`, ttl, '1');
        }
      }
    }
    res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });
    logger.info(`User logged out: ${req.user.email}`);
    return res.json(success({ message: 'Erfolgreich abgemeldet' }));
  } catch (err) {
    logger.error('Logout error:', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
});

// ── GET /api/auth/me ───────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Benutzer nicht gefunden'));
    }
    return res.json(success({ user: result.rows[0] }));
  } catch (err) {
    logger.error('Me error:', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
});

export default router;

/**
 * FloorForge – Express Server
 */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { runMigrations } from './db/migrate.js';
import { connectRedis } from './db/redis.js';
import { rescheduleBackupCron } from './services/backupCron.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { anonymizeIp } from './utils/anonymizeIp.js';

// DSGVO: IP-Adresse in Zugriffs-Logs anonymisieren (Issue #20) – ersetzt
// :remote-addr im morgan-Format unten, respektiert `trust proxy` (Zeile 22).
morgan.token('anon-addr', (req) => anonymizeIp(req.ip));

const app = express();
const PORT = process.env.PORT || 3001;

// Backend läuft hinter dem Nginx-Reverse-Proxy (docker-compose) – erster Hop vertrauenswürdig
app.set('trust proxy', 1);

// ── Security ──────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Konva.js
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiter ──────────────────────────────
// In Tests deaktiviert (analog zum Morgan-Logging unten), damit automatisierte
// Testläufe nicht durch produktionsrelevante Limits verfälscht werden.
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Zu viele Anfragen, bitte warten.' },
  }));

  app.use('/api/auth/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Zu viele Login-Versuche, bitte warten.' },
  }));
}

// ── Parser ────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────
// Format entspricht 'combined', nur mit :anon-addr statt :remote-addr
// (DSGVO – keine vollständigen IP-Adressen in Logs, Issue #20)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':anon-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));
}

// ── Health Check ─────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'floorforge-backend' });
});

// ── API Routes ────────────────────────────────
app.use('/api', apiRoutes);

// ── Error Handling ────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────
// JWT_SECRET wurde bisher erst beim ersten Login-Versuch geprüft (jsonwebtoken
// wirft dann eine kryptische Fehlermeldung) – hier stattdessen sofort beim
// Start mit klarer Meldung abbrechen, falls es fehlt oder zu kurz ist.
function validateEnv() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    logger.error('JWT_SECRET fehlt oder ist kürzer als 32 Zeichen – Server-Start abgebrochen.');
    process.exit(1);
  }
}

async function bootstrap() {
  try {
    validateEnv();
    await connectRedis();
    await runMigrations();
    await rescheduleBackupCron();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`FloorForge Backend läuft auf Port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    logger.error('Bootstrap failed:', err);
    process.exit(1);
  }
}

// In Tests wird `app` direkt importiert (supertest) – DB/Redis-Setup und
// app.listen() übernimmt dort die Test-Suite selbst (siehe __tests__/setup.js)
if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}

export default app;

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
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

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
      fontSrc: ["'self'", 'https://api.fontshare.com'],
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

// ── Parser ────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
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
async function bootstrap() {
  try {
    await connectRedis();
    await runMigrations();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`FloorForge Backend läuft auf Port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    logger.error('Bootstrap failed:', err);
    process.exit(1);
  }
}

bootstrap();

export default app;

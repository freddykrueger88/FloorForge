/**
 * FloorForge Backend – Entry Point
 * Issue #1: Backend Grundstruktur
 */
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// --- Sicherheits-Middleware ---
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Konva.js Canvas benötigt das
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} nicht erlaubt`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());

// Logging (nicht in Tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen, bitte später erneut versuchen.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Strengeres Limit für Auth-Endpunkte
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Login-Versuche, bitte 15 Minuten warten.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// --- Health Check (kein Auth) ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// --- API Routen ---
app.use('/api', apiRoutes);

// --- Fehlerbehandlung (immer zuletzt) ---
app.use(notFound);
app.use(errorHandler);

// Server starten (nicht in Test-Umgebung)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏒 FloorForge Backend läuft auf Port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

module.exports = app;

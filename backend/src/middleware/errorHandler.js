/**
 * OpenFloorball – Zentrale Fehlerbehandlung
 */
import logger from '../utils/logger.js';

/**
 * 404 Handler – Route nicht gefunden
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} existiert nicht.`,
    status: 404,
  });
};

/**
 * 500 Handler – Interne Serverfehler
 */
export const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  // Fehler loggen (nicht in Tests)
  if (process.env.NODE_ENV !== 'test') {
    logger.error(`[ERROR] ${status} ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  }

  res.status(status).json({
    error: message,
    status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * OpenFloorball – Winston Logger
 */
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) =>
          `${timestamp} [${level}] ${stack || message}`
        )
      )
  ),
  transports: [
    new winston.transports.Console(),
    // Datensparsamkeit: begrenzte Größe/Anzahl statt unbegrenzt wachsender
    // Log-Dateien (sonst überdauern personenbezogene Daten in alten Log-
    // Einträgen eine Account-Löschung unbegrenzt lange)
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 10 * 1024 * 1024, maxFiles: 5 }),
      new winston.transports.File({ filename: 'logs/combined.log', maxsize: 10 * 1024 * 1024, maxFiles: 5 }),
    ] : []),
  ],
});

export default logger;

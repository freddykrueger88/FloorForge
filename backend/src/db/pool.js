/**
 * FloorForge – PostgreSQL Connection Pool
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'floorforge',
  user: process.env.DB_USER || 'floorforge',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Verbindungsfehler loggen (verhindert unhandled rejection)
pool.on('error', (err) => {
  console.error('[DB] Unerwarteter PostgreSQL-Fehler:', err.message);
});

/**
 * Datenbankverbindung testen
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[DB] PostgreSQL Verbindung erfolgreich');
    return true;
  } catch (err) {
    console.error('[DB] Verbindung fehlgeschlagen:', err.message);
    return false;
  }
};

module.exports = { pool, testConnection };

/**
 * FloorForge – Datenbank Migration
 * Vollständige Schema-Migration folgt in Issue #5
 */
require('dotenv').config();
const { pool } = require('./pool');

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('[MIGRATE] Starte Datenbank-Migration...');

    await client.query('BEGIN');

    // UUID Extension aktivieren
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Users Tabelle (Basis, vollständig in Issue #4 & #5)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query('COMMIT');
    console.log('[MIGRATE] Migration erfolgreich abgeschlossen.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[MIGRATE] Fehler:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(() => process.exit(1));

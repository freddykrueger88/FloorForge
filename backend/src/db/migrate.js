/**
 * FloorForge – Datenbankmigrationen
 * Wird beim Start des Backends automatisch ausgeführt.
 */
import pool from './pool.js';
import logger from '../utils/logger.js';

export async function runMigrations() {
  const client = await pool.connect();
  try {
    logger.info('Running database migrations...');

    await client.query('BEGIN');

    // UUID Extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // ── users ──────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        name          TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // updated_at Trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // ── sessions (Token-Blacklist via Redis – keine DB-Tabelle nötig) ──
    // Redis übernimmt die Token-Invalidierung, kein DB-Overhead.

    await client.query('COMMIT');
    logger.info('Database migrations completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Migration failed, rolled back:', err);
    throw err;
  } finally {
    client.release();
  }
}

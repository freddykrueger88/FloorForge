/**
 * FloorForge – Datenbankmigrationen
 * Vollständiges Schema: users, boards, frames, lines, exports, settings
 */
import pool from './pool.js';
import logger from '../utils/logger.js';

export async function runMigrations() {
  const client = await pool.connect();
  try {
    logger.info('Running database migrations...');
    await client.query('BEGIN');

    // Extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // ── updated_at Trigger Funktion ──────────────────────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE 'plpgsql';
    `);

    // ── users ────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        display_name  TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
      CREATE TRIGGER trg_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

    // ── settings ─────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id          UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        preferences_json JSONB NOT NULL DEFAULT '{}',
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
      CREATE TRIGGER trg_settings_updated_at
        BEFORE UPDATE ON settings
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);`);

    // ── boards ────────────────────────────────────────────────────────────
    // field_type: 'large' | 'small' | 'street' | '3v3'
    await client.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name        TEXT NOT NULL,
        field_type  TEXT NOT NULL DEFAULT 'large'
                    CHECK (field_type IN ('large', 'small', 'street', '3v3')),
        description TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      DROP TRIGGER IF EXISTS trg_boards_updated_at ON boards;
      CREATE TRIGGER trg_boards_updated_at
        BEFORE UPDATE ON boards
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at DESC);`);

    // ── frames ────────────────────────────────────────────────────────────
    // data_json: { players: [...], arrows: [...], lines: [...] }
    await client.query(`
      CREATE TABLE IF NOT EXISTS frames (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        order_index INTEGER NOT NULL DEFAULT 0,
        data_json   JSONB NOT NULL DEFAULT '{}',
        duration_ms INTEGER NOT NULL DEFAULT 1000,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_frames_board_id ON frames(board_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_frames_order ON frames(board_id, order_index);`);

    // ── lines (Sturmreihen / Linien-Konfiguration) ────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS lines (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        board_id        UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        name            TEXT NOT NULL,
        color           TEXT NOT NULL DEFAULT '#3B82F6',
        player_ids_json JSONB NOT NULL DEFAULT '[]',
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_lines_board_id ON lines(board_id);`);

    // ── exports ───────────────────────────────────────────────────────────
    // format: 'gif' | 'mp4' | 'pdf' | 'link' | 'png'
    await client.query(`
      CREATE TABLE IF NOT EXISTS exports (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        format      TEXT NOT NULL CHECK (format IN ('gif', 'mp4', 'pdf', 'link', 'png')),
        file_path   TEXT,
        share_token TEXT UNIQUE,
        expires_at  TIMESTAMPTZ,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_exports_board_id ON exports(board_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_exports_share_token ON exports(share_token) WHERE share_token IS NOT NULL;`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_exports_expires_at ON exports(expires_at) WHERE expires_at IS NOT NULL;`);

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

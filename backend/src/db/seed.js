/**
 * FloorForge – Datenbank Seed
 * Legt Test-/Entwicklungsdaten an
 */
require('dotenv').config();
const { pool } = require('./pool');
const bcrypt = require('bcryptjs');

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('[SEED] Starte Seed...');

    // Admin-User anlegen (nur wenn noch nicht vorhanden)
    const existing = await client.query('SELECT id FROM users WHERE email = $1', ['admin@floorforge.local']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('FloorForge2026!', 12);
      await client.query(
        'INSERT INTO users (email, password_hash, display_name, role) VALUES ($1, $2, $3, $4)',
        ['admin@floorforge.local', hash, 'Admin', 'admin']
      );
      console.log('[SEED] Admin-User angelegt: admin@floorforge.local');
    } else {
      console.log('[SEED] Admin-User existiert bereits, übersprungen.');
    }

    console.log('[SEED] Seed abgeschlossen.');
  } catch (err) {
    console.error('[SEED] Fehler:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch(() => process.exit(1));

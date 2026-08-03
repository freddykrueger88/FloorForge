/**
 * settingsController – User-Einstellungen (Issue #18)
 * Ein JSONB-Blob pro User in der bestehenden `settings`-Tabelle.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';

// GET /api/settings
export async function getSettings(req, res) {
  try {
    const result = await pool.query(
      'SELECT preferences_json FROM settings WHERE user_id = $1',
      [req.user.id]
    );
    res.json(success(result.rows[0]?.preferences_json ?? {}));
  } catch (err) {
    logger.error('[getSettings]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/settings – merged Partial-Update
export async function updateSettings(req, res) {
  try {
    const patch = req.body ?? {};
    const result = await pool.query(
      `INSERT INTO settings (user_id, preferences_json)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (user_id) DO UPDATE
         SET preferences_json = settings.preferences_json || $2::jsonb
       RETURNING preferences_json`,
      [req.user.id, JSON.stringify(patch)]
    );
    res.json(success(result.rows[0].preferences_json));
  } catch (err) {
    logger.error('[updateSettings]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

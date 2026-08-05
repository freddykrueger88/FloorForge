/**
 * exportUserData – Baut das vollständige Backup-JSON eines Users
 * (Issue #21). Wird sowohl vom manuellen Export (routes/user.js) als
 * auch vom automatischen Backup-Cron (services/backupCron.js) genutzt.
 */
import pool from '../db/pool.js';
import { toApiFrame } from '../controllers/framesController.js';
import { toApiLine } from '../controllers/linesController.js';

export const BACKUP_FORMAT = 'openfloorball-backup-v1';

export async function buildUserExport(userId) {
  const userResult = await pool.query(
    'SELECT email, display_name AS name, role, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (userResult.rows.length === 0) {
    throw new Error('Benutzer nicht gefunden');
  }
  const account = userResult.rows[0];

  const settingsResult = await pool.query(
    'SELECT preferences_json FROM settings WHERE user_id = $1',
    [userId]
  );
  const settings = settingsResult.rows[0]?.preferences_json ?? {};

  const boardsResult = await pool.query(
    `SELECT * FROM boards WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
    [userId]
  );

  const boards = [];
  for (const b of boardsResult.rows) {
    const framesResult = await pool.query(
      'SELECT * FROM frames WHERE board_id = $1 ORDER BY order_index ASC',
      [b.id]
    );
    const linesResult = await pool.query(
      'SELECT * FROM lines WHERE board_id = $1 ORDER BY order_index ASC, created_at ASC',
      [b.id]
    );

    boards.push({
      name:         b.name,
      notes:        b.notes,
      fieldType:    b.field_type,
      theme:        b.theme,
      homeColor:    b.home_color,
      awayColor:    b.away_color,
      ballColor:    b.ball_color,
      showGrid:     b.show_grid,
      showNames:    b.show_names,
      namePosition: b.name_position,
      createdAt:    b.created_at,
      frames:       framesResult.rows.map(toApiFrame),
      lines:        linesResult.rows.map(toApiLine),
    });
  }

  return {
    format: BACKUP_FORMAT,
    exportedAt: new Date().toISOString(),
    account: {
      email: account.email,
      name: account.name,
      role: account.role,
      createdAt: account.created_at,
    },
    settings,
    boards,
  };
}

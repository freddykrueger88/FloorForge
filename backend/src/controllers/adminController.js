/**
 * adminController – Benutzerverwaltung für Admins (Issue #26)
 * Alle Routen liegen hinter authenticate + requireAdmin (routes/admin.js).
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';
import { rescheduleBackupCron } from '../services/backupCron.js';
import { deleteCommentsForUser } from './commentsController.js';

async function adminCount() {
  const result = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
  return parseInt(result.rows[0].count, 10);
}

// GET /api/admin/users
export async function listUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, email, role, display_name AS name, created_at FROM users ORDER BY created_at ASC'
    );
    res.json(success(result.rows));
  } catch (err) {
    logger.error('[listUsers]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json(error('Du kannst dich nicht selbst löschen'));
    }

    const target = await pool.query('SELECT role FROM users WHERE id = $1', [req.params.id]);
    if (target.rows.length === 0) {
      return res.status(404).json(error('Benutzer nicht gefunden'));
    }
    if (target.rows[0].role === 'admin' && (await adminCount()) <= 1) {
      return res.status(400).json(error('Letzter Admin kann nicht gelöscht werden'));
    }

    // Siehe userController.deleteAccount: Boards/Trainingseinheiten werden
    // per CASCADE hart gelöscht, ohne die dortige Kommentar-Aufräumung zu
    // durchlaufen – vorher explizit anstoßen, sonst blieben Kommentare
    // anderer Nutzer als verwaiste Zeilen zurück.
    await deleteCommentsForUser(req.params.id);
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    logger.info(`Admin ${req.user.id} deleted user ${req.params.id}`);
    res.json(success({ message: 'Benutzer gelöscht' }));
  } catch (err) {
    logger.error('[deleteUser]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/admin/users/:id/role   Body: { role: 'admin' | 'user' }
export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;

    const target = await pool.query('SELECT role FROM users WHERE id = $1', [req.params.id]);
    if (target.rows.length === 0) {
      return res.status(404).json(error('Benutzer nicht gefunden'));
    }
    if (target.rows[0].role === 'admin' && role === 'user' && (await adminCount()) <= 1) {
      return res.status(400).json(error('Letzter Admin kann nicht degradiert werden'));
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role, display_name AS name, created_at',
      [role, req.params.id]
    );
    logger.info(`Admin ${req.user.id} set role of ${req.params.id} to ${role}`);
    res.json(success(result.rows[0]));
  } catch (err) {
    logger.error('[updateUserRole]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// GET /api/admin/backup-config (Issue #21)
export async function getBackupConfig(req, res) {
  try {
    const result = await pool.query('SELECT * FROM app_config LIMIT 1');
    const row = result.rows[0];
    res.json(success({
      enabled: row.backup_enabled,
      schedule: row.backup_schedule,
      retention: row.backup_retention,
    }));
  } catch (err) {
    logger.error('[getBackupConfig]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/admin/backup-config   Body: { enabled, schedule, retention }
export async function updateBackupConfig(req, res) {
  try {
    const { enabled, schedule, retention } = req.body;
    const result = await pool.query(
      `UPDATE app_config SET backup_enabled = $1, backup_schedule = $2, backup_retention = $3
       RETURNING *`,
      [enabled, schedule, retention]
    );
    await rescheduleBackupCron();
    const row = result.rows[0];
    logger.info(`Admin ${req.user.id} updated backup config`);
    res.json(success({
      enabled: row.backup_enabled,
      schedule: row.backup_schedule,
      retention: row.backup_retention,
    }));
  } catch (err) {
    logger.error('[updateBackupConfig]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

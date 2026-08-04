/**
 * playbooksController – CRUD für Playbooks (Board-Sammlungen, Issue #52)
 *
 * Nutzer-gebunden statt board-gebunden (analog formationsController.js).
 * Ein Board gehört zu maximal einem Playbook (boards.playbook_id,
 * ON DELETE SET NULL – Boards bleiben beim Löschen eines Playbooks
 * erhalten, nur die Zuordnung entfällt).
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

const MAX_PLAYBOOKS = 15;

function toApiPlaybook(row) {
  return {
    _id:       row.id,
    name:      row.name,
    createdAt: row.created_at,
  };
}

// GET /api/playbooks
export async function getPlaybooks(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM playbooks WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(success(result.rows.map(toApiPlaybook)));
  } catch (err) {
    logger.error('[getPlaybooks]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/playbooks
export async function createPlaybook(req, res) {
  try {
    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM playbooks WHERE user_id = $1',
      [req.user.id]
    );
    if (countResult.rows[0].count >= MAX_PLAYBOOKS) {
      return res.status(400).json(error(`Maximal ${MAX_PLAYBOOKS} Playbooks`));
    }

    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO playbooks (user_id, name) VALUES ($1, $2) RETURNING *',
      [req.user.id, name]
    );
    res.status(201).json(created(toApiPlaybook(result.rows[0])));
  } catch (err) {
    logger.error('[createPlaybook]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/playbooks/:id
export async function deletePlaybook(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM playbooks WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Playbook nicht gefunden'));
    }
    res.json(success({ message: 'Playbook gelöscht' }));
  } catch (err) {
    logger.error('[deletePlaybook]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

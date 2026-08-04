/**
 * formationsController – CRUD für wiederverwendbare Formations-Vorlagen
 * (Issue #46)
 *
 * Anders als frames/lines nutzer-gebunden statt board-gebunden – eine
 * Vorlage ist über alle eigenen Boards hinweg wiederverwendbar.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

const MAX_FORMATIONS = 20;

function toApiFormation(row) {
  return {
    _id:       row.id,
    name:      row.name,
    fieldType: row.field_type,
    players:   row.players_json ?? [],
    createdAt: row.created_at,
  };
}

// GET /api/formations
export async function getFormations(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM formation_templates WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(success(result.rows.map(toApiFormation)));
  } catch (err) {
    logger.error('[getFormations]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/formations
export async function createFormation(req, res) {
  try {
    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM formation_templates WHERE user_id = $1',
      [req.user.id]
    );
    if (countResult.rows[0].count >= MAX_FORMATIONS) {
      return res.status(400).json(error(`Maximal ${MAX_FORMATIONS} Formations-Vorlagen`));
    }

    const { name, fieldType = 'large', players = [] } = req.body;
    const result = await pool.query(
      `INSERT INTO formation_templates (user_id, name, field_type, players_json)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING *`,
      [req.user.id, name, fieldType, JSON.stringify(players)]
    );
    res.status(201).json(created(toApiFormation(result.rows[0])));
  } catch (err) {
    logger.error('[createFormation]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/formations/:id
export async function deleteFormation(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM formation_templates WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Vorlage nicht gefunden'));
    }
    res.json(success({ message: 'Vorlage gelöscht' }));
  } catch (err) {
    logger.error('[deleteFormation]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

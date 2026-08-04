/**
 * rosterController – CRUD für den zentralen Team-Kader (Issue #53)
 *
 * Nutzer-gebunden statt board-gebunden (analog playbooksController.js).
 * Rein additiv: Board-Spielerdaten bleiben frei editierbar, ein
 * Kader-Eintrag dient nur als optionale Zuweisungsvorlage.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

const MAX_ROSTER_PLAYERS = 40;

function toApiRosterPlayer(row) {
  return {
    _id:           row.id,
    name:          row.name,
    jerseyNumber:  row.jersey_number,
    role:          row.role,
    createdAt:     row.created_at,
  };
}

// GET /api/roster
export async function getRosterPlayers(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM roster_players WHERE user_id = $1 ORDER BY jersey_number ASC NULLS LAST, name ASC',
      [req.user.id]
    );
    res.json(success(result.rows.map(toApiRosterPlayer)));
  } catch (err) {
    logger.error('[getRosterPlayers]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/roster
export async function createRosterPlayer(req, res) {
  try {
    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM roster_players WHERE user_id = $1',
      [req.user.id]
    );
    if (countResult.rows[0].count >= MAX_ROSTER_PLAYERS) {
      return res.status(400).json(error(`Maximal ${MAX_ROSTER_PLAYERS} Kader-Spieler`));
    }

    const { name, jerseyNumber = null, role = null } = req.body;
    const result = await pool.query(
      'INSERT INTO roster_players (user_id, name, jersey_number, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, jerseyNumber, role]
    );
    res.status(201).json(created(toApiRosterPlayer(result.rows[0])));
  } catch (err) {
    logger.error('[createRosterPlayer]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/roster/:id
export async function updateRosterPlayer(req, res) {
  try {
    const sets = [];
    const values = [];
    let i = 1;

    if (req.body.name !== undefined)         { sets.push(`name = $${i}`); values.push(req.body.name); i += 1; }
    if (req.body.jerseyNumber !== undefined)  { sets.push(`jersey_number = $${i}`); values.push(req.body.jerseyNumber); i += 1; }
    if (req.body.role !== undefined)          { sets.push(`role = $${i}`); values.push(req.body.role); i += 1; }

    if (sets.length === 0) {
      return res.status(400).json(error('Keine gültigen Felder zum Aktualisieren'));
    }

    values.push(req.params.id, req.user.id);
    const result = await pool.query(
      `UPDATE roster_players SET ${sets.join(', ')}
       WHERE id = $${i} AND user_id = $${i + 1}
       RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Kader-Spieler nicht gefunden'));
    }
    res.json(success(toApiRosterPlayer(result.rows[0])));
  } catch (err) {
    logger.error('[updateRosterPlayer]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/roster/:id
export async function deleteRosterPlayer(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM roster_players WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Kader-Spieler nicht gefunden'));
    }
    res.json(success({ message: 'Kader-Spieler gelöscht' }));
  } catch (err) {
    logger.error('[deleteRosterPlayer]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

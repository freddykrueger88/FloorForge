/**
 * boardsController – CRUD für Spielfelder (Boards)
 *
 * Persistenz: PostgreSQL (siehe db/migrate.js), NICHT Mongoose/MongoDB.
 * Alle Boards sind an req.user.id (JWT, via authenticate-Middleware) gebunden –
 * ein User sieht/bearbeitet ausschließlich eigene Boards.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

// snake_case (DB) → camelCase (API/Frontend)
function toApiBoard(row) {
  return {
    _id:          row.id,
    name:         row.name,
    notes:        row.notes,
    fieldType:    row.field_type,
    theme:        row.theme,
    homeColor:    row.home_color,
    awayColor:    row.away_color,
    ballColor:    row.ball_color,
    showGrid:     row.show_grid,
    showNames:    row.show_names,
    namePosition: row.name_position,
    activeLineId: row.active_line_id,
    players:      row.players_json,
    elements:     row.elements_json,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  };
}

// GET /api/boards – nur Metadaten, kein players/elements (Kachel-/Galerie-Übersicht)
export async function getBoards(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, notes, field_type, theme, home_color, away_color, ball_color,
              show_grid, show_names, name_position, created_at, updated_at
       FROM boards
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY updated_at DESC
       LIMIT 200`,
      [req.user.id]
    );
    res.json(success(result.rows.map(toApiBoard)));
  } catch (err) {
    logger.error('[getBoards]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// GET /api/boards/:id
export async function getBoard(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM boards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Spielfeld nicht gefunden'));
    }
    res.json(success(toApiBoard(result.rows[0])));
  } catch (err) {
    logger.error('[getBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/boards
export async function createBoard(req, res) {
  try {
    const { name, fieldType = 'large', theme = 'dark' } = req.body;
    const result = await pool.query(
      `INSERT INTO boards (user_id, name, field_type, theme)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, name, fieldType, theme]
    );
    res.status(201).json(created(toApiBoard(result.rows[0])));
  } catch (err) {
    logger.error('[createBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/boards/:id
const UPDATABLE_COLUMNS = {
  name:         'name',
  notes:        'notes',
  fieldType:    'field_type',
  theme:        'theme',
  homeColor:    'home_color',
  awayColor:    'away_color',
  ballColor:    'ball_color',
  showGrid:     'show_grid',
  showNames:    'show_names',
  namePosition: 'name_position',
  players:      'players_json',
  elements:     'elements_json',
};

export async function updateBoard(req, res) {
  try {
    const sets = [];
    const values = [];
    let i = 1;

    for (const [apiKey, column] of Object.entries(UPDATABLE_COLUMNS)) {
      if (req.body[apiKey] !== undefined) {
        const isJson = column.endsWith('_json');
        sets.push(`${column} = $${i}${isJson ? '::jsonb' : ''}`);
        values.push(isJson ? JSON.stringify(req.body[apiKey]) : req.body[apiKey]);
        i += 1;
      }
    }

    if (sets.length === 0) {
      return res.status(400).json(error('Keine gültigen Felder zum Aktualisieren'));
    }

    values.push(req.params.id, req.user.id);
    const result = await pool.query(
      `UPDATE boards SET ${sets.join(', ')}
       WHERE id = $${i} AND user_id = $${i + 1} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json(error('Spielfeld nicht gefunden'));
    }
    res.json(success(toApiBoard(result.rows[0])));
  } catch (err) {
    logger.error('[updateBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/boards/:id (Soft-Delete)
export async function deleteBoard(req, res) {
  try {
    const result = await pool.query(
      `UPDATE boards SET deleted_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Spielfeld nicht gefunden'));
    }
    res.json(success({ message: 'Spielfeld gelöscht' }));
  } catch (err) {
    logger.error('[deleteBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

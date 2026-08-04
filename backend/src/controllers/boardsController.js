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
import { buildDefaultPlayers } from '../constants/defaultPositions.js';

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
    playbookId:   row.playbook_id,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  };
}

// Issue #52: verhindert Zuordnung eines Boards zu einem fremden Playbook
async function assertPlaybookOwnership(playbookId, userId) {
  const result = await pool.query(
    'SELECT id FROM playbooks WHERE id = $1 AND user_id = $2',
    [playbookId, userId]
  );
  return result.rows.length > 0;
}

// GET /api/boards – nur Metadaten, kein players/elements (Kachel-/Galerie-Übersicht)
export async function getBoards(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, name, notes, field_type, theme, home_color, away_color, ball_color,
              show_grid, show_names, name_position, playbook_id, created_at, updated_at
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
// Legt Board + ersten Frame mit Standard-Aufstellung atomar in einer
// Transaktion an – Spieler stehen dadurch garantiert ab dem ersten
// Laden auf dem Feld, unabhängig von Client-seitigem Timing.
export async function createBoard(req, res) {
  const {
    name, fieldType = 'large', theme = 'dark',
    homeColor = '#1d4ed8', awayColor = '#dc2626', ballColor = '#ffffff',
    playbookId = null,
  } = req.body;

  try {
    if (playbookId && !(await assertPlaybookOwnership(playbookId, req.user.id))) {
      return res.status(404).json(error('Playbook nicht gefunden'));
    }
  } catch (err) {
    logger.error('[createBoard]', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO boards (user_id, name, field_type, theme, home_color, away_color, ball_color, playbook_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, name, fieldType, theme, homeColor, awayColor, ballColor, playbookId]
    );
    const board = result.rows[0];

    const dataJson = { label: '', players: buildDefaultPlayers(fieldType), elements: [] };
    await client.query(
      `INSERT INTO frames (board_id, order_index, data_json, duration_ms)
       VALUES ($1, 0, $2::jsonb, 1000)`,
      [board.id, JSON.stringify(dataJson)]
    );

    await client.query('COMMIT');
    res.status(201).json(created(toApiBoard(board)));
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('[createBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  } finally {
    client.release();
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
  playbookId:   'playbook_id',
};

export async function updateBoard(req, res) {
  try {
    if (req.body.playbookId && !(await assertPlaybookOwnership(req.body.playbookId, req.user.id))) {
      return res.status(404).json(error('Playbook nicht gefunden'));
    }

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

/**
 * linesController – CRUD für Lines (Sturm-/Defensivreihen) eines Boards
 * (Issue #12 – v0.4.0)
 *
 * Persistenz: eigene `lines`-Tabelle (Postgres), referenziert über board_id.
 * player_ids_json hält die zugewiesenen Spieler-IDs (player.id aus dem
 * Frontend-Frame, nicht die DB-ID).
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

const MAX_LINES = 10;

export function toApiLine(row) {
  return {
    _id:       row.id,
    name:      row.name,
    color:     row.color,
    type:      row.type,
    playerIds: row.player_ids_json ?? [],
    order:     row.order_index,
  };
}

async function assertBoardOwnership(boardId, userId) {
  const result = await pool.query(
    'SELECT id FROM boards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
    [boardId, userId]
  );
  return result.rows.length > 0;
}

// GET /api/boards/:id/lines
export async function getLines(req, res) {
  try {
    if (!(await assertBoardOwnership(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const result = await pool.query(
      'SELECT * FROM lines WHERE board_id = $1 ORDER BY order_index ASC, created_at ASC',
      [req.params.id]
    );
    res.json(success(result.rows.map(toApiLine)));
  } catch (err) {
    logger.error('[getLines]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/boards/:id/lines
export async function createLine(req, res) {
  try {
    if (!(await assertBoardOwnership(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM lines WHERE board_id = $1',
      [req.params.id]
    );
    if (countResult.rows[0].count >= MAX_LINES) {
      return res.status(400).json(error(`Maximal ${MAX_LINES} Lines pro Board`));
    }

    const { name, color = '#facc15', type = 'offense', playerIds = [] } = req.body;
    const order = countResult.rows[0].count;

    const result = await pool.query(
      `INSERT INTO lines (board_id, name, color, type, player_ids_json, order_index)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)
       RETURNING *`,
      [req.params.id, name, color, type, JSON.stringify(playerIds), order]
    );
    res.status(201).json(created(toApiLine(result.rows[0])));
  } catch (err) {
    logger.error('[createLine]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/boards/:id/lines/:lineId
export async function updateLine(req, res) {
  try {
    if (!(await assertBoardOwnership(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const sets = [];
    const values = [];
    let i = 1;

    if (req.body.name !== undefined)      { sets.push(`name = $${i++}`);  values.push(req.body.name); }
    if (req.body.color !== undefined)     { sets.push(`color = $${i++}`); values.push(req.body.color); }
    if (req.body.type !== undefined)      { sets.push(`type = $${i++}`);  values.push(req.body.type); }
    if (req.body.playerIds !== undefined) { sets.push(`player_ids_json = $${i++}::jsonb`); values.push(JSON.stringify(req.body.playerIds)); }
    if (req.body.order !== undefined)     { sets.push(`order_index = $${i++}`); values.push(req.body.order); }

    if (sets.length === 0) {
      return res.status(400).json(error('Keine gültigen Felder zum Aktualisieren'));
    }

    values.push(req.params.lineId, req.params.id);
    const result = await pool.query(
      `UPDATE lines SET ${sets.join(', ')} WHERE id = $${i} AND board_id = $${i + 1} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Line nicht gefunden'));
    }
    res.json(success(toApiLine(result.rows[0])));
  } catch (err) {
    logger.error('[updateLine]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/boards/:id/lines/:lineId
export async function deleteLine(req, res) {
  try {
    if (!(await assertBoardOwnership(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const result = await pool.query(
      'DELETE FROM lines WHERE id = $1 AND board_id = $2 RETURNING id',
      [req.params.lineId, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Line nicht gefunden'));
    }
    // Falls die gelöschte Line gerade aktiv war: Referenz am Board entfernen
    await pool.query(
      'UPDATE boards SET active_line_id = NULL WHERE id = $1 AND active_line_id = $2',
      [req.params.id, req.params.lineId]
    );
    res.json(success({ message: 'Line gelöscht' }));
  } catch (err) {
    logger.error('[deleteLine]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/boards/:id/lines/active   Body: { lineId: string | null }
export async function setActiveLine(req, res) {
  try {
    if (!(await assertBoardOwnership(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const { lineId } = req.body;

    if (lineId != null) {
      const lineExists = await pool.query(
        'SELECT id FROM lines WHERE id = $1 AND board_id = $2',
        [lineId, req.params.id]
      );
      if (lineExists.rows.length === 0) {
        return res.status(404).json(error('Line nicht gefunden'));
      }
    }

    const result = await pool.query(
      'UPDATE boards SET active_line_id = $1 WHERE id = $2 RETURNING active_line_id',
      [lineId ?? null, req.params.id]
    );
    res.json(success({ activeLineId: result.rows[0].active_line_id }));
  } catch (err) {
    logger.error('[setActiveLine]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

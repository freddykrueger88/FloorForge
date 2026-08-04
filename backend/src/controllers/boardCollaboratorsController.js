/**
 * boardCollaboratorsController – Board-Sharing (Issue #51 MVP)
 *
 * Alle Routen sind strikt Owner-only (nicht über assertBoardAccess, das
 * würde auch write-Kollaboratoren durchlassen – Kollaborator-Verwaltung
 * ist bewusst strenger als normales "write"). Ein Kollaborator wird per
 * bereits existierender E-Mail-Adresse hinzugefügt (kein Einladungs-/
 * Token-Flow – passt zum Self-Hosted-Team-Kontext dieser App).
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';

const MAX_COLLABORATORS_PER_BOARD = 10;

function toApiCollaborator(row) {
  return {
    _id:        row.id,
    userId:     row.user_id,
    email:      row.email,
    permission: row.permission,
    createdAt:  row.created_at,
  };
}

async function assertBoardOwner(boardId, userId) {
  const result = await pool.query(
    'SELECT id FROM boards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
    [boardId, userId]
  );
  return result.rows.length > 0;
}

// GET /api/boards/:id/collaborators
export async function getCollaborators(req, res) {
  try {
    if (!(await assertBoardOwner(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const result = await pool.query(
      `SELECT bc.*, u.email FROM board_collaborators bc
       JOIN users u ON u.id = bc.user_id
       WHERE bc.board_id = $1
       ORDER BY bc.created_at ASC`,
      [req.params.id]
    );
    res.json(success(result.rows.map(toApiCollaborator)));
  } catch (err) {
    logger.error('[getCollaborators]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/boards/:id/collaborators
export async function addCollaborator(req, res) {
  try {
    if (!(await assertBoardOwner(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM board_collaborators WHERE board_id = $1',
      [req.params.id]
    );
    if (countResult.rows[0].count >= MAX_COLLABORATORS_PER_BOARD) {
      return res.status(400).json(error(`Maximal ${MAX_COLLABORATORS_PER_BOARD} Kollaboratoren pro Board`));
    }

    const { email, permission = 'read' } = req.body;
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json(error('Kein Nutzer mit dieser E-Mail-Adresse gefunden'));
    }
    const targetUser = userResult.rows[0];

    if (targetUser.id === req.user.id) {
      return res.status(400).json(error('Du kannst dich nicht selbst als Kollaborator hinzufügen'));
    }

    const existing = await pool.query(
      'SELECT id FROM board_collaborators WHERE board_id = $1 AND user_id = $2',
      [req.params.id, targetUser.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json(error('Dieser Nutzer ist bereits Kollaborator'));
    }

    const result = await pool.query(
      'INSERT INTO board_collaborators (board_id, user_id, permission) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, targetUser.id, permission]
    );
    res.status(201).json(created(toApiCollaborator({ ...result.rows[0], email: targetUser.email })));
  } catch (err) {
    logger.error('[addCollaborator]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// PUT /api/boards/:id/collaborators/:collaboratorId
export async function updateCollaborator(req, res) {
  try {
    if (!(await assertBoardOwner(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const { permission } = req.body;
    const result = await pool.query(
      `UPDATE board_collaborators SET permission = $1
       WHERE id = $2 AND board_id = $3
       RETURNING *`,
      [permission, req.params.collaboratorId, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Kollaborator nicht gefunden'));
    }

    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [result.rows[0].user_id]);
    res.json(success(toApiCollaborator({ ...result.rows[0], email: userResult.rows[0]?.email })));
  } catch (err) {
    logger.error('[updateCollaborator]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// DELETE /api/boards/:id/collaborators/:collaboratorId
export async function removeCollaborator(req, res) {
  try {
    if (!(await assertBoardOwner(req.params.id, req.user.id))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const result = await pool.query(
      'DELETE FROM board_collaborators WHERE id = $1 AND board_id = $2 RETURNING id',
      [req.params.collaboratorId, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Kollaborator nicht gefunden'));
    }
    res.json(success({ message: 'Kollaborator entfernt' }));
  } catch (err) {
    logger.error('[removeCollaborator]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

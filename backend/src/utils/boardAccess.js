/**
 * boardAccess – zentraler Zugriffs-Helper für Boards + deren
 * Kind-Ressourcen (Frames, Lines), Issue #51 MVP (Board-Sharing).
 *
 * Ersetzt die vorher in framesController.js/linesController.js jeweils
 * duplizierte lokale assertBoardOwnership(boardId, userId)-Funktion.
 * Beide Controller filtern in ihren eigentlichen Queries ohnehin nur
 * nach board_id, nie nach user_id – der Zugriffs-Check läuft
 * ausschließlich über einen Aufruf dieses Helpers am Anfang jeder
 * Handler-Funktion.
 */
import pool from '../db/pool.js';

// Gibt 'owner' | 'write' | 'read' | null zurück
export async function getBoardAccessLevel(boardId, userId) {
  const board = await pool.query(
    'SELECT user_id FROM boards WHERE id = $1 AND deleted_at IS NULL',
    [boardId]
  );
  if (board.rows.length === 0) return null;
  if (board.rows[0].user_id === userId) return 'owner';

  const collab = await pool.query(
    'SELECT permission FROM board_collaborators WHERE board_id = $1 AND user_id = $2',
    [boardId, userId]
  );
  return collab.rows[0]?.permission ?? null;
}

export async function assertBoardAccess(boardId, userId, required = 'read') {
  const level = await getBoardAccessLevel(boardId, userId);
  if (!level) return false;
  return required === 'read' || level === 'owner' || level === 'write';
}

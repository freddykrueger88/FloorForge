/**
 * inviteController – Öffentliche Vorschau einer Board-Einladung (kein
 * Auth!), Gegenstück zu boardCollaboratorsController.js/addCollaborator.
 * Die eigentliche Zuordnung passiert nicht hier, sondern automatisch bei
 * der Registrierung (siehe routes/auth.js) – diese Route zeigt der
 * eingeladenen Person nur, wofür der Link ist, bevor sie sich registriert.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';

// GET /api/invite/:token (öffentlich, kein Auth)
export async function getInvite(req, res) {
  try {
    const result = await pool.query(
      `SELECT bi.email, bi.permission, bi.expires_at, b.name AS board_name,
              u.display_name AS inviter_name, u.email AS inviter_email
       FROM board_invites bi
       JOIN boards b ON b.id = bi.board_id
       LEFT JOIN users u ON u.id = bi.invited_by
       WHERE bi.token = $1 AND bi.accepted_at IS NULL AND bi.expires_at > NOW()`,
      [req.params.token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Einladung nicht gefunden oder abgelaufen'));
    }
    const row = result.rows[0];
    res.json(success({
      email:       row.email,
      permission:  row.permission,
      boardName:   row.board_name,
      inviterName: row.inviter_name || row.inviter_email || null,
      expiresAt:   row.expires_at,
    }));
  } catch (err) {
    logger.error('[getInvite]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

/**
 * shareController – Öffentliche Share-Links für Boards (ohne Login ansehbar)
 * Issue #16 – v0.5.0; Einzel-Frame-Share (ROADMAP-Backlog) ergänzt
 *
 * Nutzt die bestehende `exports`-Tabelle (format='link'|'png',
 * share_token, expires_at) – kein neues Schema nötig, 'png' war dort
 * bereits als möglicher Wert vorgesehen, aber nie implementiert.
 */
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, created, error } from '../utils/apiResponse.js';
import { assertBoardAccess } from '../utils/boardAccess.js';
import { toApiFrame } from './framesController.js';

const SHARE_LINK_EXPIRES_HOURS = parseInt(process.env.SHARE_LINK_EXPIRES_HOURS || '72', 10);
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1h
const FRAME_SHARES_DIR = path.join(process.env.EXPORTS_DIR || '/app/exports', 'frame-shares');
const MAX_FRAME_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB – ein einzelnes PNG-Frame, großzügig bemessen

function frameSharePath(token) {
  return path.join(FRAME_SHARES_DIR, `${token}.png`);
}

// ── Cleanup: abgelaufene Share-Links + Frame-Bilder regelmäßig löschen ───────
async function cleanupExpiredShareLinks() {
  try {
    const expiredFrames = await pool.query(
      `SELECT share_token FROM exports WHERE format = 'png' AND expires_at < NOW()`
    );
    for (const row of expiredFrames.rows) {
      await fs.rm(frameSharePath(row.share_token), { force: true }).catch(() => {});
    }

    const result = await pool.query(
      `DELETE FROM exports WHERE format IN ('link', 'png') AND expires_at < NOW()`
    );
    if (result.rowCount > 0) {
      logger.info(`Share-Link cleanup: ${result.rowCount} abgelaufene Links/Bilder gelöscht`);
    }
  } catch (err) {
    logger.warn('Share-Link cleanup error:', err.message);
  }
}

setInterval(cleanupExpiredShareLinks, CLEANUP_INTERVAL_MS);

// ── POST /api/boards/:id/share ────────────────────────────────────────────────
export async function createShareLink(req, res) {
  try {
    const boardCheck = await pool.query(
      'SELECT id FROM boards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [req.params.id, req.user.id]
    );
    if (boardCheck.rows.length === 0) {
      return res.status(404).json(error('Spielfeld nicht gefunden'));
    }

    const token = randomUUID();
    const result = await pool.query(
      `INSERT INTO exports (board_id, user_id, format, share_token, expires_at)
       VALUES ($1, $2, 'link', $3, NOW() + ($4 || ' hours')::interval)
       RETURNING share_token, expires_at`,
      [req.params.id, req.user.id, token, SHARE_LINK_EXPIRES_HOURS]
    );

    const row = result.rows[0];
    res.status(201).json(created({ token: row.share_token, expiresAt: row.expires_at }));
  } catch (err) {
    logger.error('[createShareLink]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// ── GET /api/share/:token (öffentlich, kein Auth) ────────────────────────────
export async function getSharedBoard(req, res) {
  try {
    const result = await pool.query(
      `SELECT b.name, b.field_type, b.theme, b.home_color, b.away_color, b.ball_color,
              b.show_names, b.name_position, b.id AS board_id
       FROM exports e
       JOIN boards b ON b.id = e.board_id
       WHERE e.share_token = $1
         AND e.format = 'link'
         AND (e.expires_at IS NULL OR e.expires_at > NOW())
         AND b.deleted_at IS NULL`,
      [req.params.token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(error('Link ungültig oder abgelaufen'));
    }

    const row = result.rows[0];
    const framesResult = await pool.query(
      'SELECT * FROM frames WHERE board_id = $1 ORDER BY order_index ASC',
      [row.board_id]
    );

    res.json(success({
      name:         row.name,
      fieldType:    row.field_type,
      theme:        row.theme,
      homeColor:    row.home_color,
      awayColor:    row.away_color,
      ballColor:    row.ball_color,
      showNames:    row.show_names,
      namePosition: row.name_position,
      frames:       framesResult.rows.map(toApiFrame),
    }));
  } catch (err) {
    logger.error('[getSharedBoard]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// ── POST /api/export/frame-share  Body: { boardId, image } ──────────────────
// Teilt einen einzelnen, bereits client-seitig gerenderten Frame als Bild
// ohne Login – kleinerer Wurf als der volle Board-Link (kein Login, keine
// Frame-Navigation, nur ein Snapshot für z.B. WhatsApp).
export async function createFrameShare(req, res) {
  try {
    const { boardId, image } = req.body;
    if (!boardId || !image) {
      return res.status(400).json(error('boardId und image sind erforderlich'));
    }
    if (!(await assertBoardAccess(boardId, req.user.id, 'read'))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const base64 = String(image).replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > MAX_FRAME_IMAGE_BYTES) {
      return res.status(400).json(error('Bild zu groß (max. 5MB)'));
    }

    const token = randomUUID();
    await fs.mkdir(FRAME_SHARES_DIR, { recursive: true });
    await fs.writeFile(frameSharePath(token), buffer);

    const result = await pool.query(
      `INSERT INTO exports (board_id, user_id, format, share_token, expires_at)
       VALUES ($1, $2, 'png', $3, NOW() + ($4 || ' hours')::interval)
       RETURNING share_token, expires_at`,
      [boardId, req.user.id, token, SHARE_LINK_EXPIRES_HOURS]
    );

    const row = result.rows[0];
    res.status(201).json(created({ token: row.share_token, expiresAt: row.expires_at }));
  } catch (err) {
    logger.error('[createFrameShare]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// ── GET /api/share/frame/:token (öffentlich, kein Auth) ──────────────────────
export async function getSharedFrame(req, res) {
  try {
    const result = await pool.query(
      `SELECT e.share_token FROM exports e
       JOIN boards b ON b.id = e.board_id
       WHERE e.share_token = $1 AND e.format = 'png'
         AND (e.expires_at IS NULL OR e.expires_at > NOW())
         AND b.deleted_at IS NULL`,
      [req.params.token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Link ungültig oder abgelaufen'));
    }
    res.sendFile(frameSharePath(req.params.token), (err) => {
      if (err && !res.headersSent) res.status(404).json(error('Bild nicht gefunden'));
    });
  } catch (err) {
    logger.error('[getSharedFrame]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

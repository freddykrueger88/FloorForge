/**
 * userController – Account-Selbstverwaltung (Issue #22)
 * DELETE /api/user/account – Löscht den eigenen Account inkl. aller Daten.
 * Cascade-Deletes (settings/boards/frames/lines/exports → users) übernehmen
 * das Aufräumen, siehe backend/src/db/migrate.js.
 */
import jwt from 'jsonwebtoken';
import archiver from 'archiver';
import AdmZip from 'adm-zip';
import pool from '../db/pool.js';
import redisClient from '../db/redis.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';
import { COOKIE_OPTS } from '../utils/cookies.js';
import { buildUserExport, BACKUP_FORMAT } from '../services/exportUserData.js';

const MAX_FRAMES_PER_BOARD = 50;
const MAX_LINES_PER_BOARD = 10;

export async function deleteAccount(req, res) {
  try {
    const userResult = await pool.query('SELECT email, role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json(error('Benutzer nicht gefunden'));
    }
    const user = userResult.rows[0];

    if ((req.body.email ?? '').trim().toLowerCase() !== user.email.toLowerCase()) {
      return res.status(400).json(error('E-Mail-Bestätigung stimmt nicht überein'));
    }

    if (user.role === 'admin') {
      const adminCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      if (parseInt(adminCount.rows[0].count, 10) <= 1) {
        return res.status(403).json(error('Letzter Admin-Account kann nicht gelöscht werden'));
      }
    }

    // Aktuelles Token blacklisten (analog Logout)
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await redisClient.setEx(`blacklist:${token}`, ttl, '1');
      }
    }

    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });

    logger.info(`User deleted own account: ${req.user.id}`);
    return res.json(success({ message: 'Account gelöscht' }));
  } catch (err) {
    logger.error('[deleteAccount]', err);
    return res.status(500).json(error('Interner Serverfehler'));
  }
}

// GET /api/user/export – ZIP-Export aller eigenen Daten (Issue #21)
export async function exportAccount(req, res) {
  try {
    const data = await buildUserExport(req.user.id);
    const dateStr = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="floorforge-backup-${dateStr}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => { throw err; });
    archive.pipe(res);
    archive.append(JSON.stringify(data, null, 2), { name: 'backup.json' });
    await archive.finalize();
  } catch (err) {
    logger.error('[exportAccount]', err);
    if (!res.headersSent) res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/user/import – ZIP-Import (Issue #21)
// Duplikate (gleicher Name + Feldtyp + Erstellungszeitpunkt für diesen User)
// werden übersprungen, alles andere wird als neues Board angelegt.
export async function importAccount(req, res) {
  if (!req.file) {
    return res.status(400).json(error('Keine Datei hochgeladen'));
  }

  let data;
  try {
    const zip = new AdmZip(req.file.buffer);
    const entry = zip.getEntry('backup.json');
    if (!entry) {
      return res.status(400).json(error('ZIP enthält keine backup.json'));
    }
    data = JSON.parse(entry.getData().toString('utf8'));
  } catch {
    return res.status(400).json(error('Ungültige oder beschädigte ZIP-Datei'));
  }

  if (data?.format !== BACKUP_FORMAT) {
    return res.status(400).json(error('Unbekanntes Backup-Format'));
  }
  if (!Array.isArray(data.boards)) {
    return res.status(400).json(error('Backup enthält keine Boards'));
  }

  const client = await pool.connect();
  let imported = 0;
  let skipped = 0;
  try {
    await client.query('BEGIN');

    for (const board of data.boards) {
      // date_trunc auf Millisekunden, da JS Date/JSON beim Export/Import
      // die Mikrosekunden-Präzision von Postgres' created_at kappt – ohne
      // das würde die Duplikat-Erkennung für real erzeugte Boards nie greifen.
      const existing = await client.query(
        `SELECT id FROM boards WHERE user_id = $1 AND name = $2 AND field_type = $3
         AND date_trunc('milliseconds', created_at) = date_trunc('milliseconds', $4::timestamptz)`,
        [req.user.id, board.name, board.fieldType, board.createdAt]
      );
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      const boardResult = await client.query(
        `INSERT INTO boards (user_id, name, notes, field_type, theme, home_color, away_color, ball_color, show_grid, show_names, name_position, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          req.user.id, board.name, board.notes ?? '', board.fieldType ?? 'large', board.theme ?? 'dark',
          board.homeColor ?? '#1d4ed8', board.awayColor ?? '#dc2626', board.ballColor ?? '#ffffff',
          board.showGrid ?? false, board.showNames ?? true, board.namePosition ?? 'below',
          board.createdAt ?? new Date().toISOString(),
        ]
      );
      const newBoardId = boardResult.rows[0].id;

      const frames = (board.frames ?? []).slice(0, MAX_FRAMES_PER_BOARD);
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        await client.query(
          `INSERT INTO frames (board_id, order_index, data_json, duration_ms)
           VALUES ($1, $2, $3::jsonb, $4)`,
          [
            newBoardId, i,
            JSON.stringify({ label: frame.label ?? '', players: frame.players ?? [], elements: frame.elements ?? [] }),
            frame.duration ?? 1000,
          ]
        );
      }

      const lines = (board.lines ?? []).slice(0, MAX_LINES_PER_BOARD);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await client.query(
          `INSERT INTO lines (board_id, name, color, type, player_ids_json, order_index)
           VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
          [newBoardId, line.name, line.color ?? '#3B82F6', line.type ?? 'offense', JSON.stringify(line.playerIds ?? []), i]
        );
      }

      imported++;
    }

    await client.query('COMMIT');
    logger.info(`User ${req.user.id} imported backup: ${imported} imported, ${skipped} skipped`);
    return res.json(success({ imported, skipped }));
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('[importAccount]', err);
    return res.status(500).json(error('Interner Serverfehler beim Import'));
  } finally {
    client.release();
  }
}

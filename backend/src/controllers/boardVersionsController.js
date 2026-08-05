/**
 * boardVersionsController – automatische Versionierung von Boards
 * (ROADMAP Phase 2). Ein Snapshot ALLER Frames eines Boards entsteht
 * automatisch bei jedem Speichern (siehe framesController.updateFrame,
 * das snapshotBoardVersion() nach jedem erfolgreichen Update aufruft).
 *
 * Aufbewahrungsgrenze: MAX_VERSIONS_PER_BOARD, damit die Historie nicht
 * unbegrenzt wächst (Datensparsamkeit-Prinzip) – automatisch bei jedem
 * Speichern wie gewünscht, aber mit harter Obergrenze statt
 * unbegrenztem Wachstum.
 */
import pool from '../db/pool.js';
import logger from '../utils/logger.js';
import { success, error } from '../utils/apiResponse.js';
import { assertBoardAccess } from '../utils/boardAccess.js';

// Absichtlich dupliziert statt aus framesController.js importiert – das
// würde einen zirkulären Import erzeugen (framesController.js importiert
// umgekehrt snapshotBoardVersion aus dieser Datei).
function toApiFrame(row) {
  const data = row.data_json || {};
  return {
    _id:      row.id,
    order:    row.order_index,
    label:    data.label ?? '',
    players:  data.players ?? [],
    elements: data.elements ?? [],
    duration: row.duration_ms,
  };
}

const MAX_VERSIONS_PER_BOARD = 50;

function toApiVersionMeta(row) {
  return {
    _id:       row.id,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

// Aufgerufen aus framesController.updateFrame nach jedem erfolgreichen
// Speichern – snapshottet den aktuellen Stand ALLER Frames des Boards.
export async function snapshotBoardVersion(boardId, userId) {
  const frames = await pool.query(
    'SELECT id, order_index, data_json, duration_ms FROM frames WHERE board_id = $1 ORDER BY order_index ASC',
    [boardId]
  );
  await pool.query(
    `INSERT INTO board_versions (board_id, frames_snapshot, created_by)
     VALUES ($1, $2::jsonb, $3)`,
    [boardId, JSON.stringify(frames.rows), userId]
  );
  await pool.query(
    `DELETE FROM board_versions
     WHERE board_id = $1 AND id NOT IN (
       SELECT id FROM board_versions WHERE board_id = $1
       ORDER BY created_at DESC LIMIT $2
     )`,
    [boardId, MAX_VERSIONS_PER_BOARD]
  );
}

// GET /api/boards/:id/versions – nur Metadaten, kein Snapshot-Inhalt
export async function getVersions(req, res) {
  try {
    if (!(await assertBoardAccess(req.params.id, req.user.id, 'read'))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const result = await pool.query(
      'SELECT id, created_by, created_at FROM board_versions WHERE board_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(success(result.rows.map(toApiVersionMeta)));
  } catch (err) {
    logger.error('[getVersions]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// GET /api/boards/:id/versions/:versionId – voller Snapshot-Inhalt
export async function getVersion(req, res) {
  try {
    if (!(await assertBoardAccess(req.params.id, req.user.id, 'read'))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }
    const result = await pool.query(
      'SELECT * FROM board_versions WHERE id = $1 AND board_id = $2',
      [req.params.versionId, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(error('Version nicht gefunden'));
    }
    // frames_snapshot enthält rohe DB-Zeilen (data_json verschachtelt) –
    // im selben normalisierten Format ausliefern wie /frames, damit das
    // Frontend nicht zwei unterschiedliche Frame-Formen kennen muss.
    const frames = result.rows[0].frames_snapshot.map(toApiFrame);
    res.json(success({ ...toApiVersionMeta(result.rows[0]), frames }));
  } catch (err) {
    logger.error('[getVersion]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/boards/:id/versions/:versionId/restore – schreibt die
// Frames aus dem Snapshot als aktuellen Zustand zurück. Erstellt vorher
// selbst eine neue Version des aktuellen Standes, damit ein
// Wiederherstellen nichts verliert (der "verlorene" Stand bleibt in
// der Historie einsehbar).
export async function restoreVersion(req, res) {
  const client = await pool.connect();
  try {
    if (!(await assertBoardAccess(req.params.id, req.user.id, 'write'))) {
      return res.status(404).json(error('Board nicht gefunden'));
    }

    const versionResult = await pool.query(
      'SELECT frames_snapshot FROM board_versions WHERE id = $1 AND board_id = $2',
      [req.params.versionId, req.params.id]
    );
    if (versionResult.rows.length === 0) {
      return res.status(404).json(error('Version nicht gefunden'));
    }

    // aktuellen Stand vor dem Überschreiben sichern
    await snapshotBoardVersion(req.params.id, req.user.id);

    await client.query('BEGIN');
    await client.query('DELETE FROM frames WHERE board_id = $1', [req.params.id]);
    for (const frame of versionResult.rows[0].frames_snapshot) {
      await client.query(
        `INSERT INTO frames (board_id, order_index, data_json, duration_ms)
         VALUES ($1, $2, $3::jsonb, $4)`,
        [req.params.id, frame.order_index, JSON.stringify(frame.data_json), frame.duration_ms]
      );
    }
    await client.query('COMMIT');

    // Wiederherstellung selbst auch als neue Version festhalten
    await snapshotBoardVersion(req.params.id, req.user.id);

    const frames = await pool.query(
      'SELECT * FROM frames WHERE board_id = $1 ORDER BY order_index ASC',
      [req.params.id]
    );
    res.json(success(frames.rows.map(toApiFrame)));
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('[restoreVersion]', err);
    res.status(500).json(error('Interner Serverfehler'));
  } finally {
    client.release();
  }
}

/**
 * exportController – GIF-Export via FFmpeg
 * Issue #15 – v0.5.0
 *
 * Flow:
 *  1. POST /api/export/gif  – empfängt { frames: string[], fps, width, loop }
 *  2. Schreibt PNGs temporär nach /app/exports/<jobId>/
 *  3. Startet FFmpeg-Job asynchron
 *  4. GET /api/export/status/:id  – Polling { status, progress }
 *  5. GET /api/export/download/:id – GIF-Download
 *  6. Cleanup-Job löscht Exports älter als 24h
 */
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const EXPORTS_DIR = process.env.EXPORTS_DIR || '/app/exports';
const MAX_FRAMES = 60;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;   // 1h
const EXPORT_TTL_MS       = 24 * 60 * 60 * 1000; // 24h

// In-Memory Job-Store
const jobs = new Map();

// ── Cleanup ──────────────────────────────────────────────────────────────────
async function cleanupOldExports() {
  try {
    const entries = await fs.readdir(EXPORTS_DIR, { withFileTypes: true });
    const now = Date.now();
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dirPath = path.join(EXPORTS_DIR, entry.name);
      const stat = await fs.stat(dirPath);
      if (now - stat.mtimeMs > EXPORT_TTL_MS) {
        await fs.rm(dirPath, { recursive: true, force: true });
        jobs.delete(entry.name);
        logger.info(`Export cleanup: removed ${entry.name}`);
      }
    }
  } catch (err) {
    logger.warn('Export cleanup error:', err.message);
  }
}

setInterval(cleanupOldExports, CLEANUP_INTERVAL_MS);

// ── Helpers ───────────────────────────────────────────────────────────────────
function jobDir(jobId) {
  return path.join(EXPORTS_DIR, jobId);
}

function gifPath(jobId) {
  return path.join(jobDir(jobId), 'output.gif');
}

async function writePngs(jobId, frames) {
  const dir = jobDir(jobId);
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < frames.length; i++) {
    const base64 = frames[i].replace(/^data:image\/png;base64,/, '');
    const buf = Buffer.from(base64, 'base64');
    const padded = String(i).padStart(4, '0');
    await fs.writeFile(path.join(dir, `frame_${padded}.png`), buf);
  }
}

function buildFFmpegArgs({ jobId, fps, width, loop }) {
  const dir     = jobDir(jobId);
  const outPath = gifPath(jobId);
  const scale   = width > 0 ? `scale=${width}:-1:flags=lanczos` : 'scale=720:-1:flags=lanczos';
  const loopVal = loop ? '0' : '-1';
  return [
    '-y',
    '-framerate', String(fps),
    '-i', path.join(dir, 'frame_%04d.png'),
    '-vf', `${scale},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    '-loop', loopVal,
    outPath,
  ];
}

async function runFFmpeg(jobId, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited ${code}: ${stderr.slice(-400)}`));
    });
    proc.on('error', reject);
  });
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/export/gif
 * Body: { frames: string[], fps?: number, width?: number, loop?: boolean }
 */
export async function startGifExport(req, res) {
  const { frames, fps = 4, width = 720, loop = true } = req.body;

  if (!Array.isArray(frames) || frames.length < 2) {
    return res.status(400).json({ success: false, message: 'Mindestens 2 Frames erforderlich.' });
  }
  if (frames.length > MAX_FRAMES) {
    return res.status(400).json({ success: false, message: `Maximal ${MAX_FRAMES} Frames erlaubt.` });
  }
  const safeFps   = Math.min(15, Math.max(1, Number(fps) || 4));
  const safeWidth = [480, 720, 1280].includes(Number(width)) ? Number(width) : 720;

  const jobId = randomUUID();
  jobs.set(jobId, { status: 'processing', progress: 0, createdAt: Date.now(), userId: req.user.id });
  res.status(202).json({ success: true, jobId });

  // Async: Frames schreiben + FFmpeg starten
  try {
    await writePngs(jobId, frames);
    jobs.get(jobId).progress = 50;
    await runFFmpeg(jobId, buildFFmpegArgs({ jobId, fps: safeFps, width: safeWidth, loop }));
    jobs.get(jobId).status   = 'done';
    jobs.get(jobId).progress = 100;
    logger.info(`Export done: ${jobId}`);
  } catch (err) {
    logger.error(`Export failed (${jobId}):`, err.message);
    if (jobs.has(jobId)) {
      jobs.get(jobId).status  = 'error';
      jobs.get(jobId).message = err.message;
    }
    // Temp-Dateien aufräumen
    fs.rm(jobDir(jobId), { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * GET /api/export/status/:id
 */
export function getExportStatus(req, res) {
  const job = jobs.get(req.params.id);
  if (!job || job.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Job nicht gefunden.' });
  }
  res.json({ success: true, status: job.status, progress: job.progress, message: job.message });
}

/**
 * GET /api/export/download/:id
 */
export function downloadExport(req, res) {
  const jobId = req.params.id;
  const job   = jobs.get(jobId);
  if (!job || job.userId !== req.user.id || job.status !== 'done') {
    return res.status(404).json({ success: false, message: 'Export nicht bereit.' });
  }
  const filePath = gifPath(jobId);
  if (!fsSync.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Datei nicht gefunden.' });
  }
  res.download(filePath, 'floorforge-export.gif', (err) => {
    if (err) logger.warn(`Download error (${jobId}):`, err.message);
  });
}

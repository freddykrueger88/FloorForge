/**
 * framesController – CRUD + Reorder für Frames eines Boards
 * Frames sind Sub-Documents im Board-Dokument
 */
import Board from '../models/Board.js';
import { validationResult } from 'express-validator';

const MAX_FRAMES = 50;

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// GET /api/boards/:id/frames
export async function getFrames(req, res) {
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null }).select('frames');
    if (!board) return res.status(404).json({ success: false, message: 'Board nicht gefunden' });
    const sorted = [...board.frames].sort((a, b) => a.order - b.order);
    res.json({ success: true, data: sorted });
  } catch (err) {
    console.error('[getFrames]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// POST /api/boards/:id/frames
export async function addFrame(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null });
    if (!board) return res.status(404).json({ success: false, message: 'Board nicht gefunden' });
    if (board.frames.length >= MAX_FRAMES) {
      return res.status(400).json({ success: false, message: `Maximal ${MAX_FRAMES} Frames pro Board` });
    }

    const order = board.frames.length;
    const newFrame = {
      order,
      label:    req.body.label    ?? '',
      duration: req.body.duration ?? 1000,
      // Kopiert den Zustand eines Referenz-Frames (Standard: letzter Frame)
      players:  req.body.players  ?? board.players,
      elements: req.body.elements ?? [],
    };

    board.frames.push(newFrame);
    await board.save();

    const added = board.frames[board.frames.length - 1];
    res.status(201).json({ success: true, data: added });
  } catch (err) {
    console.error('[addFrame]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// PUT /api/boards/:id/frames/:frameId
export async function updateFrame(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null });
    if (!board) return res.status(404).json({ success: false, message: 'Board nicht gefunden' });

    const frame = board.frames.id(req.params.frameId);
    if (!frame) return res.status(404).json({ success: false, message: 'Frame nicht gefunden' });

    const allowed = ['label', 'players', 'elements', 'duration'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) frame[key] = req.body[key]; });

    await board.save();
    res.json({ success: true, data: frame });
  } catch (err) {
    console.error('[updateFrame]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// DELETE /api/boards/:id/frames/:frameId
export async function deleteFrame(req, res) {
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null });
    if (!board) return res.status(404).json({ success: false, message: 'Board nicht gefunden' });
    if (board.frames.length <= 1) {
      return res.status(400).json({ success: false, message: 'Mindestens 1 Frame muss erhalten bleiben' });
    }

    board.frames.pull({ _id: req.params.frameId });
    // Reihenfolge normalisieren
    board.frames.forEach((f, i) => { f.order = i; });
    await board.save();
    res.json({ success: true, message: 'Frame gelöscht' });
  } catch (err) {
    console.error('[deleteFrame]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// PUT /api/boards/:id/frames/reorder
// Body: { order: [frameId1, frameId2, ...] }
export async function reorderFrames(req, res) {
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null });
    if (!board) return res.status(404).json({ success: false, message: 'Board nicht gefunden' });

    const { order } = req.body; // Array von Frame-IDs in neuer Reihenfolge
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: '"order" muss ein Array von Frame-IDs sein' });
    }

    order.forEach((frameId, idx) => {
      const frame = board.frames.id(frameId);
      if (frame) frame.order = idx;
    });

    await board.save();
    const sorted = [...board.frames].sort((a, b) => a.order - b.order);
    res.json({ success: true, data: sorted });
  } catch (err) {
    console.error('[reorderFrames]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

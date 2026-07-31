/**
 * boardsController – CRUD für Spielfelder (Boards)
 */
import Board from '../models/Board.js';
import { validationResult } from 'express-validator';

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// GET /api/boards
export async function getBoards(req, res) {
  try {
    const boards = await Board.find({ deletedAt: null })
      .select('-elements -players')     // Kachel-Übersicht braucht keine Details
      .sort({ updatedAt: -1 })
      .limit(200);
    res.json({ success: true, data: boards });
  } catch (err) {
    console.error('[getBoards]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// GET /api/boards/:id
export async function getBoard(req, res) {
  try {
    const board = await Board.findOne({ _id: req.params.id, deletedAt: null });
    if (!board) return res.status(404).json({ success: false, message: 'Spielfeld nicht gefunden' });
    res.json({ success: true, data: board });
  } catch (err) {
    console.error('[getBoard]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// POST /api/boards
export async function createBoard(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const board = new Board(req.body);
    await board.save();
    res.status(201).json({ success: true, data: board });
  } catch (err) {
    console.error('[createBoard]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// PUT /api/boards/:id
export async function updateBoard(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!board) return res.status(404).json({ success: false, message: 'Spielfeld nicht gefunden' });
    res.json({ success: true, data: board });
  } catch (err) {
    console.error('[updateBoard]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

// DELETE /api/boards/:id  (Soft-Delete)
export async function deleteBoard(req, res) {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!board) return res.status(404).json({ success: false, message: 'Spielfeld nicht gefunden' });
    res.json({ success: true, message: 'Spielfeld gelöscht' });
  } catch (err) {
    console.error('[deleteBoard]', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}

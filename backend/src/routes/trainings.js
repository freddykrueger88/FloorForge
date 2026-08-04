/**
 * /api/trainings – Trainingsplaner: Sessions + geordnete Items
 * (Issue #45, authentifiziert, nutzer-gebunden statt board-gebunden)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getSessions, createSession, getSession, updateSession, deleteSession,
  addItem, updateItem, deleteItem, reorderItems,
} from '../controllers/trainingSessionsController.js';

const router = Router();

router.use(authenticate);

const idParam     = param('id').isUUID().withMessage('Ungültige Trainingseinheit-ID');
const itemIdParam = param('itemId').isUUID().withMessage('Ungültige Übungs-ID');

router.get   ('/',     getSessions);
router.post  ('/',     [
  body('name').trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 80 }),
  validate,
], createSession);
router.get   ('/:id',  [idParam, validate], getSession);
router.put   ('/:id',  [
  idParam,
  body('name').optional().trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 80 }),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notizen max. 1000 Zeichen'),
  validate,
], updateSession);
router.delete('/:id',  [idParam, validate], deleteSession);

router.post  ('/:id/items', [
  idParam,
  body('boardId').isUUID().withMessage('Ungültige Board-ID'),
  body('durationMinutes').optional().isInt({ min: 1, max: 240 }).withMessage('Dauer muss zwischen 1 und 240 Minuten liegen'),
  body('note').optional().isLength({ max: 300 }).withMessage('Notiz max. 300 Zeichen'),
  validate,
], addItem);

router.put   ('/:id/items/reorder', [
  idParam,
  body('order').isArray().withMessage('"order" muss ein Array sein'),
  body('order.*').isUUID().withMessage('Ungültige Übungs-ID in "order"'),
  validate,
], reorderItems);

router.put   ('/:id/items/:itemId', [
  idParam, itemIdParam,
  body('durationMinutes').optional().isInt({ min: 1, max: 240 }).withMessage('Dauer muss zwischen 1 und 240 Minuten liegen'),
  body('note').optional().isLength({ max: 300 }).withMessage('Notiz max. 300 Zeichen'),
  validate,
], updateItem);

router.delete('/:id/items/:itemId', [idParam, itemIdParam, validate], deleteItem);

export default router;

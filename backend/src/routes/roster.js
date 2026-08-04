/**
 * /api/roster – zentraler Team-Kader (Issue #53, authentifiziert,
 * nutzer-gebunden statt board-gebunden)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getRosterPlayers, createRosterPlayer, updateRosterPlayer, deleteRosterPlayer,
} from '../controllers/rosterController.js';

const router = Router();

router.use(authenticate);

const rosterFields = [
  body('name').optional().trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 40 }),
  body('jerseyNumber').optional({ nullable: true }).isInt({ min: 0, max: 99 }).withMessage('Rückennummer muss zwischen 0 und 99 liegen'),
  body('role').optional({ nullable: true }).isIn(['TW', 'V', 'C', 'S']).withMessage('Ungültige Position'),
];

router.get   ('/',     getRosterPlayers);
router.post  ('/',     [
  body('name').trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 40 }),
  ...rosterFields.slice(1),
  validate,
], createRosterPlayer);
router.put   ('/:id',  [param('id').isUUID().withMessage('Ungültige Kader-ID'), ...rosterFields, validate], updateRosterPlayer);
router.delete('/:id',  [param('id').isUUID().withMessage('Ungültige Kader-ID'), validate], deleteRosterPlayer);

export default router;

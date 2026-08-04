/**
 * /api/formations – Formations-Vorlagen (Issue #46, authentifiziert,
 * nutzer-gebunden statt board-gebunden)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getFormations, createFormation, deleteFormation } from '../controllers/formationsController.js';

const router = Router();

router.use(authenticate);

router.get   ('/', getFormations);
router.post  ('/', [
  body('name').trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 40 }),
  body('fieldType').optional().isIn(['large', 'small', 'street', '3v3']),
  body('players').optional().isArray(),
  validate,
], createFormation);
router.delete('/:id', [param('id').isUUID().withMessage('Ungültige Vorlagen-ID'), validate], deleteFormation);

export default router;

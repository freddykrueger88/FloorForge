/**
 * /api/boards/:id/lines – Lines-Routen (Issue #12, authentifiziert, user-scoped)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getLines, createLine, updateLine, deleteLine, setActiveLine } from '../controllers/linesController.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

const validateBoardId = param('id').isUUID().withMessage('Ungültige Board-ID');
const validateLineId  = param('lineId').isUUID().withMessage('Ungültige Line-ID');

const validateLineBody = [
  body('name').optional().trim().isLength({ min: 1, max: 40 }).withMessage('Name 1-40 Zeichen'),
  body('color').optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage('Farbe muss ein Hex-Code sein'),
  body('type').optional().isIn(['offense', 'defense', 'special']),
  body('playerIds').optional().isArray(),
];

router.get   ('/',        [validateBoardId, validate], getLines);
router.post  ('/',        [
  validateBoardId,
  body('name').trim().notEmpty().withMessage('Name ist erforderlich').isLength({ max: 40 }),
  body('color').optional().matches(/^#[0-9a-fA-F]{6}$/),
  body('type').optional().isIn(['offense', 'defense', 'special']),
  validate,
], createLine);
router.put   ('/active',  [validateBoardId, validate], setActiveLine);
router.put   ('/:lineId', [validateBoardId, validateLineId, ...validateLineBody, validate], updateLine);
router.delete('/:lineId', [validateBoardId, validateLineId, validate], deleteLine);

export default router;

/**
 * /api/boards/:id/collaborators – Board-Sharing (Issue #51 MVP,
 * authentifiziert, strikt Owner-only)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getCollaborators, addCollaborator, updateCollaborator, removeCollaborator,
} from '../controllers/boardCollaboratorsController.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

const validateBoardId        = param('id').isUUID().withMessage('Ungültige Board-ID');
const validateCollaboratorId = param('collaboratorId').isUUID().withMessage('Ungültige Kollaborator-ID');
const validatePermission     = body('permission').isIn(['read', 'write']).withMessage('Ungültige Berechtigung');

router.get   ('/',                  [validateBoardId, validate], getCollaborators);
router.post  ('/',                  [
  validateBoardId,
  body('email').trim().isEmail().withMessage('Ungültige E-Mail-Adresse'),
  body('permission').optional().isIn(['read', 'write']).withMessage('Ungültige Berechtigung'),
  validate,
], addCollaborator);
router.put   ('/:collaboratorId',   [validateBoardId, validateCollaboratorId, validatePermission, validate], updateCollaborator);
router.delete('/:collaboratorId',   [validateBoardId, validateCollaboratorId, validate], removeCollaborator);

export default router;

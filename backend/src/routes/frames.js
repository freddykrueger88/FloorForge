/**
 * /api/boards/:id/frames – Frame-Routen (authentifiziert, user-scoped)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getFrames, addFrame, updateFrame, deleteFrame, reorderFrames } from '../controllers/framesController.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

const validateBoardId = param('id').isUUID().withMessage('Ungültige Board-ID');
const validateFrameId = param('frameId').isUUID().withMessage('Ungültige Frame-ID');

router.get   ('/',             [validateBoardId, validate], getFrames);
router.post  ('/',             [
  validateBoardId,
  body('label').optional().isString().isLength({ max: 60 }),
  body('duration').optional().isInt({ min: 100, max: 10000 }),
  validate,
], addFrame);
router.put   ('/reorder',      [validateBoardId, validate], reorderFrames);
router.put   ('/:frameId',     [validateBoardId, validateFrameId, validate], updateFrame);
router.delete('/:frameId',     [validateBoardId, validateFrameId, validate], deleteFrame);

export default router;

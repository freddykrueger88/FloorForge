/**
 * /api/boards/:id/frames – Frame-Routen
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { getFrames, addFrame, updateFrame, deleteFrame, reorderFrames } from '../controllers/framesController.js';

const router = Router({ mergeParams: true });

const validateBoardId = param('id').isMongoId().withMessage('Ungültige Board-ID');
const validateFrameId = param('frameId').isMongoId().withMessage('Ungültige Frame-ID');

router.get   ('/',             validateBoardId, getFrames);
router.post  ('/',             validateBoardId, [
  body('label').optional().isString().isLength({ max: 60 }),
  body('duration').optional().isInt({ min: 100, max: 10000 }),
], addFrame);
router.put   ('/reorder',      validateBoardId, reorderFrames);
router.put   ('/:frameId',     [validateBoardId, validateFrameId], updateFrame);
router.delete('/:frameId',     [validateBoardId, validateFrameId], deleteFrame);

export default router;

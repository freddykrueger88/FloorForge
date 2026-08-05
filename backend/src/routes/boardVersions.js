/**
 * /api/boards/:id/versions – automatische Board-Versionierung
 * (ROADMAP Phase 2, authentifiziert)
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getVersions, getVersion, restoreVersion } from '../controllers/boardVersionsController.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

const validateBoardId   = param('id').isUUID().withMessage('Ungültige Board-ID');
const validateVersionId = param('versionId').isUUID().withMessage('Ungültige Versions-ID');

router.get ('/',                    [validateBoardId, validate], getVersions);
router.get ('/:versionId',          [validateBoardId, validateVersionId, validate], getVersion);
router.post('/:versionId/restore',  [validateBoardId, validateVersionId, validate], restoreVersion);

export default router;

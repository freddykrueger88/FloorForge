/**
 * /api/boards/:id/videos – Video-Integration MVP
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getVideos, uploadVideo, streamVideo, updateVideo, deleteVideo, uploadMiddleware } from '../controllers/videoController.js';
import { error } from '../utils/apiResponse.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

const validateBoardId = param('id').isUUID().withMessage('Ungültige Board-ID');
const validateVideoId = param('videoId').isUUID().withMessage('Ungültige Video-ID');

router.get('/', [validateBoardId, validate], getVideos);

// Board-ID zuerst prüfen (billig), bevor Multer den u.U. großen Datei-Body
// überhaupt verarbeitet. Ein Fehler aus Multer selbst (Dateigröße/-typ)
// landet im eigenen catch statt beim allgemeinen Error-Handler, da Multer
// seine Fehler nicht über next(err) im üblichen Express-Format wirft.
router.post('/', [validateBoardId, validate], (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return res.status(400).json(error(err.message));
    next();
  });
}, uploadVideo);

router.get('/:videoId/stream', [validateBoardId, validateVideoId, validate], streamVideo);
router.put('/:videoId', [validateBoardId, validateVideoId, validate], updateVideo);
router.delete('/:videoId', [validateBoardId, validateVideoId, validate], deleteVideo);

export default router;

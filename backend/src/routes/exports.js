/**
 * Export Routes – Issue #15 (GIF), Issue #23 (MP4)
 */
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { startGifExport, startMp4Export, getExportStatus, downloadExport } from '../controllers/exportController.js';

const router = Router();

// Alle Export-Routen erfordern Authentifizierung
router.use(authenticate);

router.post('/gif',            startGifExport);
router.post('/mp4',            startMp4Export);
router.get('/status/:id',      getExportStatus);
router.get('/download/:id',    downloadExport);

export default router;

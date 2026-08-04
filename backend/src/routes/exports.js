/**
 * Export Routes – Issue #15 (GIF), Issue #23 (MP4), Issue #24 (PDF)
 */
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { startGifExport, startMp4Export, getExportStatus, downloadExport } from '../controllers/exportController.js';
import { exportPdf } from '../controllers/pdfExportController.js';

const router = Router();

// Alle Export-Routen erfordern Authentifizierung
router.use(authenticate);

router.post('/gif',            startGifExport);
router.post('/mp4',            startMp4Export);
router.post('/pdf',            exportPdf);
router.get('/status/:id',      getExportStatus);
router.get('/download/:id',    downloadExport);

export default router;

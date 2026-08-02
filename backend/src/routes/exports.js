/**
 * Export Routes – Issue #15
 */
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { startGifExport, getExportStatus, downloadExport } from '../controllers/exportController.js';

const router = Router();

// Alle Export-Routen erfordern Authentifizierung
router.use(authenticate);

router.post('/gif',            startGifExport);
router.get('/status/:id',      getExportStatus);
router.get('/download/:id',    downloadExport);

export default router;

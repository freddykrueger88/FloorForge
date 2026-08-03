/**
 * /api/settings – User-Einstellungen (Issue #18)
 */
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;

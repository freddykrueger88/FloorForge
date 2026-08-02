/**
 * FloorForge – Route Index
 */
import { Router } from 'express';
import authRoutes from './auth.js';
import boardRoutes from './boards.js';
import frameRoutes from './frames.js';
// import tacticsRoutes from './tactics.js'; // Issue #7
// import exportRoutes from './exports.js';  // Issue #13
// import settingsRoutes from './settings.js'; // Issue #15

const router = Router();

router.use('/auth', authRoutes);
router.use('/boards', boardRoutes);
router.use('/boards/:id/frames', frameRoutes);
// router.use('/tactics', tacticsRoutes);
// router.use('/exports', exportRoutes);
// router.use('/settings', settingsRoutes);

export default router;

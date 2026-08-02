/**
 * FloorForge – Route Index
 */
import { Router } from 'express';
import express from 'express';
import authRoutes from './auth.js';
import boardRoutes from './boards.js';
import frameRoutes from './frames.js';
import lineRoutes from './lines.js';
import exportRoutes from './exports.js';
// import tacticsRoutes from './tactics.js'; // Issue #7
// import settingsRoutes from './settings.js'; // Issue #18

const router = Router();

router.use('/auth',               authRoutes);
router.use('/boards',             boardRoutes);
router.use('/boards/:id/frames',  frameRoutes);
router.use('/boards/:id/lines',   lineRoutes);
// GIF-Export braucht großes JSON-Limit (Base64-PNGs) – nur auf diesem Sub-Router
router.use('/export', express.json({ limit: '50mb' }), exportRoutes);
// router.use('/tactics', tacticsRoutes);
// router.use('/settings', settingsRoutes);

export default router;

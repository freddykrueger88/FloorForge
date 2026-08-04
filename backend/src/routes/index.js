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
import shareViewRoutes from './shareView.js';
import settingsRoutes from './settings.js';
import userRoutes from './user.js';
import adminRoutes from './admin.js';
import formationRoutes from './formations.js';
// import tacticsRoutes from './tactics.js'; // Issue #7

const router = Router();

router.use('/auth',               authRoutes);
router.use('/boards',             boardRoutes);
router.use('/boards/:id/frames',  frameRoutes);
router.use('/boards/:id/lines',   lineRoutes);
// GIF-Export braucht großes JSON-Limit (Base64-PNGs) – nur auf diesem Sub-Router
router.use('/export', express.json({ limit: '50mb' }), exportRoutes);
// Öffentliche Share-Link-Ansicht – bewusst NICHT hinter authenticate (Issue #16)
router.use('/share', shareViewRoutes);
router.use('/settings', settingsRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/formations', formationRoutes);
// router.use('/tactics', tacticsRoutes);

export default router;

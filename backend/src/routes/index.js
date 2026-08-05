/**
 * OpenFloorball – Route Index
 */
import { Router } from 'express';
import express from 'express';
import authRoutes from './auth.js';
import boardRoutes from './boards.js';
import frameRoutes from './frames.js';
import lineRoutes from './lines.js';
import boardCollaboratorRoutes from './boardCollaborators.js';
import exportRoutes from './exports.js';
import shareViewRoutes from './shareView.js';
import settingsRoutes from './settings.js';
import userRoutes from './user.js';
import adminRoutes from './admin.js';
import formationRoutes from './formations.js';
import playbookRoutes from './playbooks.js';
import trainingRoutes from './trainings.js';
import rosterRoutes from './roster.js';
import teamRoutes from './teams.js';
import { createCommentRoutes } from './comments.js';
import { assertBoardAccess } from '../utils/boardAccess.js';
import { assertSessionRead, assertSessionWrite } from '../controllers/trainingSessionsController.js';
// import tacticsRoutes from './tactics.js'; // Issue #7

const boardCommentRoutes = createCommentRoutes('board', {
  assertRead:  (id, userId) => assertBoardAccess(id, userId, 'read'),
  assertWrite: (id, userId) => assertBoardAccess(id, userId, 'write'),
});
const sessionCommentRoutes = createCommentRoutes('training_session', {
  assertRead:  assertSessionRead,
  assertWrite: assertSessionWrite,
});

const router = Router();

router.use('/auth',               authRoutes);
router.use('/boards',             boardRoutes);
router.use('/boards/:id/frames',  frameRoutes);
router.use('/boards/:id/lines',   lineRoutes);
router.use('/boards/:id/collaborators', boardCollaboratorRoutes);
router.use('/boards/:id/comments', boardCommentRoutes);
router.use('/trainings/:id/comments', sessionCommentRoutes);
// GIF-Export braucht großes JSON-Limit (Base64-PNGs) – nur auf diesem Sub-Router
router.use('/export', express.json({ limit: '50mb' }), exportRoutes);
// Öffentliche Share-Link-Ansicht – bewusst NICHT hinter authenticate (Issue #16)
router.use('/share', shareViewRoutes);
router.use('/settings', settingsRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/formations', formationRoutes);
router.use('/playbooks', playbookRoutes);
router.use('/trainings', trainingRoutes);
router.use('/roster', rosterRoutes);
router.use('/teams', teamRoutes);
// router.use('/tactics', tacticsRoutes);

export default router;

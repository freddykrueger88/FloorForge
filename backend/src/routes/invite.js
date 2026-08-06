/**
 * /api/invite – Öffentliche Einladungs-Vorschau (kein Auth!)
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { getInvite } from '../controllers/inviteController.js';

const router = Router();

router.get('/:token', [param('token').isUUID().withMessage('Ungültiger Link'), validate], getInvite);

export default router;

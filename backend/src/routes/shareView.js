/**
 * /api/share – Öffentliche Share-Link-Ansicht (kein Auth!), Issue #16
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { getSharedBoard } from '../controllers/shareController.js';

const router = Router();

router.get('/:token', [param('token').isUUID().withMessage('Ungültiger Link'), validate], getSharedBoard);

export default router;

/**
 * /api/share – Öffentliche Share-Link-Ansicht (kein Auth!), Issue #16
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { getSharedBoard, getSharedFrame } from '../controllers/shareController.js';

const router = Router();

router.get('/frame/:token', [param('token').isUUID().withMessage('Ungültiger Link'), validate], getSharedFrame);
router.get('/:token', [param('token').isUUID().withMessage('Ungültiger Link'), validate], getSharedBoard);

export default router;

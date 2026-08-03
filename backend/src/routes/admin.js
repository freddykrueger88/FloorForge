/**
 * /api/admin – Benutzerverwaltung, nur für Admins (Issue #26)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listUsers, deleteUser, updateUserRole, getBackupConfig, updateBackupConfig,
} from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', listUsers);
router.delete('/users/:id', [param('id').isUUID(), validate], deleteUser);
router.put('/users/:id/role', [
  param('id').isUUID(),
  body('role').isIn(['admin', 'user']).withMessage('Ungültige Rolle'),
  validate,
], updateUserRole);

router.get('/backup-config', getBackupConfig);
router.put('/backup-config', [
  body('enabled').isBoolean().withMessage('enabled muss boolean sein'),
  body('schedule').isIn(['daily', 'weekly']).withMessage('Ungültiger Rhythmus'),
  body('retention').isInt({ min: 1, max: 90 }).withMessage('Aufbewahrung 1-90'),
  validate,
], updateBackupConfig);

export default router;

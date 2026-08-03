/**
 * /api/admin – Benutzerverwaltung, nur für Admins (Issue #26)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', listUsers);
router.delete('/users/:id', [param('id').isUUID(), validate], deleteUser);
router.put('/users/:id/role', [
  param('id').isUUID(),
  body('role').isIn(['admin', 'user']).withMessage('Ungültige Rolle'),
  validate,
], updateUserRole);

export default router;

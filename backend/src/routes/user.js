/**
 * /api/user – Account-Selbstverwaltung (Issue #22)
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { deleteAccount } from '../controllers/userController.js';

const router = Router();

router.use(authenticate);

router.delete('/account', [
  body('email').isEmail().withMessage('E-Mail-Bestätigung erforderlich'),
  validate,
], deleteAccount);

export default router;

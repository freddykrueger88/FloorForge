/**
 * /api/library – Community-Übungsbibliothek (EPIC 010 MVP)
 *
 * Instanz-intern: authentifiziert, aber jeder eingeloggte Nutzer dieser
 * Instanz darf lesen (kein Owner-/Collaborator-Zugriffscheck wie bei
 * Boards) – "öffentlich" heißt hier "öffentlich innerhalb der
 * self-hosted Instanz", nicht anonym wie /api/share/:token.
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listLibrary, getLibraryEntry, cloneLibraryEntry, deleteLibraryEntry, reportLibraryEntry,
} from '../controllers/libraryController.js';

const router = Router();

router.use(authenticate);

const validateId = [param('id').isUUID().withMessage('Ungültige Übungs-ID'), validate];

router.get   ('/',           listLibrary);
router.get   ('/:id',        validateId, getLibraryEntry);
router.post  ('/:id/clone',  validateId, cloneLibraryEntry);
router.post  ('/:id/report', [
  param('id').isUUID().withMessage('Ungültige Übungs-ID'),
  body('reason').optional().isLength({ max: 300 }).withMessage('Grund max. 300 Zeichen'),
  validate,
], reportLibraryEntry);
router.delete('/:id',        validateId, deleteLibraryEntry);

export default router;

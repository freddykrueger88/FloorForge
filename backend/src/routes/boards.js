/**
 * /api/boards – Spielfeld-Routen (authentifiziert, user-scoped)
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getBoards, getBoard, createBoard, updateBoard, deleteBoard,
} from '../controllers/boardsController.js';
import { createShareLink } from '../controllers/shareController.js';

const router = Router();

router.use(authenticate);

const validateBoard = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name ist erforderlich')
    .isLength({ max: 80 }).withMessage('Name max. 80 Zeichen'),
  body('fieldType')
    .optional()
    .isIn(['large', 'small', 'street', '3v3'])
    .withMessage('Ungültiger Spielfeld-Typ'),
  body('theme')
    .optional()
    .isIn(['dark', 'light', 'vikings', 'iff']),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notizen max. 500 Zeichen'),
  body('opponent').optional().trim().isLength({ max: 80 }).withMessage('Gegner max. 80 Zeichen'),
  body('homeColor').optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage('Heimfarbe muss ein Hex-Code sein'),
  body('awayColor').optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage('Auswärtsfarbe muss ein Hex-Code sein'),
  body('ballColor').optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage('Ballfarbe muss ein Hex-Code sein'),
  body('playbookId').optional({ nullable: true }).isUUID().withMessage('Ungültige Playbook-ID'),
];

const validateCreateBoard = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name ist erforderlich')
    .isLength({ max: 80 }).withMessage('Name max. 80 Zeichen'),
  ...validateBoard.slice(1),
];

router.get   ('/',     getBoards);
router.get   ('/:id',  [param('id').isUUID().withMessage('Ungültige Board-ID'), validate], getBoard);
router.post  ('/',     [validateCreateBoard, validate], createBoard);
router.put   ('/:id',  [param('id').isUUID(), ...validateBoard, validate], updateBoard);
router.delete('/:id',  [param('id').isUUID().withMessage('Ungültige Board-ID'), validate], deleteBoard);
router.post  ('/:id/share', [param('id').isUUID().withMessage('Ungültige Board-ID'), validate], createShareLink);

export default router;

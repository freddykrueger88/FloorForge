/**
 * /api/boards – Spielfeld-Routen
 */
import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getBoards, getBoard, createBoard, updateBoard, deleteBoard,
} from '../controllers/boardsController.js';

const router = Router();

const validateId = param('id').isMongoId().withMessage('Ungültige Board-ID');

const validateBoard = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name ist erforderlich')
    .isLength({ max: 80 }).withMessage('Name max. 80 Zeichen'),
  body('fieldType')
    .optional()
    .isIn(['large', 'small', 'street', 'three_v_three'])
    .withMessage('Ungültiger Spielfeld-Typ'),
  body('theme')
    .optional()
    .isIn(['dark', 'light', 'vikings', 'iff']),
];

router.get   ('/',     getBoards);
router.get   ('/:id', validateId, getBoard);
router.post  ('/',    validateBoard, createBoard);
router.put   ('/:id', [validateId, ...validateBoard], updateBoard);
router.delete('/:id', validateId, deleteBoard);

export default router;

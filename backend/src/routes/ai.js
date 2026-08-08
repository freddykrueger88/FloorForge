/**
 * /api/ai – KI-Trainingsassistent (EPIC 010, AI_SYSTEM.md §5.1 MVP)
 * Authentifiziert, kein Admin-Zwang – jeder eingeloggte Trainer dieser
 * Instanz darf den Assistenten nutzen.
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getAiStatus, generateTrainingPlan } from '../controllers/aiController.js';

const router = Router();

router.use(authenticate);

router.get('/status', getAiStatus);

router.post('/training-plan', [
  // Feste Liste statt Freitext – verhindert schon auf Validierungsebene,
  // dass hier versehentlich Personendaten landen (AI_SYSTEM.md §8).
  body('ageGroup').isIn(['U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'Erwachsene'])
    .withMessage('Ungültige Altersgruppe'),
  body('goal').trim().notEmpty().isLength({ max: 150 }).withMessage('Ziel max. 150 Zeichen'),
  body('focus').trim().notEmpty().isLength({ max: 150 }).withMessage('Schwerpunkt max. 150 Zeichen'),
  body('durationMinutes').isInt({ min: 15, max: 180 }).withMessage('Dauer 15-180 Minuten'),
  body('playerCount').isInt({ min: 1, max: 40 }).withMessage('Spieleranzahl 1-40'),
  validate,
], generateTrainingPlan);

export default router;

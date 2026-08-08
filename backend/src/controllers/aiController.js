/**
 * aiController – KI-Trainingsassistent (EPIC 010, AI_SYSTEM.md §5.1 MVP)
 *
 * Erzeugt nur einen Textentwurf, speichert nichts selbst – der Trainer
 * entscheidet separat über den bestehenden Trainingseinheiten-Flow
 * (POST /api/trainings), ob/wie der Vorschlag übernommen wird
 * (AI_STRATEGY.md §19: KI erstellt, Trainer prüft, dann Speichern).
 */
import { getAiProvider } from '../services/ai/aiProvider.js';
import { renderTrainingPrompt, renderTacticsPrompt, renderAnalysisPrompt } from '../services/ai/promptLoader.js';
import { success, error } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

const SYSTEM_PROMPT = 'Du folgst den Anweisungen und Regeln aus der folgenden Vorlage exakt.';

// GET /api/ai/status – Transparenz (AI_SYSTEM.md §2 "der Nutzer muss
// erkennen, wann KI verwendet wird") + steuert im Frontend, ob der
// "Mit KI planen"-Button überhaupt angezeigt wird.
export async function getAiStatus(req, res) {
  try {
    const provider = await getAiProvider();
    res.json(success({
      configured: provider !== null,
      model: provider?.model || null,
    }));
  } catch (err) {
    logger.error('[getAiStatus]', err);
    res.status(500).json(error('Interner Serverfehler'));
  }
}

// POST /api/ai/training-plan
export async function generateTrainingPlan(req, res) {
  try {
    const provider = await getAiProvider();
    if (!provider) {
      return res.status(503).json(error('KI-Assistent ist auf dieser Instanz nicht konfiguriert'));
    }

    const { ageGroup, goal, durationMinutes, playerCount, focus } = req.body;
    const userPrompt = renderTrainingPrompt({ ageGroup, goal, durationMinutes, playerCount, focus });

    const { text, model } = await provider.generate({ systemPrompt: SYSTEM_PROMPT, userPrompt });
    res.json(success({
      planText: text,
      model,
      generatedAt: new Date().toISOString(),
      disclaimer: 'Von KI generiert – bitte vor dem Einsatz prüfen und anpassen.',
    }));
  } catch (err) {
    logger.error('[generateTrainingPlan]', err);
    res.status(502).json(error('KI-Anbieter konnte keinen Vorschlag liefern, bitte später erneut versuchen'));
  }
}

// POST /api/ai/tactic-suggestion
export async function generateTacticSuggestion(req, res) {
  try {
    const provider = await getAiProvider();
    if (!provider) {
      return res.status(503).json(error('KI-Assistent ist auf dieser Instanz nicht konfiguriert'));
    }

    const { category, question } = req.body;
    const userPrompt = renderTacticsPrompt({ category, question });

    const { text, model } = await provider.generate({ systemPrompt: SYSTEM_PROMPT, userPrompt });
    res.json(success({
      suggestionText: text,
      model,
      generatedAt: new Date().toISOString(),
      disclaimer: 'Von KI generiert – bitte vor dem Einsatz prüfen und anpassen.',
    }));
  } catch (err) {
    logger.error('[generateTacticSuggestion]', err);
    res.status(502).json(error('KI-Anbieter konnte keinen Vorschlag liefern, bitte später erneut versuchen'));
  }
}

// POST /api/ai/analysis
export async function generateAnalysis(req, res) {
  try {
    const provider = await getAiProvider();
    if (!provider) {
      return res.status(503).json(error('KI-Assistent ist auf dieser Instanz nicht konfiguriert'));
    }

    const { observations, focus = '' } = req.body;
    const userPrompt = renderAnalysisPrompt({ observations, focus });

    const { text, model } = await provider.generate({ systemPrompt: SYSTEM_PROMPT, userPrompt });
    res.json(success({
      analysisText: text,
      model,
      generatedAt: new Date().toISOString(),
      disclaimer: 'Von KI generiert – bitte vor dem Einsatz prüfen und anpassen.',
    }));
  } catch (err) {
    logger.error('[generateAnalysis]', err);
    res.status(502).json(error('KI-Anbieter konnte keinen Vorschlag liefern, bitte später erneut versuchen'));
  }
}

/**
 * promptLoader – zentrale Prompt-Vorlagen statt im Code verstreut
 * (AI_SYSTEM.md §13). Einfacher String-Replace der `{{platzhalter}}`-
 * Syntax reicht für die Handvoll Variablen hier – kein Template-Engine-
 * Overhead nötig.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let cachedTrainingTemplate = null;

function renderTemplate(template, vars) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

export function renderTrainingPrompt(vars) {
  if (cachedTrainingTemplate === null) {
    cachedTrainingTemplate = readFileSync(
      path.join(__dirname, 'prompts', 'training.md'),
      'utf-8'
    );
  }
  return renderTemplate(cachedTrainingTemplate, vars);
}

/**
 * aiProvider – Abstraktionsschicht für den KI-Trainingsassistenten
 * (AI_SYSTEM.md §3/§4: App -> AI Interface -> Model Adapter).
 *
 * Konfiguration kommt primär aus app_config (Admin-editierbar über
 * Einstellungen -> Admin, ohne Server-Neustart) – die AI_PROVIDER_*-
 * Env-Vars bleiben als Fallback für Erstinstallationen/automatisierte
 * Deployments bestehen, die die Config lieber per .env statt UI setzen.
 * Ist beides leer, bleibt der KI-Assistent einfach unkonfiguriert (kein
 * Fehler, kein Zwang – analog utils/mailer.js).
 *
 * Bewusst kein Caching der Adapter-Instanz: die Config kann sich zur
 * Laufzeit über die Admin-UI ändern, ein Prozess-Cache würde das erst
 * nach einem Neustart übernehmen.
 *
 * Interface laut AI_SYSTEM.md §4: `generate`/`analyze`/`explain`. Für
 * dieses MVP (Trainingsassistent) ist nur `generate` implementiert.
 * `analyze` (Taktikassistent-Varianten, §5.2) und `explain` (Erklärungen
 * zu Vorschlägen) sind für spätere Iterationen vorgesehen und bewusst
 * noch nicht angelegt, um keinen toten Code zu hinterlassen.
 */
import pool from '../../db/pool.js';
import { OpenAiCompatibleAdapter } from './openAiCompatibleAdapter.js';

export async function getAiProviderConfig() {
  const result = await pool.query(
    `SELECT ai_provider_base_url, ai_provider_api_key, ai_provider_model, ai_provider_timeout_ms
     FROM app_config LIMIT 1`
  );
  const row = result.rows[0];

  const baseUrl = row?.ai_provider_base_url || process.env.AI_PROVIDER_BASE_URL || '';
  if (!baseUrl) return null;

  const fromDb = Boolean(row?.ai_provider_base_url);
  return {
    baseUrl,
    apiKey: (fromDb ? row.ai_provider_api_key : process.env.AI_PROVIDER_API_KEY) || null,
    model: (fromDb ? row.ai_provider_model : process.env.AI_PROVIDER_MODEL) || '',
    timeoutMs: (fromDb ? row.ai_provider_timeout_ms : parseInt(process.env.AI_PROVIDER_TIMEOUT_MS, 10)) || 30000,
  };
}

export async function getAiProvider() {
  const config = await getAiProviderConfig();
  if (!config) return null;
  return new OpenAiCompatibleAdapter(config);
}

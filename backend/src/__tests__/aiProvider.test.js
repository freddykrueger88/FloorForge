import './setup.js';
import { jest } from '@jest/globals';
import pool from '../db/pool.js';
import { connectRedis } from '../db/redis.js';
import { runMigrations } from '../db/migrate.js';
import { getAiProvider } from '../services/ai/aiProvider.js';
import { OpenAiCompatibleAdapter, AiProviderError } from '../services/ai/openAiCompatibleAdapter.js';

async function setAiConfig({ baseUrl = '', apiKey = '', model = '', timeoutMs = 30000 }) {
  await pool.query(
    `UPDATE app_config SET ai_provider_base_url = $1, ai_provider_api_key = $2,
                            ai_provider_model = $3, ai_provider_timeout_ms = $4`,
    [baseUrl, apiKey, model, timeoutMs]
  );
}

beforeAll(async () => {
  await connectRedis();
  await runMigrations();
});

afterAll(async () => {
  await setAiConfig({}); // sauber zurücksetzen, andere Tests laufen gegen dieselbe app_config-Zeile
  await pool.end();
  const redisClient = (await import('../db/redis.js')).default;
  await redisClient.quit();
});

describe('getAiProvider (DB-Konfiguration, admin-editierbar)', () => {
  const originalEnv = { ...process.env };
  afterEach(async () => {
    process.env = { ...originalEnv };
    await setAiConfig({});
  });

  it('liefert null, wenn weder DB-Konfiguration noch Env-Var gesetzt ist', async () => {
    delete process.env.AI_PROVIDER_BASE_URL;
    expect(await getAiProvider()).toBeNull();
  });

  it('liefert eine Adapter-Instanz aus der DB-Konfiguration', async () => {
    await setAiConfig({ baseUrl: 'http://fake-ai:8080/v1', model: 'db-model', apiKey: 'db-key' });
    const provider = await getAiProvider();
    expect(provider).toBeInstanceOf(OpenAiCompatibleAdapter);
    expect(provider.model).toBe('db-model');
    expect(provider.apiKey).toBe('db-key');
  });

  it('fällt auf die Env-Var zurück, wenn die DB-Konfiguration leer ist', async () => {
    process.env.AI_PROVIDER_BASE_URL = 'http://env-fallback:8080/v1';
    process.env.AI_PROVIDER_MODEL = 'env-model';
    const provider = await getAiProvider();
    expect(provider.baseUrl).toBe('http://env-fallback:8080/v1');
    expect(provider.model).toBe('env-model');
  });

  it('DB-Konfiguration hat Vorrang vor der Env-Var, sobald ein Admin sie über die UI setzt', async () => {
    process.env.AI_PROVIDER_BASE_URL = 'http://env-fallback:8080/v1';
    await setAiConfig({ baseUrl: 'http://db-wins:8080/v1', model: 'db-model' });
    const provider = await getAiProvider();
    expect(provider.baseUrl).toBe('http://db-wins:8080/v1');
  });
});

describe('OpenAiCompatibleAdapter.generate', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('baut den Request korrekt (URL, Body-Schema, Model) und parsed den Antworttext', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Warm-up: Lauf-ABC...' } }] }),
    });

    const adapter = new OpenAiCompatibleAdapter({
      baseUrl: 'http://fake-ai:8080/v1', apiKey: 'secret', model: 'test-model', timeoutMs: 5000,
    });
    const result = await adapter.generate({ systemPrompt: 'sys', userPrompt: 'user' });

    expect(result).toEqual({ text: 'Warm-up: Lauf-ABC...', model: 'test-model' });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://fake-ai:8080/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer secret' }),
      })
    );
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.model).toBe('test-model');
    expect(body.messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'user' },
    ]);
  });

  it('setzt keinen Authorization-Header ohne apiKey', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'x' } }] }),
    });
    const adapter = new OpenAiCompatibleAdapter({
      baseUrl: 'http://fake-ai:8080/v1', apiKey: null, model: 'm', timeoutMs: 5000,
    });
    await adapter.generate({ systemPrompt: 's', userPrompt: 'u' });
    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('wirft AiProviderError bei Non-2xx-Antwort', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    const adapter = new OpenAiCompatibleAdapter({
      baseUrl: 'http://fake-ai:8080/v1', apiKey: null, model: 'm', timeoutMs: 5000,
    });
    await expect(adapter.generate({ systemPrompt: 's', userPrompt: 'u' })).rejects.toThrow(AiProviderError);
  });

  it('wirft AiProviderError bei Netzwerkfehler', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed'));
    const adapter = new OpenAiCompatibleAdapter({
      baseUrl: 'http://fake-ai:8080/v1', apiKey: null, model: 'm', timeoutMs: 5000,
    });
    await expect(adapter.generate({ systemPrompt: 's', userPrompt: 'u' })).rejects.toThrow(AiProviderError);
  });

  it('wirft AiProviderError, wenn keine Antwort ohne Textinhalt kommt', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [] }) });
    const adapter = new OpenAiCompatibleAdapter({
      baseUrl: 'http://fake-ai:8080/v1', apiKey: null, model: 'm', timeoutMs: 5000,
    });
    await expect(adapter.generate({ systemPrompt: 's', userPrompt: 'u' })).rejects.toThrow(AiProviderError);
  });
});

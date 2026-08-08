/**
 * OpenAiCompatibleAdapter – Model Adapter für das `/v1/chat/completions`-
 * Schema (AI_SYSTEM.md §3/§4). Bewusst der einzige MVP-Adapter: Ollama,
 * LM Studio und vLLM unterstützen diesen Pfad ebenso wie kommerzielle
 * Anbieter, die dasselbe Format anbieten – das deckt die geforderte
 * Austauschbarkeit ab, ohne mehrere SDKs einzubinden (kein axios/
 * openai-Paket, nur natives fetch).
 */
export class AiProviderError extends Error {
  constructor(message, { cause } = {}) {
    super(message);
    this.name = 'AiProviderError';
    if (cause) this.cause = cause;
  }
}

export class OpenAiCompatibleAdapter {
  constructor({ baseUrl, apiKey, model, timeoutMs }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  async generate({ systemPrompt, userPrompt }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let res;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new AiProviderError('KI-Anbieter hat nicht rechtzeitig geantwortet', { cause: err });
      }
      throw new AiProviderError('KI-Anbieter nicht erreichbar', { cause: err });
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      throw new AiProviderError(`KI-Anbieter antwortete mit Status ${res.status}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new AiProviderError('Antwort des KI-Anbieters konnte nicht gelesen werden', { cause: err });
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new AiProviderError('KI-Anbieter lieferte keinen Text zurück');
    }

    return { text, model: this.model };
  }
}

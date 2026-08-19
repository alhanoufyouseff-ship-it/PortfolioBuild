import 'server-only';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CallOptions {
  json?: boolean;
  temperature?: number;
  model?: string;
}

/**
 * Calls OpenRouter's chat-completions endpoint. Server-side only —
 * OPENROUTER_API_KEY must never reach the client.
 */
export async function callOpenRouter(messages: ChatMessage[], options: CallOptions = {}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY غير مضبوط على السيرفر');
  }

  const model = options.model || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-Title': 'PortfolioBuild'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.5,
      ...(options.json ? { response_format: { type: 'json_object' } } : {})
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenRouter request failed (${response.status}): ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('استجابة غير متوقعة من OpenRouter');
  }
  return content;
}

/** Extracts the first JSON object/array from a model response, tolerating markdown fences. */
export function extractJson<T = unknown>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.search(/[[{]/);
  if (start === -1) {
    throw new Error('لم يتم العثور على JSON في استجابة النموذج');
  }
  const candidate = raw.slice(start);
  return JSON.parse(candidate) as T;
}

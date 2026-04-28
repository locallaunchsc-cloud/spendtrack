// Hand-rolled validator for UsageEvent ingest payloads.
// Zero dependency to keep the API surface tiny.

export interface ValidatedEvent {
  provider: 'anthropic' | 'openai';
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number | null;
  cacheWriteTokens: number | null;
  cost: number;
  tag: string | null;
  sdkVersion: string | null;
  occurredAt: Date;
}

export type ValidationResult =
  | { ok: true; event: ValidatedEvent }
  | { ok: false; error: string };

const PROVIDERS = new Set(['anthropic', 'openai']);
const MAX_STRING = 256;
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;     // 5 min ahead allowed
const MAX_PAST_SKEW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days back allowed

function isInt(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 1e10;
}

function isNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1e6;
}

function str(v: unknown, max = MAX_STRING): string | null {
  if (v == null) return null;
  if (typeof v !== 'string') return null;
  if (v.length === 0 || v.length > max) return null;
  return v;
}

export function validateEvent(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Body must be a JSON object' };
  const b = body as Record<string, unknown>;

  if (typeof b.provider !== 'string' || !PROVIDERS.has(b.provider)) {
    return { ok: false, error: `provider must be one of: ${[...PROVIDERS].join(', ')}` };
  }

  const model = str(b.model, 128);
  if (!model) return { ok: false, error: 'model is required (string, 1-128 chars)' };

  if (!isInt(b.inputTokens)) return { ok: false, error: 'inputTokens must be a non-negative integer' };
  if (!isInt(b.outputTokens)) return { ok: false, error: 'outputTokens must be a non-negative integer' };

  if (b.cacheReadTokens !== undefined && b.cacheReadTokens !== null && !isInt(b.cacheReadTokens)) {
    return { ok: false, error: 'cacheReadTokens must be a non-negative integer' };
  }
  if (b.cacheWriteTokens !== undefined && b.cacheWriteTokens !== null && !isInt(b.cacheWriteTokens)) {
    return { ok: false, error: 'cacheWriteTokens must be a non-negative integer' };
  }

  if (!isNum(b.cost)) return { ok: false, error: 'cost must be a non-negative finite number' };

  const tag = b.tag === undefined || b.tag === null ? null : str(b.tag, 128);
  if (b.tag != null && tag === null) return { ok: false, error: 'tag must be a string up to 128 chars' };

  const sdkVersion = b.sdkVersion === undefined || b.sdkVersion === null ? null : str(b.sdkVersion, 32);
  if (b.sdkVersion != null && sdkVersion === null) return { ok: false, error: 'sdkVersion must be a string up to 32 chars' };

  const tsRaw = b.timestamp;
  if (typeof tsRaw !== 'string') return { ok: false, error: 'timestamp must be an ISO 8601 string' };
  const ts = new Date(tsRaw);
  if (Number.isNaN(ts.getTime())) return { ok: false, error: 'timestamp is not a valid date' };
  const now = Date.now();
  if (ts.getTime() - now > MAX_FUTURE_SKEW_MS) return { ok: false, error: 'timestamp is too far in the future' };
  if (now - ts.getTime() > MAX_PAST_SKEW_MS) return { ok: false, error: 'timestamp is too far in the past (>30d)' };

  return {
    ok: true,
    event: {
      provider: b.provider as 'anthropic' | 'openai',
      model,
      inputTokens: b.inputTokens as number,
      outputTokens: b.outputTokens as number,
      cacheReadTokens: (b.cacheReadTokens as number | undefined) ?? null,
      cacheWriteTokens: (b.cacheWriteTokens as number | undefined) ?? null,
      cost: b.cost as number,
      tag,
      sdkVersion,
      occurredAt: ts,
    },
  };
}

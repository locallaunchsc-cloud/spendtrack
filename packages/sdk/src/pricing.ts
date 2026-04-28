// Public pricing tables (per 1M tokens, USD).
// Keep in sync with provider docs. Update via PR.

export interface ModelPrice {
  /** USD per 1M input tokens */
  input: number;
  /** USD per 1M output tokens */
  output: number;
  /** USD per 1M cached input tokens (Anthropic prompt caching reads) */
  cacheRead?: number;
  /** USD per 1M cache-write input tokens (Anthropic prompt caching writes) */
  cacheWrite?: number;
}

export const ANTHROPIC_PRICING: Record<string, ModelPrice> = {
  'claude-opus-4-7':       { input: 15,   output: 75,   cacheRead: 1.5,  cacheWrite: 18.75 },
  'claude-sonnet-4-6':     { input: 3,    output: 15,   cacheRead: 0.3,  cacheWrite: 3.75 },
  'claude-haiku-4-5':      { input: 0.8,  output: 4,    cacheRead: 0.08, cacheWrite: 1 },
};

export const OPENAI_PRICING: Record<string, ModelPrice> = {
  'gpt-4o':         { input: 2.5,  output: 10 },
  'gpt-4o-mini':    { input: 0.15, output: 0.6 },
  'gpt-4-turbo':    { input: 10,   output: 30 },
  'gpt-4':          { input: 30,   output: 60 },
};

/** Find pricing by exact match or model-family prefix (handles dated suffixes like -20251001). */
export function findPrice(
  table: Record<string, ModelPrice>,
  model: string,
): ModelPrice | undefined {
  if (table[model]) return table[model];
  // Try prefix match: longest matching key wins.
  let best: { key: string; price: ModelPrice } | undefined;
  for (const [key, price] of Object.entries(table)) {
    if (model.startsWith(key) && (!best || key.length > best.key.length)) {
      best = { key, price };
    }
  }
  return best?.price;
}

export interface CostInput {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
}

export function computeCost(price: ModelPrice | undefined, usage: CostInput): number {
  if (!price) return 0;
  const perToken = (n: number, ratePerMillion: number) => (n * ratePerMillion) / 1_000_000;
  return (
    perToken(usage.inputTokens, price.input) +
    perToken(usage.outputTokens, price.output) +
    perToken(usage.cacheReadTokens ?? 0, price.cacheRead ?? price.input) +
    perToken(usage.cacheWriteTokens ?? 0, price.cacheWrite ?? price.input)
  );
}

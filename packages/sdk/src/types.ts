// Types for SpendTrack SDK. Re-exported from package root.
// Mirrors @spendtrack/shared so the SDK stays standalone-publishable.

export type Provider = 'anthropic' | 'openai';

export interface UsageEvent {
  /** ISO 8601 timestamp */
  timestamp: string;
  projectId: string;
  provider: Provider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Cached input tokens (Anthropic prompt caching reads, OpenAI cached_tokens) */
  cacheReadTokens?: number;
  /** Anthropic prompt cache writes */
  cacheWriteTokens?: number;
  /** Cost in USD. */
  cost: number;
  /** Optional user-supplied tag (feature, route, env, etc). */
  tag?: string;
  /** SDK version that produced the event. */
  sdkVersion: string;
}

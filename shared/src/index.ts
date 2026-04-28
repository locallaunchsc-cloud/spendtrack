// Shared types between SDK and API

export type Provider = 'anthropic' | 'openai';

export interface UsageEvent {
  /** ISO 8601 timestamp */
  timestamp: string;
  projectId: string;
  provider: Provider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Cached input tokens (Anthropic prompt caching). Optional. */
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  /** Cost in USD. */
  cost: number;
  /** Optional user-supplied tag (feature, route, env, etc). */
  tag?: string;
  /** SDK version that produced the event. */
  sdkVersion: string;
}

export interface ProjectMetrics {
  projectId: string;
  totalCost: number;
  tokenCount: number;
  requestCount: number;
  costByModel: Record<string, number>;
}

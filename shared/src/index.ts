// Shared types between SDK and API

export interface UsageEvent {
  timestamp: Date;
  projectId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface ProjectMetrics {
  projectId: string;
  totalCost: number;
  tokenCount: number;
  requestCount: number;
  costByModel: Record<string, number>;
}

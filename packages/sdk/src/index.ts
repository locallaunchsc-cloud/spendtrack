// SpendTrack SDK - wraps API calls and tracks spending

export * from './anthropic';
export * from './openai';

export interface SpendTrackConfig {
  projectId: string;
  serviceUrl?: string; // defaults to spendtrack.dev
}

export class SpendTrack {
  private projectId: string;
  private serviceUrl: string;

  constructor(config: SpendTrackConfig) {
    this.projectId = config.projectId;
    this.serviceUrl = config.serviceUrl || 'https://api.spendtrack.dev';
  }

  private async logUsage(model: string, inputTokens: number, outputTokens: number) {
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    // Send metrics to backend (non-blocking)
    fetch(`${this.serviceUrl}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date(),
        projectId: this.projectId,
        model,
        inputTokens,
        outputTokens,
        cost,
      }),
    }).catch(() => {}); // Silently fail if backend is down
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    // Pricing as of Apr 2026 (update as needed)
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-opus-4-7': { input: 0.015, output: 0.075 },
      'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
      'claude-haiku-4-5-20251001': { input: 0.0008, output: 0.004 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4o': { input: 0.005, output: 0.015 },
    };

    const price = pricing[model] || { input: 0, output: 0 };
    return (inputTokens * price.input + outputTokens * price.output) / 1000;
  }

  wrap(client: any) {
    // Wraps any API client to track usage
    return new Proxy(client, {
      get: (target, prop) => {
        if (prop === 'messages' && target.messages?.create) {
          return new Proxy(target.messages, {
            get: (msgTarget, msgProp) => {
              if (msgProp === 'create') {
                return async (params: any) => {
                  const response = await msgTarget.create(params);
                  this.logUsage(
                    response.model,
                    response.usage.input_tokens,
                    response.usage.output_tokens
                  );
                  return response;
                };
              }
              return msgTarget[msgProp];
            },
          });
        }
        return target[prop];
      },
    });
  }
}

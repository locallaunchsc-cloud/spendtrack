import type { UsageEvent } from '@spendtrack/shared';
import { OPENAI_PRICING, computeCost, findPrice } from './pricing';
import type { Transport } from './transport';

const SDK_VERSION = '0.1.0';

interface OpenAIChatResponse {
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    prompt_tokens_details?: { cached_tokens?: number };
  };
}

interface OpenAILike {
  chat: {
    completions: {
      create: (params: unknown) => Promise<OpenAIChatResponse>;
    };
  };
}

export interface WrapOptions {
  projectId: string;
  transport: Transport;
  tag?: string;
}

/**
 * Wrap an OpenAI SDK client so every `chat.completions.create` call reports a UsageEvent.
 * Streaming responses are not tracked in v0.1.
 */
export function wrapOpenAI<T extends OpenAILike>(client: T, opts: WrapOptions): T {
  const originalCreate = client.chat.completions.create.bind(client.chat.completions);

  const wrappedCreate = async (params: unknown) => {
    const response = await originalCreate(params);

    if (!response || typeof response !== 'object' || !('usage' in response) || !response.usage) {
      return response;
    }

    const cached = response.usage.prompt_tokens_details?.cached_tokens ?? 0;
    const inputTokens = (response.usage.prompt_tokens ?? 0) - cached;

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      projectId: opts.projectId,
      provider: 'openai',
      model: response.model,
      inputTokens,
      outputTokens: response.usage.completion_tokens ?? 0,
      cacheReadTokens: cached || undefined,
      cost: computeCost(findPrice(OPENAI_PRICING, response.model), {
        inputTokens,
        outputTokens: response.usage.completion_tokens ?? 0,
        cacheReadTokens: cached,
      }),
      tag: opts.tag,
      sdkVersion: SDK_VERSION,
    };

    opts.transport.send(event);
    return response;
  };

  return {
    ...client,
    chat: {
      ...client.chat,
      completions: { ...client.chat.completions, create: wrappedCreate },
    },
  } as T;
}

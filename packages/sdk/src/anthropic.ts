import type { UsageEvent } from '@spendtrack/shared';
import { ANTHROPIC_PRICING, computeCost, findPrice } from './pricing';
import type { Transport } from './transport';

const SDK_VERSION = '0.1.0';

interface AnthropicMessageResponse {
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

interface AnthropicLike {
  messages: {
    create: (params: unknown) => Promise<AnthropicMessageResponse>;
  };
}

export interface WrapOptions {
  projectId: string;
  transport: Transport;
  /** Optional default tag applied to every event. */
  tag?: string;
}

/**
 * Wrap an Anthropic SDK client so every `messages.create` call reports a UsageEvent.
 *
 * Streaming (`stream: true`) is not yet tracked in v0.1 — those calls pass through
 * unmodified. Roadmap: subscribe to the stream and emit on completion.
 */
export function wrapAnthropic<T extends AnthropicLike>(client: T, opts: WrapOptions): T {
  const originalCreate = client.messages.create.bind(client.messages);

  const wrappedCreate = async (params: unknown) => {
    const response = await originalCreate(params);

    if (!response || typeof response !== 'object' || !('usage' in response)) {
      return response;
    }

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      projectId: opts.projectId,
      provider: 'anthropic',
      model: response.model,
      inputTokens: response.usage.input_tokens ?? 0,
      outputTokens: response.usage.output_tokens ?? 0,
      cacheReadTokens: response.usage.cache_read_input_tokens,
      cacheWriteTokens: response.usage.cache_creation_input_tokens,
      cost: computeCost(findPrice(ANTHROPIC_PRICING, response.model), {
        inputTokens: response.usage.input_tokens ?? 0,
        outputTokens: response.usage.output_tokens ?? 0,
        cacheReadTokens: response.usage.cache_read_input_tokens,
        cacheWriteTokens: response.usage.cache_creation_input_tokens,
      }),
      tag: opts.tag,
      sdkVersion: SDK_VERSION,
    };

    opts.transport.send(event);
    return response;
  };

  return {
    ...client,
    messages: { ...client.messages, create: wrappedCreate },
  } as T;
}

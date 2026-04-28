// SpendTrack SDK — track AI spend without leaking keys, prompts, or completions.
//
// Usage:
//   import { SpendTrack } from '@spendtrack/sdk';
//   import Anthropic from '@anthropic-ai/sdk';
//
//   const st = new SpendTrack({ projectId: 'my-app' });
//   const client = st.wrapAnthropic(new Anthropic());
//   // ...use client normally; spend is reported automatically.

import { wrapAnthropic } from './anthropic';
import { wrapOpenAI } from './openai';
import { HttpTransport, MemoryTransport, type Transport } from './transport';

export { wrapAnthropic, wrapOpenAI, HttpTransport, MemoryTransport };
export type { Transport };
export * from './pricing';
export type { UsageEvent, ProjectMetrics, Provider } from '@spendtrack/shared';

export interface SpendTrackConfig {
  projectId: string;
  /** Ingestion endpoint. Defaults to https://api.spendtrack.dev. */
  serviceUrl?: string;
  /** Optional API key for the SpendTrack ingestion API. */
  apiKey?: string;
  /** Bring-your-own transport (e.g. MemoryTransport for tests). */
  transport?: Transport;
  /** Optional default tag applied to every reported event. */
  tag?: string;
  /** Called on transport errors. Default: silent. */
  onError?: (err: unknown) => void;
}

export class SpendTrack {
  readonly projectId: string;
  readonly transport: Transport;
  private tag?: string;

  constructor(config: SpendTrackConfig) {
    this.projectId = config.projectId;
    this.tag = config.tag;
    this.transport =
      config.transport ??
      new HttpTransport({
        serviceUrl: config.serviceUrl ?? 'https://api.spendtrack.dev',
        apiKey: config.apiKey,
        onError: config.onError,
      });
  }

  wrapAnthropic<T extends Parameters<typeof wrapAnthropic>[0]>(client: T): T {
    return wrapAnthropic(client, {
      projectId: this.projectId,
      transport: this.transport,
      tag: this.tag,
    });
  }

  wrapOpenAI<T extends Parameters<typeof wrapOpenAI>[0]>(client: T): T {
    return wrapOpenAI(client, {
      projectId: this.projectId,
      transport: this.transport,
      tag: this.tag,
    });
  }

  /** Wait for in-flight events to flush. Call before process exit. */
  flush(): Promise<void> {
    return this.transport.flush();
  }
}

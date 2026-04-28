import type { UsageEvent } from '@spendtrack/shared';

export interface Transport {
  send(event: UsageEvent): void;
  flush(): Promise<void>;
}

export interface HttpTransportOptions {
  serviceUrl: string;
  /** Optional API key. Sent as Authorization: Bearer. */
  apiKey?: string;
  /** Override fetch (for tests). */
  fetchImpl?: typeof fetch;
  /** Called when an event fails to send. Default: silent. */
  onError?: (err: unknown) => void;
}

/**
 * Minimal HTTP transport. Fire-and-forget, never throws into user code.
 * Tracks in-flight requests so flush() can await them on shutdown.
 */
export class HttpTransport implements Transport {
  private inFlight = new Set<Promise<void>>();
  private opts: HttpTransportOptions;

  constructor(opts: HttpTransportOptions) {
    this.opts = opts;
  }

  send(event: UsageEvent): void {
    const fetchImpl = this.opts.fetchImpl ?? globalThis.fetch;
    if (!fetchImpl) {
      this.opts.onError?.(new Error('No fetch available'));
      return;
    }
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.opts.apiKey) headers.Authorization = `Bearer ${this.opts.apiKey}`;

    const p = fetchImpl(`${this.opts.serviceUrl}/v1/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
    })
      .then(() => undefined)
      .catch((err) => {
        this.opts.onError?.(err);
      })
      .finally(() => {
        this.inFlight.delete(p);
      });
    this.inFlight.add(p);
  }

  async flush(): Promise<void> {
    await Promise.all([...this.inFlight]);
  }
}

/** No-op transport for testing or self-hosted scenarios with custom delivery. */
export class MemoryTransport implements Transport {
  events: UsageEvent[] = [];
  send(event: UsageEvent): void {
    this.events.push(event);
  }
  async flush(): Promise<void> {}
}

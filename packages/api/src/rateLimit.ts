import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from './auth';

/**
 * In-memory token bucket per API key. Good enough for single-instance v0.1.
 * Swap for Redis/Cloudflare durable object once we go multi-region.
 */
interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOpts {
  /** Max events per minute per project. Default: 600 (10/sec sustained). */
  perMinute?: number;
  /** Burst capacity. Default: 100. */
  burst?: number;
}

export function rateLimit(opts: RateLimitOpts = {}) {
  const perMinute = opts.perMinute ?? 600;
  const burst = opts.burst ?? 100;
  const refillRatePerMs = perMinute / 60_000;

  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    const key = req.project?.projectId;
    if (!key) {
      next();
      return;
    }
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: burst, lastRefill: now };
      buckets.set(key, bucket);
    } else {
      const elapsed = now - bucket.lastRefill;
      bucket.tokens = Math.min(burst, bucket.tokens + elapsed * refillRatePerMs);
      bucket.lastRefill = now;
    }
    if (bucket.tokens < 1) {
      res.setHeader('Retry-After', '1');
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }
    bucket.tokens -= 1;
    next();
  };
}

/** Test helper. */
export function _resetBuckets() {
  buckets.clear();
}

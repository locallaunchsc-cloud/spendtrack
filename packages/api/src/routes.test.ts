// Unit tests for the validator (no DB needed). Run with `tsx src/routes.test.ts`.
import { validateEvent } from './validate';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

const baseValid = {
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  inputTokens: 100,
  outputTokens: 50,
  cost: 0.0015,
  timestamp: new Date().toISOString(),
};

function testHappyPath() {
  const r = validateEvent(baseValid);
  assert(r.ok, `valid payload should pass: ${!r.ok && r.error}`);
}

function testRejectBadProvider() {
  const r = validateEvent({ ...baseValid, provider: 'cohere' });
  assert(!r.ok, 'unknown provider should fail');
}

function testRejectNegativeTokens() {
  const r = validateEvent({ ...baseValid, inputTokens: -1 });
  assert(!r.ok, 'negative tokens should fail');
}

function testRejectFutureTimestamp() {
  const r = validateEvent({ ...baseValid, timestamp: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
  assert(!r.ok, 'far-future timestamp should fail');
}

function testRejectAncientTimestamp() {
  const r = validateEvent({ ...baseValid, timestamp: '2020-01-01T00:00:00Z' });
  assert(!r.ok, 'far-past timestamp should fail');
}

function testAcceptOptionalFields() {
  const r = validateEvent({
    ...baseValid,
    cacheReadTokens: 200,
    cacheWriteTokens: 0,
    tag: 'feature/onboarding',
    sdkVersion: '0.1.0',
  });
  assert(r.ok, 'optional fields should pass');
  if (r.ok) {
    assert(r.event.tag === 'feature/onboarding', 'tag preserved');
    assert(r.event.cacheReadTokens === 200, 'cacheReadTokens preserved');
  }
}

testHappyPath();
testRejectBadProvider();
testRejectNegativeTokens();
testRejectFutureTimestamp();
testRejectAncientTimestamp();
testAcceptOptionalFields();
console.log('✓ all API validator tests passed');

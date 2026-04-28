import { wrapAnthropic } from './anthropic';
import { wrapOpenAI } from './openai';
import { MemoryTransport } from './transport';
import { computeCost, findPrice, ANTHROPIC_PRICING } from './pricing';

// Minimal test harness — no jest required. Run with `node --test` via tsx,
// or replace with your runner of choice. Keeping zero-dep for v0.1.

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function testAnthropicWrap() {
  const transport = new MemoryTransport();
  const fakeClient = {
    messages: {
      create: async () => ({
        model: 'claude-sonnet-4-6',
        usage: { input_tokens: 1000, output_tokens: 500 },
      }),
    },
  };
  const wrapped = wrapAnthropic(fakeClient, { projectId: 'test', transport });
  await wrapped.messages.create({});
  assert(transport.events.length === 1, 'one event recorded');
  const ev = transport.events[0];
  assert(ev.provider === 'anthropic', 'provider tagged');
  assert(ev.inputTokens === 1000, 'input tokens captured');
  assert(ev.outputTokens === 500, 'output tokens captured');
  // sonnet-4-6: 1000 * $3/1M + 500 * $15/1M = 0.003 + 0.0075 = 0.0105
  assert(Math.abs(ev.cost - 0.0105) < 1e-9, `cost computed correctly, got ${ev.cost}`);
}

async function testOpenAIWrap() {
  const transport = new MemoryTransport();
  const fakeClient = {
    chat: {
      completions: {
        create: async () => ({
          model: 'gpt-4o',
          usage: { prompt_tokens: 2000, completion_tokens: 1000 },
        }),
      },
    },
  };
  const wrapped = wrapOpenAI(fakeClient, { projectId: 'test', transport });
  await wrapped.chat.completions.create({});
  assert(transport.events.length === 1, 'one event recorded');
  const ev = transport.events[0];
  assert(ev.provider === 'openai', 'provider tagged');
  // gpt-4o: 2000 * $2.5/1M + 1000 * $10/1M = 0.005 + 0.01 = 0.015
  assert(Math.abs(ev.cost - 0.015) < 1e-9, `cost computed correctly, got ${ev.cost}`);
}

function testPricingFallback() {
  const price = findPrice(ANTHROPIC_PRICING, 'claude-sonnet-4-6-20260101');
  assert(price !== undefined, 'prefix match works for dated model');
  const cost = computeCost(price, { inputTokens: 1_000_000, outputTokens: 0 });
  assert(cost === 3, `1M input tokens of sonnet = $3, got ${cost}`);
}

(async () => {
  await testAnthropicWrap();
  await testOpenAIWrap();
  testPricingFallback();
  console.log('✓ all SDK tests passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

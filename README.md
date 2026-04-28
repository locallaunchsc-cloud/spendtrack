# SpendTrack

**Observability for AI spend.** Track LLM API costs, token usage, and model performance across your projects in real time.

> ⚠️ **Pre-launch.** Landing page and dashboard UI are live. SDK and ingestion API are in active development. Star the repo to follow along.

---

## Why

Most teams shipping AI features have no idea what they're spending until the invoice hits.

One prompt change. 3x token usage. Nobody notices for 18 days.

Datadog wasn't built for $0.003-per-call economics. SpendTrack is.

## What you get

- **Live spend tracking** — per model, per project, per feature
- **Token-level attribution** — know exactly which call burned the budget
- **Budget alerts** — get pinged before you blow the month, not after
- **Anomaly detection** — catch prompt regressions that 4x token usage overnight
- **Multi-provider** — Anthropic, OpenAI, Bedrock, and more

## How it works

The SDK wraps your LLM client locally. It reads response objects (which already include token counts) and ships only **counts + cost metadata** to SpendTrack.

**Your API keys never leave your servers.** We never see prompts, completions, or keys.

```ts
import { SpendTrack } from '@spendtrack/sdk';
import Anthropic from '@anthropic-ai/sdk';

const tracker = new SpendTrack({ projectId: 'my-app' });
const client = tracker.wrap(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }));

const msg = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello' }],
});
// Spend is automatically tracked
```

**What we see:** token counts, model used, calculated cost, timestamp.
**What we never see:** API keys, prompts, completions, user data.

## Status

| Component       | Status                  |
| --------------- | ----------------------- |
| Landing page    | ✅ Live                  |
| Dashboard UI    | ✅ Live (mock data)      |
| SDK (Node/TS)   | 🛠 In progress           |
| Ingestion API   | 🛠 In progress           |
| Auth & billing  | ⏳ Planned               |
| Python SDK      | ⏳ Planned               |

## Stack

React + TypeScript + Vite · Framer Motion · @react-three/fiber · npm workspaces monorepo

## Run locally

```bash
npm install
npm run dev:dashboard
```

## Roadmap

- [ ] Node SDK v0.1 (Anthropic wrapper)
- [ ] OpenAI wrapper
- [ ] Bedrock wrapper
- [ ] Ingestion API
- [ ] Real-time dashboard wiring
- [ ] Auth (magic link)
- [ ] Stripe billing
- [ ] Python SDK
- [ ] Self-hosted backend option
- [ ] Slack/Discord alerts

## Contributing

Issues and PRs welcome. This is built in the open — review the SDK code before installing. No closed-source magic.

## Early access

Pre-launch. If you're spending serious money on LLM APIs and want in early, open an issue.

## License

MIT — see [LICENSE](./LICENSE)

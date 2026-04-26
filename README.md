# SpendTrack

Open source AI spending tracker. Zero API keys. Maximum trust.

## What it does

Wraps your AI API calls (Claude, OpenAI, Bedrock) and tracks spending automatically. No keys stored, no request bodies logged, just metrics.

## Getting started

### SDK

```ts
import { SpendTrack } from '@spendtrack/sdk';
import Anthropic from '@anthropic-ai/sdk';

const tracker = new SpendTrack({ projectId: 'my-app' });
const client = tracker.wrap(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }));

// Use normally
const msg = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello' }],
});
// Spending is automatically tracked
```

### Dashboard

Visit [spendtrack.dev](https://spendtrack.dev) and paste your project ID to see your metrics.

## How it works

1. SDK wraps API calls
2. Extracts: model, tokens, cost
3. Sends to backend (non-blocking, metrics-only)
4. You see it in the dashboard

**What we never see:**
- API keys
- Request/response content
- User data
- Anything sensitive

**What we see:**
- Token counts
- Model used
- Calculated cost
- Timestamp

## Open source

All code is public. Review the SDK code before installing. No closed-source magic.

## Roadmap

- [ ] OpenAI wrapper
- [ ] Bedrock wrapper  
- [ ] Dashboard UI
- [ ] Team spend visibility
- [ ] Cost optimization recommendations
- [ ] Self-hosted backend option

## Contributing

Issues and PRs welcome.

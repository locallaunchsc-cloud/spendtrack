import { Router, type Request, type Response } from 'express';
import { pool, generateApiKey } from './db';
import { requireApiKey, requireAdmin, type AuthedRequest } from './auth';
import { validateEvent } from './validate';
import { rateLimit } from './rateLimit';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'spendtrack-api', version: '0.1.0' });
});

// ── Ingest (project API key) ───────────────────────────────────────────────

/**
 * POST /v1/events
 * Body: UsageEvent (see SDK).
 * Auth: Bearer sk_... (project API key)
 */
router.post('/v1/events', requireApiKey, rateLimit(), async (req: AuthedRequest, res: Response) => {
  const result = validateEvent(req.body);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  const e = result.event;
  try {
    await pool.query(
      `INSERT INTO usage_events
        (project_id, provider, model, input_tokens, output_tokens,
         cache_read_tokens, cache_write_tokens, cost, tag, sdk_version, occurred_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        req.project!.projectId,
        e.provider,
        e.model,
        e.inputTokens,
        e.outputTokens,
        e.cacheReadTokens,
        e.cacheWriteTokens,
        e.cost,
        e.tag,
        e.sdkVersion,
        e.occurredAt,
      ],
    );
    res.status(202).json({ accepted: true });
  } catch (err) {
    console.error('Event insert failed:', err);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

// ── Read endpoints (project API key) ───────────────────────────────────────

router.get('/v1/projects/:projectId/metrics', requireApiKey, async (req: AuthedRequest, res: Response) => {
  if (req.params.projectId !== req.project!.projectId) {
    res.status(403).json({ error: 'API key does not match project' });
    return;
  }
  try {
    const summary = await pool.query(
      `SELECT
         COALESCE(SUM(cost), 0) AS total_cost,
         COALESCE(SUM(input_tokens + output_tokens), 0) AS total_tokens,
         COUNT(*) AS request_count
       FROM usage_events
       WHERE project_id = $1 AND occurred_at > NOW() - INTERVAL '30 days'`,
      [req.params.projectId],
    );
    const byModel = await pool.query(
      `SELECT model, SUM(cost) AS cost
       FROM usage_events
       WHERE project_id = $1 AND occurred_at > NOW() - INTERVAL '30 days'
       GROUP BY model`,
      [req.params.projectId],
    );
    const costByModel: Record<string, number> = {};
    for (const r of byModel.rows) costByModel[r.model] = parseFloat(r.cost);
    res.json({
      projectId: req.params.projectId,
      totalCost: parseFloat(summary.rows[0].total_cost),
      totalTokens: parseInt(summary.rows[0].total_tokens, 10),
      requestCount: parseInt(summary.rows[0].request_count, 10),
      costByModel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/v1/projects/:projectId/timeline', requireApiKey, async (req: AuthedRequest, res: Response) => {
  if (req.params.projectId !== req.project!.projectId) {
    res.status(403).json({ error: 'API key does not match project' });
    return;
  }
  try {
    const result = await pool.query(
      `SELECT DATE_TRUNC('day', occurred_at) AS date, SUM(cost) AS cost
       FROM usage_events
       WHERE project_id = $1 AND occurred_at > NOW() - INTERVAL '30 days'
       GROUP BY 1
       ORDER BY 1 ASC`,
      [req.params.projectId],
    );
    res.json(result.rows.map((r) => ({ date: r.date, cost: parseFloat(r.cost) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// ── Admin (bootstrap) ──────────────────────────────────────────────────────

/**
 * POST /v1/admin/projects
 * Body: { projectId: string, name?: string }
 * Auth: Bearer <SPENDTRACK_ADMIN_SECRET>
 *
 * Returns the API key in plaintext exactly once. Store it.
 * This endpoint exists so paying users can self-serve a key during onboarding;
 * replace with a proper signup flow once accounts ship.
 */
router.post('/v1/admin/projects', requireAdmin, async (req: Request, res: Response) => {
  const { projectId, name } = req.body ?? {};
  if (typeof projectId !== 'string' || !/^[a-z0-9-]{3,64}$/i.test(projectId)) {
    res.status(400).json({ error: 'projectId must match [a-z0-9-]{3,64}' });
    return;
  }
  const { key, hash, prefix } = generateApiKey();
  try {
    await pool.query(
      `INSERT INTO projects (project_id, name, api_key_hash, api_key_prefix)
       VALUES ($1, $2, $3, $4)`,
      [projectId, name ?? null, hash, prefix],
    );
    res.status(201).json({ projectId, name: name ?? null, apiKey: key, apiKeyPrefix: prefix });
  } catch (err: any) {
    if (err?.code === '23505') {
      res.status(409).json({ error: 'projectId already exists' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;

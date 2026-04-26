import { Router, Request, Response } from 'express';
import { pool } from './db';

const router = Router();

// POST /metrics - Log a usage event
router.post('/metrics', async (req: Request, res: Response) => {
  const { projectId, model, inputTokens, outputTokens, cost } = req.body;

  try {
    // Ensure project exists
    await pool.query(
      'INSERT INTO projects (project_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [projectId]
    );

    // Log the event
    await pool.query(
      `INSERT INTO usage_events (project_id, model, input_tokens, output_tokens, cost)
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, model, inputTokens, outputTokens, cost]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log metrics' });
  }
});

// GET /projects/:projectId/metrics - Get project metrics
router.get('/projects/:projectId/metrics', async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        SUM(cost) as total_cost,
        SUM(input_tokens + output_tokens) as total_tokens,
        COUNT(*) as request_count,
        model,
        SUM(cost) as model_cost
      FROM usage_events
      WHERE project_id = $1 AND timestamp > NOW() - INTERVAL '30 days'
      GROUP BY model`,
      [projectId]
    );

    const summary = await pool.query(
      `SELECT 
        SUM(cost) as total_cost,
        SUM(input_tokens + output_tokens) as total_tokens,
        COUNT(*) as request_count
      FROM usage_events
      WHERE project_id = $1 AND timestamp > NOW() - INTERVAL '30 days'`,
      [projectId]
    );

    const costByModel: Record<string, number> = {};
    result.rows.forEach(row => {
      costByModel[row.model] = parseFloat(row.model_cost);
    });

    res.json({
      projectId,
      totalCost: parseFloat(summary.rows[0]?.total_cost || '0'),
      totalTokens: parseInt(summary.rows[0]?.total_tokens || '0'),
      requestCount: parseInt(summary.rows[0]?.request_count || '0'),
      costByModel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /projects/:projectId/timeline - Get spending timeline
router.get('/projects/:projectId/timeline', async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        DATE_TRUNC('day', timestamp) as date,
        SUM(cost) as cost
      FROM usage_events
      WHERE project_id = $1 AND timestamp > NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', timestamp)
      ORDER BY date ASC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

export default router;

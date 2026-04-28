import type { Request, Response, NextFunction } from 'express';
import { pool, hashApiKey } from './db';

export interface AuthedRequest extends Request {
  project?: {
    projectId: string;
    name: string | null;
  };
}

/**
 * Bearer-token auth. Looks up the project by sha256(API key) and attaches it to the request.
 * Constant-time-ish: we always do the lookup so a missing key and a wrong key take similar time.
 */
export async function requireApiKey(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;

  if (!token || !token.startsWith('sk_')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header. Use: Authorization: Bearer sk_...' });
    return;
  }

  try {
    const { rows } = await pool.query(
      'SELECT project_id, name FROM projects WHERE api_key_hash = $1 LIMIT 1',
      [hashApiKey(token)],
    );
    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }
    req.project = { projectId: rows[0].project_id, name: rows[0].name };
    next();
  } catch (err) {
    console.error('Auth lookup failed:', err);
    res.status(500).json({ error: 'Auth check failed' });
  }
}

/**
 * Bootstrap admin auth — for project creation. A single shared secret env var.
 * Pre-launch this is fine; replace with real user accounts later.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.SPENDTRACK_ADMIN_SECRET;
  if (!expected) {
    res.status(503).json({ error: 'Admin endpoint disabled. Set SPENDTRACK_ADMIN_SECRET to enable.' });
    return;
  }
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  if (!token || token !== expected) {
    res.status(401).json({ error: 'Admin authentication required' });
    return;
  }
  next();
}

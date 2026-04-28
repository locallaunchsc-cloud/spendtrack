import { Pool } from 'pg';
import crypto from 'crypto';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/spendtrack',
  // Cap connections so a Railway free-tier Postgres doesn't get hammered.
  max: 10,
});

/**
 * Initialize schema. Idempotent — safe to run on every boot.
 * For real migrations later, swap this for node-pg-migrate.
 */
export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        api_key_hash VARCHAR(128) NOT NULL,
        api_key_prefix VARCHAR(16) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_events (
        id BIGSERIAL PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        provider VARCHAR(32) NOT NULL,
        model VARCHAR(128) NOT NULL,
        input_tokens INTEGER NOT NULL,
        output_tokens INTEGER NOT NULL,
        cache_read_tokens INTEGER,
        cache_write_tokens INTEGER,
        cost NUMERIC(12, 6) NOT NULL,
        tag VARCHAR(128),
        sdk_version VARCHAR(32),
        occurred_at TIMESTAMPTZ NOT NULL,
        received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_project_time ON usage_events(project_id, occurred_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_project_model ON usage_events(project_id, model);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_api_key_hash ON projects(api_key_hash);`);

    console.log('✓ Database initialized');
  } finally {
    client.release();
  }
}

/** Generate a new API key. Returns the plaintext key (show once) and its hash for storage. */
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = crypto.randomBytes(32).toString('base64url');
  const key = `sk_${raw}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const prefix = key.slice(0, 11); // sk_xxxxxxxx for display
  return { key, hash, prefix };
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

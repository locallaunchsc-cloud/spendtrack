import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/spendtrack',
});

export async function initDb() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_events (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL REFERENCES projects(project_id),
        model VARCHAR(255) NOT NULL,
        input_tokens INTEGER NOT NULL,
        output_tokens INTEGER NOT NULL,
        cost DECIMAL(10, 4) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_project_id ON usage_events(project_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON usage_events(timestamp);
    `);

    console.log('✓ Database initialized');
  } finally {
    client.release();
  }
}

import express from 'express';
import { initDb, pool } from './db';
import routes from './routes';

const app = express();

// Body limit prevents pathological payloads.
app.use(express.json({ limit: '32kb' }));

// CORS — locked down to the dashboard origin, with sensible default for local dev.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,https://spendtrack.dev')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use('/', routes);

// 404 catch-all
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await initDb();
    const server = app.listen(PORT, () => {
      console.log(`SpendTrack API listening on :${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received — shutting down`);
      server.close(() => console.log('HTTP server closed'));
      await pool.end();
      process.exit(0);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Only start when executed directly (not under tests).
if (require.main === module) {
  start();
}

export { app };

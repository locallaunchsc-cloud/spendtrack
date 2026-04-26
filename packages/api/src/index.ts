import express from 'express';
import { initDb } from './db';
import routes from './routes';

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/', routes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`SpendTrack API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

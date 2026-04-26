import express from 'express';

const app = express();
app.use(express.json());

// TODO: Wire up to database
// TODO: Create metrics endpoint

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SpendTrack API running on port ${PORT}`);
});

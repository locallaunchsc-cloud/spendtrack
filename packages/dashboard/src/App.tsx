import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import BackgroundScene from './components/BackgroundScene';
import Landing from './pages/Landing';

interface Metrics {
  projectId: string;
  totalCost: number;
  requestCount: number;
  totalTokens: number;
  costByModel: Record<string, number>;
}

const mockData: Metrics = {
  projectId: 'my-app',
  totalCost: 1247.53,
  requestCount: 342,
  totalTokens: 2847361,
  costByModel: {
    'claude-opus-4-7': 523.12,
    'claude-sonnet-4-6': 342.15,
    'gpt-4o': 256.78,
    'claude-haiku-4-5-20251001': 125.48,
  },
};

const MetricCard = ({ label, value, unit }: { label: string; value: number | string; unit?: string }) => (
  <motion.div
    className="metric-card"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="metric-label">{label}</div>
    <div className="metric-value">
      {typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : value}
      {unit && <span className="metric-unit">{unit}</span>}
    </div>
  </motion.div>
);

function App() {
  const [metrics, setMetrics] = useState<Metrics>(mockData);
  const [projectId] = useState(new URLSearchParams(window.location.search).get('project') || 'my-app');
  const [page, setPage] = useState(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');

  useEffect(() => {
    const handleRouteChange = () => {
      setPage(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metrics`);
        if (res.ok) {
          setMetrics(await res.json());
        }
      } catch {
        // Use mock data
      }
    };

    if (page === 'dashboard') {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [projectId, page]);

  if (page === 'landing') {
    return <Landing />;
  }

  const sortedModels = Object.entries(metrics.costByModel).sort((a, b) => b[1] - a[1]);
  const totalByModel = sortedModels.reduce((sum, [_, cost]) => sum + cost, 0);

  return (
    <div id="root">
      <div className="background">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <BackgroundScene />
        </Canvas>
      </div>

      <div className="content-wrapper">
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>SpendTrack</h1>
          <p>Project: {projectId}</p>
        </motion.header>

        <div className="main">
          <div className="metrics-grid">
            <MetricCard label="Total Spend" value={metrics.totalCost} unit="$" />
            <MetricCard label="API Calls" value={metrics.requestCount} />
            <MetricCard label="Tokens Used" value={metrics.totalTokens} />
            <MetricCard label="Active Models" value={Object.keys(metrics.costByModel).length} />
          </div>

          <div className="table-section">
            <div className="table-header">
              <h2>Spending by Model</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th style={{ textAlign: 'right' }}>Cost</th>
                  <th style={{ textAlign: 'right' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map(([model, cost]) => (
                  <tr key={model}>
                    <td className="model-name">{model}</td>
                    <td className="cost" style={{ textAlign: 'right' }}>
                      ${cost.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="percentage">{((cost / totalByModel) * 100).toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import AdvancedSpendingChart from './components/AdvancedSpendingChart';
import ParticleField from './components/ParticleField';
import AnimatedMetrics from './components/AnimatedMetrics';
import TimelineChart from './components/TimelineChart';

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

export default function App() {
  const [metrics, setMetrics] = useState<Metrics>(mockData);
  const [projectId] = useState(new URLSearchParams(window.location.search).get('project') || 'my-app');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/metrics`);
        if (res.ok) {
          setMetrics(await res.json());
        }
      } catch (err) {
        console.log('Using mock data (API not available)');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.header
        className="header"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1>✨ SpendTrack</h1>
        <p>Project: <strong>{projectId}</strong>{loading && ' (syncing...)'}</p>
      </motion.header>

      <div className="content">
        <motion.div
          className="card"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>💰 Spending by Model</h2>
          <div className="chart-container">
            <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
              <AdvancedSpendingChart data={metrics.costByModel} />
            </Canvas>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>📊 This Month</h2>
          <AnimatedMetrics metrics={metrics} />
        </motion.div>

        <motion.div
          className="card"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ gridColumn: '1 / -1' }}
        >
          <h2>📈 Spending Timeline</h2>
          <div style={{ height: '300px' }}>
            <Canvas camera={{ position: [0, 0, 12] }}>
              <TimelineChart />
            </Canvas>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ gridColumn: '1 / -1', height: '200px' }}
        >
          <h2>🌌 Ambient Field</h2>
          <Canvas camera={{ position: [0, 0, 15] }}>
            <ParticleField />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
          </Canvas>
        </motion.div>
      </div>
    </motion.div>
  );
}

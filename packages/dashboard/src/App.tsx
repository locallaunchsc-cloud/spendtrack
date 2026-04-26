import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import SpendingChart from './components/SpendingChart';
import AnimatedMetrics from './components/AnimatedMetrics';
import TimelineChart from './components/TimelineChart';

interface Metrics {
  totalCost: number;
  requestCount: number;
  totalTokens: number;
  costByModel: Record<string, number>;
}

const mockData: Metrics = {
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
  const [projectId] = useState('my-app');

  useEffect(() => {
    // TODO: Fetch real metrics from API
    // const fetchMetrics = async () => {
    //   const res = await fetch(`/api/projects/${projectId}/metrics`);
    //   setMetrics(await res.json());
    // };
    // fetchMetrics();
  }, [projectId]);

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.header
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1>SpendTrack</h1>
        <p>Project: {projectId}</p>
      </motion.header>

      <div className="content">
        <motion.div
          className="card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Spending by Model</h2>
          <div className="chart-container">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <SpendingChart data={metrics.costByModel} />
            </Canvas>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>This Month</h2>
          <AnimatedMetrics metrics={metrics} />
        </motion.div>

        <motion.div
          className="card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ gridColumn: '1 / -1' }}
        >
          <h2>Spending Timeline</h2>
          <div style={{ height: '300px' }}>
            <Canvas camera={{ position: [0, 0, 10] }}>
              <TimelineChart />
            </Canvas>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

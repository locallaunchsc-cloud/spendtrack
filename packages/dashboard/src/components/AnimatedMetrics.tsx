import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MetricsProps {
  metrics: {
    totalCost: number;
    requestCount: number;
    totalTokens: number;
    costByModel: Record<string, number>;
  };
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let current = 0;
    const increment = value / 60;

    const animate = () => {
      current += increment;
      if (current < value) {
        setDisplayValue(Math.floor(current));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default function AnimatedMetrics({ metrics }: MetricsProps) {
  const metricsList = [
    { label: 'Total Spend', value: metrics.totalCost.toFixed(2), unit: '$' },
    { label: 'API Calls', value: metrics.requestCount, unit: '' },
    { label: 'Tokens Used', value: metrics.totalTokens, unit: '' },
    { label: 'Models', value: Object.keys(metrics.costByModel).length, unit: '' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {metricsList.map((item, i) => (
        <motion.div
          key={item.label}
          className="metric"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <span className="metric-label">{item.label}</span>
          <span className="metric-value">
            {item.unit}
            <AnimatedNumber value={parseFloat(item.value as any)} />
          </span>
        </motion.div>
      ))}
    </div>
  );
}

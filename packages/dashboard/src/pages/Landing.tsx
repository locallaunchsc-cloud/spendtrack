import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import BackgroundScene from '../components/BackgroundScene';
import Navbar from '../components/Navbar';
import '../styles/landing.css';

export default function Landing() {
  const features = [
    {
      icon: '🔐',
      title: 'Zero Keys Stored',
      description: 'We never see your API keys. Only metrics are logged.',
    },
    {
      icon: '📊',
      title: 'Real-Time Tracking',
      description: 'Monitor spending across all your AI models instantly.',
    },
    {
      icon: '🔗',
      title: 'API Native',
      description: 'Lightweight SDK wrapper. One line of code to add.',
    },
    {
      icon: '💰',
      title: 'Cost Visibility',
      description: 'See exactly where your AI budget is going.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="landing">
      <Navbar page="landing" />
      <div className="landing-background">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <BackgroundScene />
        </Canvas>
      </div>

      <div className="landing-content">
        <motion.header
          className="landing-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>SpendTrack</h1>
          <p className="subtitle">
            Stop burning money on AI. See exactly what every agent costs.
          </p>
        </motion.header>

        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-content">
            <h2>Your AI stack is costing you.</h2>
            <p>
              5 AI agents. 3 different APIs. No visibility. Your Claude agent costs $500/mo, GPT-4 costs $800/mo,
              Bedrock costs $1200/mo. But you don't know which one is burning cash or why. Token counts are scattered
              across 5 different dashboards. Budget visibility = zero.
            </p>

            <h2 style={{ marginTop: '2rem' }}>One line of code. Full visibility.</h2>
            <p>
              Wrap your API client with SpendTrack. That's it. Real-time metrics. One dashboard. See spending by model,
              by project, by agent. Optimize ruthlessly. We never see your keys—only metrics. Open source. Fully transparent.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>How it works</h2>
          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card"
                variants={itemVariants}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="getting-started"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>Get started in 2 minutes</h2>
          <div className="steps-grid">
            <motion.div className="step" variants={itemVariants}>
              <div className="step-number">1</div>
              <h3>Install SDK</h3>
              <p><code>npm install @spendtrack/sdk</code></p>
            </motion.div>
            <motion.div className="step" variants={itemVariants}>
              <div className="step-number">2</div>
              <h3>Wrap Your Client</h3>
              <p><code>tracker.wrap(client)</code></p>
            </motion.div>
            <motion.div className="step" variants={itemVariants}>
              <div className="step-number">3</div>
              <h3>View Dashboard</h3>
              <p>Real-time spending metrics</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="cta-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Stop guessing. Start tracking.</h2>
          <p className="cta-subtitle">
            Open source, fully transparent. Zero API keys stored.
          </p>
          <motion.button
            onClick={() => {
              window.history.pushState(null, '', '/dashboard');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            View Dashboard
          </motion.button>
        </motion.section>

        <motion.footer
          className="landing-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="footer-content">
            <div>
              <h4>SpendTrack</h4>
              <p>Open source AI spending tracker</p>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="https://github.com/locallaunchsc-cloud/spendtrack" target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a href="https://github.com/locallaunchsc-cloud/spendtrack#readme" target="_blank" rel="noreferrer">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4>Status</h4>
              <p>Open source • Always free • Zero tracking</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SpendTrack. MIT License.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import HeroScene from '../components/HeroScene';
import Navbar from '../components/Navbar';
import CodePreview from '../components/CodePreview';
import AnimatedCounter from '../components/AnimatedCounter';
import '../styles/landing.css';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navigateToDashboard = () => {
    window.history.pushState(null, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const features = [
    {
      title: 'Zero Trust Architecture',
      description: 'Your API keys never leave your servers. The SDK extracts only token counts and costs—nothing else.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Real-Time Telemetry',
      description: 'Every API call streams to your dashboard in milliseconds. See spending patterns as they emerge.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Multi-Provider',
      description: 'Anthropic, OpenAI, Bedrock, Vertex AI. One SDK. Unified metrics across every model you run.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Open Source Core',
      description: 'MIT licensed. Audit every line. Self-host the entire stack. No black boxes, ever.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      title: 'Project Attribution',
      description: 'Tag requests by project, agent, or feature. Find which workflows are hemorrhaging tokens.',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'Cost Anomaly Detection',
      description: 'ML-powered alerts when spend deviates from baseline. Catch runaway agents before they bankrupt you.',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  const pricing = [
    {
      name: 'Hacker',
      price: '$0',
      period: 'forever',
      description: 'For solo builders shipping side projects.',
      features: ['Up to 100K events/mo', '1 project', 'Community support', 'Basic dashboard', '7-day data retention'],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Founder',
      price: '$29',
      period: 'per month',
      description: 'For startups going to production.',
      features: ['Unlimited events', '10 projects', 'Email support', 'Advanced analytics', '90-day retention', 'Cost alerts', 'Team seats (3)'],
      cta: 'Start 14-day Trial',
      highlighted: true,
    },
    {
      name: 'Scale',
      price: '$199',
      period: 'per month',
      description: 'For teams burning real money on AI.',
      features: ['Unlimited events', 'Unlimited projects', 'Priority support', 'Custom dashboards', 'Unlimited retention', 'SLA guarantee', 'SSO + audit logs', 'Dedicated CSM'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const testimonials = [
    {
      quote: 'We were spending $40K/month on Claude and didn\'t know where it was going. SpendTrack cut our bill in half within a week.',
      author: 'Maya Chen',
      role: 'CTO at Drafthouse AI',
    },
    {
      quote: 'Finally, a dashboard that tells me which agent is bleeding cash. The SDK was a 2-line install.',
      author: 'Jaden Park',
      role: 'Founder at Glyph Labs',
    },
    {
      quote: 'Our finance team stopped asking why our OpenAI bill keeps growing. Now they have answers.',
      author: 'Marcus Vasquez',
      role: 'VP Engineering at Northwind',
    },
  ];

  const faqs = [
    {
      q: 'How does SpendTrack get cost data without my API key?',
      a: 'The SDK wraps your client locally. It reads response objects (which include token counts) and calculates cost using public pricing tables. Your API key never crosses our network.',
    },
    {
      q: 'What happens if your service goes down?',
      a: 'Nothing breaks. The SDK fails silently if it can\'t reach our API. Your application calls continue uninterrupted. We just stop collecting metrics until we\'re back.',
    },
    {
      q: 'Can I self-host SpendTrack?',
      a: 'Yes. The entire stack (SDK, API, dashboard, database) is open source under MIT. Deploy it on your own infrastructure—Kubernetes, Docker Compose, or bare metal.',
    },
    {
      q: 'Which AI providers do you support?',
      a: 'Anthropic, OpenAI, AWS Bedrock, Google Vertex AI, and Together AI out of the box. Adding a new provider is roughly 50 lines of code.',
    },
    {
      q: 'Do you log my prompts or completions?',
      a: 'No. Never. We capture model name, input tokens, output tokens, timestamp, and project ID. Zero content. Zero PII.',
    },
  ];

  return (
    <div className="landing">
      <Navbar page="landing" />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-3d">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <HeroScene />
          </Canvas>
        </div>

        <div className="hero-overlay">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-dot"></span>
            <span>Now tracking $4.2M+ in AI spend</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="word-line">Every token.</span>
            <span className="word-line gradient-text">Every dollar.</span>
            <span className="word-line">Tracked.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            The observability layer for AI agents. Drop in 3 lines of code.
            Watch your spend in real time. Cut your bill in half.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              className="btn-primary"
              onClick={navigateToDashboard}
              whileHover={{ scale: 1.04, boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)' }}
              whileTap={{ scale: 0.96 }}
            >
              Launch Dashboard
              <span className="btn-arrow">→</span>
            </motion.button>
            <motion.a
              className="btn-secondary"
              href="https://github.com/locallaunchsc-cloud/spendtrack"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="github-icon">⌥</span>
              Star on GitHub
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <span className="trust-label">TRUSTED BY TEAMS AT</span>
            <div className="trust-logos">
              <span>DRAFTHOUSE</span>
              <span>·</span>
              <span>GLYPH LABS</span>
              <span>·</span>
              <span>NORTHWIND</span>
              <span>·</span>
              <span>FISHER AI</span>
              <span>·</span>
              <span>STELLAR</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <motion.div
            className="stat-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-number">
              $<AnimatedCounter end={4200000} />
            </div>
            <div className="stat-label">AI spend tracked</div>
          </motion.div>
          <motion.div
            className="stat-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="stat-number">
              <AnimatedCounter end={847} suffix="M" />
            </div>
            <div className="stat-label">Tokens processed</div>
          </motion.div>
          <motion.div
            className="stat-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-number">
              <AnimatedCounter end={47} suffix="%" />
            </div>
            <div className="stat-label">Avg cost reduction</div>
          </motion.div>
          <motion.div
            className="stat-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="stat-number">
              <AnimatedCounter end={2300} suffix="+" />
            </div>
            <div className="stat-label">Active projects</div>
          </motion.div>
        </div>
      </section>

      {/* CODE DEMO */}
      <section className="code-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Integration</span>
          <h2>Three lines. That's the whole integration.</h2>
          <p>No proxies. No agents. No infrastructure changes. Just wrap your client and ship.</p>
        </motion.div>
        <CodePreview />
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Features</span>
          <h2>Built for teams shipping AI in production.</h2>
          <p>Every feature designed around one principle: visibility without compromise.</p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-tile"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="feature-glow" style={{ background: feature.gradient }}></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Loved by builders</span>
          <h2>What teams are saying.</h2>
        </motion.div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.author.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div className="author-name">{t.author}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Pricing</span>
          <h2>Simple pricing. No surprises.</h2>
          <p>Start free. Scale when you have to.</p>
        </motion.div>

        <div className="pricing-grid">
          {pricing.map((tier, i) => (
            <motion.div
              key={i}
              className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {tier.highlighted && <div className="pricing-badge">MOST POPULAR</div>}
              <div className="pricing-name">{tier.name}</div>
              <div className="pricing-price">
                <span className="price-amount">{tier.price}</span>
                <span className="price-period">/ {tier.period}</span>
              </div>
              <p className="pricing-description">{tier.description}</p>
              <ul className="pricing-features">
                {tier.features.map((f, fi) => (
                  <li key={fi}>
                    <span className="check-mark">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={tier.highlighted ? 'btn-primary' : 'btn-tier'}
                onClick={navigateToDashboard}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">FAQ</span>
          <h2>Frequently asked questions.</h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <motion.div
                  className="faq-answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <motion.div
          className="cta-glow"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Stop flying blind.</h2>
          <p>Your AI agents are spending money right now. See where it's going.</p>
          <motion.button
            className="btn-primary btn-large"
            onClick={navigateToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
            <span className="btn-arrow">→</span>
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>SpendTrack</h3>
            <p>The observability layer for AI agents.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <ul>
                <li><a onClick={navigateToDashboard}>Dashboard</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="https://github.com/locallaunchsc-cloud/spendtrack" target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a href="https://github.com/locallaunchsc-cloud/spendtrack#readme" target="_blank" rel="noreferrer">Docs</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SpendTrack · MIT License</span>
          <span>Built with ❤ by builders, for builders</span>
        </div>
      </footer>
    </div>
  );
}

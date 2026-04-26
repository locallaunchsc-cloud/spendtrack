import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

interface Metrics {
  projectId: string;
  totalCost: number;
  requestCount: number;
  totalTokens: number;
  costByModel: Record<string, number>;
}

const mockData: Metrics = {
  projectId: 'production-app',
  totalCost: 12473.58,
  requestCount: 84231,
  totalTokens: 28473612,
  costByModel: {
    'claude-opus-4-7': 5237.12,
    'claude-sonnet-4-6': 3421.50,
    'gpt-4o': 2567.83,
    'claude-haiku-4-5': 854.78,
    'gpt-4-turbo': 392.35,
  },
};

const timelineData = [
  { date: 'Mon', cost: 1247, tokens: 2.4 },
  { date: 'Tue', cost: 1532, tokens: 3.1 },
  { date: 'Wed', cost: 1893, tokens: 3.8 },
  { date: 'Thu', cost: 1421, tokens: 2.9 },
  { date: 'Fri', cost: 2104, tokens: 4.2 },
  { date: 'Sat', cost: 982, tokens: 1.9 },
  { date: 'Sun', cost: 1294, tokens: 2.5 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(Math.random() * 800 + 200),
}));

const recentActivity = [
  { id: 1, model: 'claude-opus-4-7', project: 'agent-research', cost: 12.47, tokens: 8420, time: '2s ago' },
  { id: 2, model: 'gpt-4o', project: 'customer-support', cost: 3.21, tokens: 4192, time: '5s ago' },
  { id: 3, model: 'claude-sonnet-4-6', project: 'content-gen', cost: 1.84, tokens: 6801, time: '12s ago' },
  { id: 4, model: 'claude-opus-4-7', project: 'agent-research', cost: 18.92, tokens: 12480, time: '24s ago' },
  { id: 5, model: 'claude-haiku-4-5', project: 'classifier', cost: 0.42, tokens: 1820, time: '38s ago' },
  { id: 6, model: 'gpt-4-turbo', project: 'sql-agent', cost: 2.18, tokens: 3940, time: '47s ago' },
  { id: 7, model: 'claude-sonnet-4-6', project: 'content-gen', cost: 1.92, tokens: 7120, time: '1m ago' },
  { id: 8, model: 'claude-opus-4-7', project: 'qa-bot', cost: 9.81, tokens: 6240, time: '1m ago' },
];

const COLORS = ['#a78bfa', '#f472b6', '#67e8f9', '#fbbf24', '#34d399'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>(mockData);
  const [projectId] = useState(new URLSearchParams(window.location.search).get('project') || 'production-app');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metrics`);
        if (res.ok) setMetrics(await res.json());
      } catch {}
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  const sortedModels = Object.entries(metrics.costByModel).sort((a, b) => b[1] - a[1]);
  const pieData = sortedModels.map(([name, value]) => ({ name, value }));
  const totalByModel = sortedModels.reduce((sum, [_, c]) => sum + c, 0);

  return (
    <div className={`dashboard-app ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-label">Projects</span>
              <span className="breadcrumb-divider">/</span>
              <span className="breadcrumb-active">{projectId}</span>
              <span className="status-pill live">
                <span className="status-dot"></span>
                Live
              </span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="time-range-tabs">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  className={`time-tab ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="topbar-btn">Export</button>
            <div className="topbar-avatar">JG</div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* HEADER */}
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1>Overview</h1>
              <p>Real-time spending across all your AI workloads.</p>
            </div>
          </motion.div>

          {/* HERO METRICS */}
          <div className="metrics-row">
            {[
              { label: 'Total Spend', value: `$${metrics.totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, change: '+12.4%', up: true, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
              { label: 'API Calls', value: metrics.requestCount.toLocaleString(), change: '+24.7%', up: true, gradient: 'linear-gradient(135deg, #f472b6, #f5576c)' },
              { label: 'Tokens Processed', value: `${(metrics.totalTokens / 1000000).toFixed(1)}M`, change: '+18.2%', up: true, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
              { label: 'Avg Cost / Call', value: `$${(metrics.totalCost / metrics.requestCount).toFixed(3)}`, change: '−4.8%', up: false, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
            ].map((m, i) => (
              <motion.div
                key={i}
                className="metric-tile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="metric-tile-glow" style={{ background: m.gradient }}></div>
                <div className="metric-tile-label">{m.label}</div>
                <div className="metric-tile-value">{m.value}</div>
                <div className={`metric-tile-change ${m.up ? 'up' : 'down'}`}>
                  <span className="change-arrow">{m.up ? '↑' : '↓'}</span>
                  {m.change} <span className="change-label">vs last week</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CHARTS GRID */}
          <div className="charts-grid">
            <motion.div
              className="chart-card chart-large"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="chart-header">
                <div>
                  <h3>Spending Trend</h3>
                  <p className="chart-subtitle">Daily AI cost over the last week</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-dot" style={{ background: '#a78bfa' }}></span>Cost ($)</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: '#0c1023',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fafafa',
                    }}
                    formatter={(v: any) => [`$${v}`, 'Cost']}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#a78bfa" strokeWidth={2.5} fill="url(#costGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="chart-header">
                <div>
                  <h3>Cost by Model</h3>
                  <p className="chart-subtitle">Distribution this week</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0c1023',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fafafa',
                    }}
                    formatter={(v: any) => [`$${v.toFixed(2)}`, 'Cost']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((entry, idx) => (
                  <div key={idx} className="pie-legend-item">
                    <span className="legend-dot" style={{ background: COLORS[idx % COLORS.length] }}></span>
                    <span className="legend-name">{entry.name}</span>
                    <span className="legend-value">${entry.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="chart-header">
                <div>
                  <h3>Request Volume</h3>
                  <p className="chart-subtitle">Hourly distribution today</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" stroke="#71717a" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#0c1023',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fafafa',
                    }}
                    cursor={{ fill: 'rgba(167, 139, 250, 0.1)' }}
                  />
                  <Bar dataKey="requests" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card chart-tall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="chart-header">
                <div>
                  <h3>Live Activity</h3>
                  <p className="chart-subtitle">Real-time API calls streaming in</p>
                </div>
                <span className="live-indicator">
                  <span className="live-pulse"></span>
                  LIVE
                </span>
              </div>
              <div className="activity-feed">
                <AnimatePresence>
                  {recentActivity.map((event) => (
                    <motion.div
                      key={event.id}
                      className="activity-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="activity-icon">
                        <span style={{ background: COLORS[recentActivity.indexOf(event) % COLORS.length] }}></span>
                      </div>
                      <div className="activity-content">
                        <div className="activity-line">
                          <span className="activity-model">{event.model}</span>
                          <span className="activity-cost">${event.cost.toFixed(2)}</span>
                        </div>
                        <div className="activity-meta">
                          <span>{event.project}</span>
                          <span className="activity-divider">·</span>
                          <span>{event.tokens.toLocaleString()} tokens</span>
                          <span className="activity-divider">·</span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* MODEL BREAKDOWN TABLE */}
          <motion.div
            className="table-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="chart-header">
              <div>
                <h3>Model Performance</h3>
                <p className="chart-subtitle">Cost efficiency across models this period</p>
              </div>
            </div>
            <table className="model-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Calls</th>
                  <th>Tokens</th>
                  <th>Cost</th>
                  <th>Avg / Call</th>
                  <th>Share</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map(([model, cost], idx) => {
                  const calls = Math.floor(metrics.requestCount * (cost / totalByModel));
                  const tokens = Math.floor(metrics.totalTokens * (cost / totalByModel));
                  const avg = cost / Math.max(calls, 1);
                  const share = (cost / totalByModel) * 100;
                  return (
                    <motion.tr
                      key={model}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                    >
                      <td>
                        <div className="model-cell">
                          <span className="model-color-dot" style={{ background: COLORS[idx % COLORS.length] }}></span>
                          <span className="model-text">{model}</span>
                        </div>
                      </td>
                      <td>{calls.toLocaleString()}</td>
                      <td>{tokens.toLocaleString()}</td>
                      <td className="cost-strong">${cost.toFixed(2)}</td>
                      <td className="dim">${avg.toFixed(3)}</td>
                      <td>
                        <div className="share-bar-wrapper">
                          <div className="share-bar-track">
                            <motion.div
                              className="share-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${share}%` }}
                              transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                              style={{ background: COLORS[idx % COLORS.length] }}
                            ></motion.div>
                          </div>
                          <span className="share-pct">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button className="row-action">→</button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

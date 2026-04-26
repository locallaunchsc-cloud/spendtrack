import { motion } from 'framer-motion';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigateHome = () => {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navItems = [
    { icon: '◈', label: 'Overview', active: true },
    { icon: '⚡', label: 'Live Stream', active: false },
    { icon: '◐', label: 'Models', active: false },
    { icon: '▤', label: 'Projects', active: false },
    { icon: '◊', label: 'Alerts', active: false },
    { icon: '⊡', label: 'Reports', active: false },
  ];

  const bottomItems = [
    { icon: '⚙', label: 'Settings' },
    { icon: '?', label: 'Help' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="sidebar-logo" onClick={navigateHome}>
          <div className="logo-mark">
            <div className="logo-glyph"></div>
          </div>
          {!collapsed && <span className="logo-text">SpendTrack</span>}
        </button>
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-project-switcher">
          <div className="project-switcher-label">CURRENT PROJECT</div>
          <button className="project-switcher-btn">
            <div className="project-info">
              <div className="project-avatar">P</div>
              <div className="project-details">
                <div className="project-name">production-app</div>
                <div className="project-meta">5 models · 84K calls</div>
              </div>
            </div>
            <span className="switcher-chevron">⌄</span>
          </button>
        </div>
      )}

      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">WORKSPACE</div>}
        {navItems.map((item, i) => (
          <motion.button
            key={i}
            className={`nav-item ${item.active ? 'active' : ''}`}
            whileHover={{ x: collapsed ? 0 : 2 }}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {item.active && !collapsed && <span className="nav-active-marker"></span>}
          </motion.button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && <div className="nav-section-label">ACCOUNT</div>}
        {bottomItems.map((item, i) => (
          <button key={i} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}

        {!collapsed && (
          <div className="usage-card">
            <div className="usage-card-header">
              <span className="usage-card-label">PLAN USAGE</span>
              <span className="usage-card-tier">FOUNDER</span>
            </div>
            <div className="usage-bar">
              <motion.div
                className="usage-fill"
                initial={{ width: 0 }}
                animate={{ width: '64%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              ></motion.div>
            </div>
            <div className="usage-stats">
              <span>64,231 / 100K events</span>
              <span className="usage-pct">64%</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

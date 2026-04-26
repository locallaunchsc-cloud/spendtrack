import { motion } from 'framer-motion';
import '../styles/navbar.css';

interface NavbarProps {
  page: 'landing' | 'dashboard';
  onNavigate?: (page: 'landing' | 'dashboard') => void;
}

export default function Navbar({ page, onNavigate }: NavbarProps) {
  const handleLogoClick = () => {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleDashboardClick = () => {
    window.history.pushState(null, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <motion.button
          className="navbar-logo"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SpendTrack
        </motion.button>

        <div className="navbar-links">
          {page === 'dashboard' && (
            <motion.button
              className="navbar-link back-link"
              onClick={handleLogoClick}
              whileHover={{ color: '#667eea' }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
          )}
          {page === 'landing' && (
            <motion.button
              className="navbar-link dashboard-link"
              onClick={handleDashboardClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
          )}
          <motion.a
            className="navbar-link"
            href="https://github.com/locallaunchsc-cloud/spendtrack"
            target="_blank"
            rel="noreferrer"
            whileHover={{ color: '#667eea' }}
          >
            GitHub
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

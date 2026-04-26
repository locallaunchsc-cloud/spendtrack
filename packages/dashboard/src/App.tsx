import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  const [page, setPage] = useState(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');

  useEffect(() => {
    const handleRouteChange = () => {
      setPage(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return page === 'dashboard' ? <Dashboard /> : <Landing />;
}

export default App;

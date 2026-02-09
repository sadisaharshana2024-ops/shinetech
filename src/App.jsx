import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './security/auth';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Shop from './pages/Shop';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';

import { CartProvider } from './context/CartContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Loader from './components/Loader';
import { AnimatePresence } from 'framer-motion';

function App() {
  const { loading: dataLoading } = useInventory();
  const [animationLoading, setAnimationLoading] = React.useState(true);

  // The site is only ready when BOTH the animation completes AND the cloud data is synced
  const isSplashVisible = animationLoading || dataLoading;

  return (
    <AnimatePresence mode="wait">
      {isSplashVisible ? (
        <Loader
          key="loader"
          ready={!dataLoading}
          onFinished={() => setAnimationLoading(false)}
        />
      ) : (
        <Router key="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Shop />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Shop />} />
          </Routes>
        </Router>
      )}
    </AnimatePresence>
  );
}

export default App;

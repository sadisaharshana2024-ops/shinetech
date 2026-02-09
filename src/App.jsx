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
  const [currentView, setCurrentView] = React.useState('home');
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <Router>
      <Navbar
        onViewChange={setCurrentView}
        currentView={currentView}
        onCartToggle={() => setIsCartOpen(true)}
      />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Shop currentView={currentView} setCurrentView={setCurrentView} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Shop currentView={currentView} setCurrentView={setCurrentView} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

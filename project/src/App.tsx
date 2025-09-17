/**
 * Main Application Component
 * DAA-Based Smart Warehouse Management System
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Search from './components/Search';
import SpaceOptimization from './components/SpaceOptimization';
import RouteOptimization from './components/RouteOptimization';
import Reports from './components/Reports';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'search':
        return <Search />;
      case 'optimization':
        return <SpaceOptimization />;
      case 'routing':
        return <RouteOptimization />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;
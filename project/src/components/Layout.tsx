/**
 * Main Layout Component
 * Navigation and routing structure
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  MapPin, 
  Route, 
  FileText,
  Menu,
  X,
  Warehouse
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'optimization', name: 'Space Optimization', icon: MapPin },
    { id: 'routing', name: 'Route Planning', icon: Route },
    { id: 'reports', name: 'Reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
          <Warehouse size={32} className="mr-3" />
          <h1 className="text-lg font-bold">Smart WMS</h1>
        </div>
        
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 text-xs text-gray-500 border-t">
          <p className="font-semibold">DAA Project</p>
          <p>Algorithms Implementation</p>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
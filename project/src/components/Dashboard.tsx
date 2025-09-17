/**
 * Dashboard Component
 * Main overview with statistics and recent activity
 */

import React from 'react';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  BarChart3,
  Clock,
  TrendingUp,
  Activity,
  Search
} from 'lucide-react';
import { useWarehouseData } from '../hooks/useWarehouseData';

const Dashboard: React.FC = () => {
  const { getDashboardStats, loading } = useWarehouseData();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getDashboardStats();

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: stats.lowStockItems > 0 ? 'Needs attention' : 'All good'
    },
    {
      title: 'Space Utilization',
      value: `${stats.spaceUtilization.toFixed(1)}%`,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: stats.spaceUtilization > 80 ? 'High' : 'Optimal'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your Smart Warehouse Management System</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-gray-600">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Algorithm Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Sorting Algorithm</p>
                <p className="text-sm text-blue-600">Merge Sort - O(n log n)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900">Last Run</p>
                <p className="text-xs text-blue-600">0.45ms</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Search Algorithm</p>
                <p className="text-sm text-green-600">Hash Map - O(1)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-900">Last Run</p>
                <p className="text-xs text-green-600">0.12ms</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Path Optimization</p>
                <p className="text-sm text-purple-600">Dijkstra - O(V log V)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-900">Last Run</p>
                <p className="text-xs text-purple-600">1.23ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity size={20} className="mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.type === 'add' ? 'bg-green-100 text-green-600' :
                    activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'delete' ? 'bg-red-100 text-red-600' :
                    activity.type === 'search' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Package size={24} className="text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Add New Item</h3>
            <p className="text-sm text-gray-600">Add inventory to the warehouse</p>
          </button>
          
          <button className="p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <Search size={24} className="text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Search Items</h3>
            <p className="text-sm text-gray-600">Find items using algorithms</p>
          </button>
          
          <button className="p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <BarChart3 size={24} className="text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Generate Report</h3>
            <p className="text-sm text-gray-600">View analytics and insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
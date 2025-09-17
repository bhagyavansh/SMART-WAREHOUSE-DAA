/**
 * Reports Component
 * Analytics and reporting with data visualization
 */

import React, { useState, useMemo } from 'react';
import { FileText, Download, TrendingUp, AlertTriangle, Package, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useWarehouseData } from '../hooks/useWarehouseData';

const Reports: React.FC = () => {
  const { inventory, warehouseSpaces, getDashboardStats, loading } = useWarehouseData();
  const [selectedReport, setSelectedReport] = useState<'overview' | 'lowStock' | 'spaceUtilization' | 'itemAging'>('overview');

  const stats = getDashboardStats();

  // Calculate report data
  const reportData = useMemo(() => {
    // Category distribution
    const categoryData = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData).map(([category, quantity]) => ({
      category,
      quantity,
      value: inventory
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.value, 0)
    }));

    // Low stock items
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

    // Space utilization by aisle
    const spaceByAisle = warehouseSpaces.reduce((acc, space) => {
      if (!acc[space.aisle]) {
        acc[space.aisle] = { capacity: 0, occupied: 0, available: 0 };
      }
      acc[space.aisle].capacity += space.capacity;
      acc[space.aisle].occupied += space.occupied;
      acc[space.aisle].available += space.available;
      return acc;
    }, {} as Record<string, { capacity: number; occupied: number; available: number }>);

    const spaceChartData = Object.entries(spaceByAisle).map(([aisle, data]) => ({
      aisle,
      utilization: (data.occupied / data.capacity) * 100,
      capacity: data.capacity,
      occupied: data.occupied,
      available: data.available
    }));

    // Item aging analysis
    const now = new Date();
    const agingData = inventory.map(item => {
      const itemDate = new Date(item.dateAdded);
      const ageInDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      return { ...item, ageInDays };
    });

    const agingBuckets = {
      'New (0-7 days)': agingData.filter(item => item.ageInDays <= 7).length,
      'Recent (8-30 days)': agingData.filter(item => item.ageInDays > 7 && item.ageInDays <= 30).length,
      'Moderate (31-90 days)': agingData.filter(item => item.ageInDays > 30 && item.ageInDays <= 90).length,
      'Old (90+ days)': agingData.filter(item => item.ageInDays > 90).length
    };

    const agingChartData = Object.entries(agingBuckets).map(([bucket, count]) => ({
      bucket,
      count
    }));

    // Value distribution
    const valueRanges = {
      'Low ($0-$100)': inventory.filter(item => item.value <= 100).length,
      'Medium ($101-$1000)': inventory.filter(item => item.value > 100 && item.value <= 1000).length,
      'High ($1001-$5000)': inventory.filter(item => item.value > 1000 && item.value <= 5000).length,
      'Premium ($5000+)': inventory.filter(item => item.value > 5000).length
    };

    const valueChartData = Object.entries(valueRanges).map(([range, count]) => ({
      range,
      count
    }));

    return {
      categoryChartData,
      lowStockItems,
      spaceChartData,
      agingChartData,
      valueChartData,
      agingData
    };
  }, [inventory, warehouseSpaces]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const generateReport = () => {
    const reportContent = {
      overview: `
WAREHOUSE MANAGEMENT SYSTEM - OVERVIEW REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY STATISTICS:
- Total Items: ${stats.totalItems.toLocaleString()}
- Total Value: $${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- Low Stock Alerts: ${stats.lowStockItems}
- Space Utilization: ${stats.spaceUtilization.toFixed(1)}%
- Average Item Age: ${stats.averageAge.toFixed(1)} days

CATEGORY BREAKDOWN:
${reportData.categoryChartData.map(item => 
  `- ${item.category}: ${item.quantity} items ($${item.value.toFixed(2)})`
).join('\n')}

SPACE UTILIZATION BY AISLE:
${reportData.spaceChartData.map(item => 
  `- Aisle ${item.aisle}: ${item.utilization.toFixed(1)}% (${item.occupied}/${item.capacity})`
).join('\n')}
      `,
      lowStock: `
LOW STOCK REPORT
Generated: ${new Date().toLocaleString()}

ITEMS REQUIRING ATTENTION: ${reportData.lowStockItems.length}

${reportData.lowStockItems.map(item => `
Item: ${item.name} (${item.id})
Current Stock: ${item.quantity}
Minimum Stock: ${item.minStock}
Shortage: ${item.minStock - item.quantity}
Location: ${item.location.aisle}-${item.location.shelf}-${item.location.position}
Supplier: ${item.supplier}
`).join('\n')}
      `,
      spaceUtilization: `
SPACE UTILIZATION REPORT
Generated: ${new Date().toLocaleString()}

OVERALL UTILIZATION: ${stats.spaceUtilization.toFixed(1)}%

BY AISLE:
${reportData.spaceChartData.map(item => `
Aisle ${item.aisle}:
- Capacity: ${item.capacity} units
- Occupied: ${item.occupied} units
- Available: ${item.available} units
- Utilization: ${item.utilization.toFixed(1)}%
`).join('\n')}
      `,
      itemAging: `
ITEM AGING REPORT
Generated: ${new Date().toLocaleString()}

AGING DISTRIBUTION:
${reportData.agingChartData.map(item => 
  `- ${item.bucket}: ${item.count} items`
).join('\n')}

OLDEST ITEMS:
${reportData.agingData
  .sort((a, b) => b.ageInDays - a.ageInDays)
  .slice(0, 10)
  .map(item => `- ${item.name}: ${item.ageInDays} days old`)
  .join('\n')}
      `
    };

    const blob = new Blob([reportContent[selectedReport]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse-${selectedReport}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive warehouse insights and data analysis</p>
          </div>
          <button
            onClick={generateReport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedReport('overview')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedReport === 'overview' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <BarChart3 size={24} className="text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Overview</h3>
            <p className="text-sm text-gray-600">General statistics</p>
          </button>
          
          <button
            onClick={() => setSelectedReport('lowStock')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedReport === 'lowStock' 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlertTriangle size={24} className="text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">Low Stock</h3>
            <p className="text-sm text-gray-600">{reportData.lowStockItems.length} items</p>
          </button>
          
          <button
            onClick={() => setSelectedReport('spaceUtilization')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedReport === 'spaceUtilization' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Package size={24} className="text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Space Usage</h3>
            <p className="text-sm text-gray-600">{stats.spaceUtilization.toFixed(1)}% utilized</p>
          </button>
          
          <button
            onClick={() => setSelectedReport('itemAging')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedReport === 'itemAging' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TrendingUp size={24} className="text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Item Aging</h3>
            <p className="text-sm text-gray-600">{stats.averageAge.toFixed(0)} days avg</p>
          </button>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Value Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.valueChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.valueChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedReport === 'lowStock' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Items ({reportData.lowStockItems.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shortage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.lowStockItems.map((item) => {
                  const shortage = item.minStock - item.quantity;
                  const priority = item.quantity === 0 ? 'Critical' : shortage > 10 ? 'High' : 'Medium';
                  const priorityColor = priority === 'Critical' ? 'text-red-700 bg-red-100' : 
                                      priority === 'High' ? 'text-orange-700 bg-orange-100' : 
                                      'text-yellow-700 bg-yellow-100';
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {shortage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.location.aisle}-{item.location.shelf}-{item.location.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColor}`}>
                          {priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReport === 'spaceUtilization' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Space Utilization by Aisle</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.spaceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="aisle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportData.spaceChartData.map((aisle) => (
              <div key={aisle.aisle} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aisle {aisle.aisle}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-medium">{aisle.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Occupied</span>
                    <span className="text-sm font-medium">{aisle.occupied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="text-sm font-medium">{aisle.available}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${aisle.utilization}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-green-600">{aisle.utilization.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReport === 'itemAging' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Age Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.agingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Oldest Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age (Days)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.agingData
                    .sort((a, b) => b.ageInDays - a.ageInDays)
                    .slice(0, 10)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.ageInDays > 90 ? 'bg-red-100 text-red-800' :
                            item.ageInDays > 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.ageInDays} days
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.dateAdded).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.value.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
/**
 * Space Optimization Component
 * Greedy Best-Fit and 0/1 Knapsack algorithms for space allocation
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Package, Zap, Target, Clock, BarChart3 } from 'lucide-react';
import { useWarehouseData } from '../hooks/useWarehouseData';
import { InventoryItem, WarehouseSpace, OptimizationAlgorithm, AlgorithmPerformance } from '../types';
import { GreedyBestFit, KnapsackOptimization, SpaceAllocation } from '../algorithms/spaceOptimization';

const SpaceOptimization: React.FC = () => {
  const { inventory, warehouseSpaces, loading } = useWarehouseData();
  const [algorithm, setAlgorithm] = useState<OptimizationAlgorithm>('greedy');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<SpaceAllocation[]>([]);
  const [unallocatedItems, setUnallocatedItems] = useState<InventoryItem[]>([]);
  const [knapsackResult, setKnapsackResult] = useState<{
    selectedItems: InventoryItem[];
    totalValue: number;
    totalWeight: number;
  } | null>(null);
  const [performance, setPerformance] = useState<AlgorithmPerformance | null>(null);
  const [capacity, setCapacity] = useState(1000);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const greedyBestFit = new GreedyBestFit();
  const knapsackOptimization = new KnapsackOptimization();

  const runOptimization = async () => {
    if (selectedItems.length === 0) return;

    setIsOptimizing(true);
    
    // Simulate async processing for better UX
    await new Promise(resolve => setTimeout(resolve, 200));

    const itemsToOptimize = inventory.filter(item => selectedItems.includes(item.id));

    try {
      if (algorithm === 'greedy') {
        const availableSpaces = warehouseSpaces.filter(space => space.available > 0);
        const result = greedyBestFit.allocateSpace(itemsToOptimize, availableSpaces);
        
        setAllocations(result.allocations);
        setUnallocatedItems(result.unallocated);
        setPerformance(result.performance);
        setKnapsackResult(null);
      } else {
        const result = knapsackOptimization.optimizeValue(itemsToOptimize, capacity);
        
        setKnapsackResult(result);
        setPerformance(result.performance);
        setAllocations([]);
        setUnallocatedItems([]);
      }
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(inventory.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setAllocations([]);
    setUnallocatedItems([]);
    setKnapsackResult(null);
    setPerformance(null);
  };

  // Calculate space utilization
  const spaceStats = {
    totalCapacity: warehouseSpaces.reduce((sum, space) => sum + space.capacity, 0),
    totalOccupied: warehouseSpaces.reduce((sum, space) => sum + space.occupied, 0),
    totalAvailable: warehouseSpaces.reduce((sum, space) => sum + space.available, 0),
  };
  spaceStats.utilization = spaceStats.totalCapacity > 0 
    ? (spaceStats.totalOccupied / spaceStats.totalCapacity) * 100 
    : 0;

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
            <h1 className="text-2xl font-bold text-gray-900">Space Optimization</h1>
            <p className="text-gray-600 mt-1">Optimize warehouse space allocation using advanced algorithms</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Utilization</p>
            <p className="text-2xl font-bold text-blue-600">{spaceStats.utilization.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Algorithm Selection and Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as OptimizationAlgorithm)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="greedy">Greedy Best-Fit - O(n log n)</option>
              <option value="knapsack">0/1 Knapsack - O(nW)</option>
            </select>
          </div>
          
          {algorithm === 'knapsack' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity Limit</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 1000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <button
              onClick={selectAllItems}
              className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={runOptimization}
              disabled={selectedItems.length === 0 || isOptimizing}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Zap size={16} className="mr-2" />
              )}
              Optimize
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-700 mb-2">
              <Clock size={20} />
              <span className="ml-2 font-medium">Execution Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{performance.executionTime.toFixed(2)}ms</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-700 mb-2">
              <Target size={20} />
              <span className="ml-2 font-medium">Comparisons</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{performance.comparisons || 0}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center text-purple-700 mb-2">
              <Package size={20} />
              <span className="ml-2 font-medium">Items Processed</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{performance.dataSize}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center text-orange-700 mb-2">
              <BarChart3 size={20} />
              <span className="ml-2 font-medium">Algorithm</span>
            </div>
            <p className="text-lg font-bold text-orange-900">{performance.algorithm}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item Selection */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Items ({selectedItems.length} selected)
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedItems.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => toggleItemSelection(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} | Weight: {item.weight}kg | Value: ${item.value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.value / item.weight).toFixed(2)}/kg
                    </p>
                    <p className="text-xs text-gray-500">Value density</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Optimization Results</h2>
          </div>
          <div className="p-6">
            {algorithm === 'greedy' && allocations.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Space Allocations</h3>
                {allocations.map((allocation, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-900">{allocation.item.name}</h4>
                        <p className="text-sm text-green-700">
                          Location: {allocation.allocatedSpace.aisle}-{allocation.allocatedSpace.shelf}-{allocation.allocatedSpace.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-900">
                          {allocation.efficiency.toFixed(1)}% efficient
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {unallocatedItems.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-900 mt-4">Unallocated Items</h3>
                    {unallocatedItems.map((item) => (
                      <div key={item.id} className="p-3 bg-red-50 rounded-lg mt-2">
                        <h4 className="font-medium text-red-900">{item.name}</h4>
                        <p className="text-sm text-red-700">Insufficient space available</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : algorithm === 'knapsack' && knapsackResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">{knapsackResult.selectedItems.length}</p>
                    <p className="text-sm text-blue-600">Items Selected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">${knapsackResult.totalValue.toFixed(2)}</p>
                    <p className="text-sm text-blue-600">Total Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">{knapsackResult.totalWeight.toFixed(1)}kg</p>
                    <p className="text-sm text-blue-600">Total Weight</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900">Selected Items</h3>
                {knapsackResult.selectedItems.map((item) => (
                  <div key={item.id} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-green-900">{item.name}</h4>
                        <p className="text-sm text-green-700">
                          Weight: {item.weight}kg | Value: ${item.value.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-900">
                          ${(item.value / item.weight).toFixed(2)}/kg
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No optimization results</h3>
                <p className="text-gray-600">
                  Select items and run optimization to see results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warehouse Space Visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Layout</h2>
        <div className="grid grid-cols-6 gap-2">
          {warehouseSpaces.map((space) => (
            <div
              key={space.id}
              className={`p-3 rounded-lg border-2 text-center text-xs ${
                space.occupied === 0 
                  ? 'bg-gray-100 border-gray-300' 
                  : space.available === 0 
                    ? 'bg-red-100 border-red-300' 
                    : 'bg-blue-100 border-blue-300'
              }`}
            >
              <div className="font-medium">{space.id}</div>
              <div className="text-xs mt-1">
                {space.occupied}/{space.capacity}
              </div>
              <div className={`w-full h-2 rounded mt-1 ${
                space.occupied === 0 ? 'bg-gray-300' : 'bg-blue-500'
              }`}>
                <div 
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(space.occupied / space.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
            <span>Empty</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
            <span>Partially Filled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
            <span>Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceOptimization;
/**
 * Route Optimization Component
 * Dijkstra's Algorithm for shortest path calculation
 */

import React, { useState, useEffect } from 'react';
import { Route, MapPin, Clock, Navigation, Play, RotateCcw } from 'lucide-react';
import { useWarehouseData } from '../hooks/useWarehouseData';
import { InventoryItem, Location } from '../types';
import { DijkstraPathFinder, PathResult } from '../algorithms/dijkstra';

const RouteOptimization: React.FC = () => {
  const { inventory, loading } = useWarehouseData();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<Location>({ aisle: 'A', shelf: 1, position: 1 });
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pathFinder] = useState(() => new DijkstraPathFinder());

  // Initialize the warehouse graph
  useEffect(() => {
    if (inventory.length > 0) {
      const uniqueLocations = Array.from(
        new Map(
          inventory.map(item => [
            `${item.location.aisle}-${item.location.shelf}-${item.location.position}`,
            item.location
          ])
        ).values()
      );
      
      pathFinder.initializeWarehouseGraph(uniqueLocations);
    }
  }, [inventory, pathFinder]);

  const calculateOptimalRoute = async () => {
    if (selectedItems.length === 0) return;

    setIsCalculating(true);
    
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const selectedItemsData = inventory.filter(item => selectedItems.includes(item.id));
      const destinationLocations = selectedItemsData.map(item => item.location);
      
      const result = pathFinder.findOptimalPickingPath(startLocation, destinationLocations);
      setPathResult(result);
    } catch (error) {
      console.error('Route calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetRoute = () => {
    setSelectedItems([]);
    setPathResult(null);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Group inventory by location for easier selection
  const locationGroups = inventory.reduce((groups, item) => {
    const key = `${item.location.aisle}-${item.location.shelf}-${item.location.position}`;
    if (!groups[key]) {
      groups[key] = { location: item.location, items: [] };
    }
    groups[key].items.push(item);
    return groups;
  }, {} as Record<string, { location: Location; items: InventoryItem[] }>);

  const uniqueLocations = Object.keys(locationGroups).sort();

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
            <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
            <p className="text-gray-600 mt-1">Find optimal picking routes using Dijkstra's algorithm</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetRoute}
              className="inline-flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw size={16} className="mr-2" />
              Reset
            </button>
            <button
              onClick={calculateOptimalRoute}
              disabled={selectedItems.length === 0 || isCalculating}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play size={16} className="mr-2" />
              )}
              Calculate Route
            </button>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Aisle</label>
            <select
              value={startLocation.aisle}
              onChange={(e) => setStartLocation(prev => ({ ...prev, aisle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A">Aisle A</option>
              <option value="B">Aisle B</option>
              <option value="C">Aisle C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Shelf</label>
            <select
              value={startLocation.shelf}
              onChange={(e) => setStartLocation(prev => ({ ...prev, shelf: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Shelf 1</option>
              <option value={2}>Shelf 2</option>
              <option value={3}>Shelf 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Position</label>
            <select
              value={startLocation.position}
              onChange={(e) => setStartLocation(prev => ({ ...prev, position: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Position 1</option>
              <option value={2}>Position 2</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-blue-50 p-3 rounded-lg w-full">
              <p className="text-sm font-medium text-blue-900">Starting Point</p>
              <p className="text-lg text-blue-700">
                {startLocation.aisle}-{startLocation.shelf}-{startLocation.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {pathResult && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-700 mb-2">
              <Route size={20} />
              <span className="ml-2 font-medium">Total Distance</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{pathResult.totalDistance} units</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-700 mb-2">
              <Clock size={20} />
              <span className="ml-2 font-medium">Calculation Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{pathResult.performance.executionTime.toFixed(2)}ms</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center text-purple-700 mb-2">
              <Navigation size={20} />
              <span className="ml-2 font-medium">Locations Visited</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{pathResult.path.length}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center text-orange-700 mb-2">
              <MapPin size={20} />
              <span className="ml-2 font-medium">Nodes Explored</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{pathResult.visitedNodes.length}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item Selection by Location */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Items to Collect ({selectedItems.length} selected)
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {uniqueLocations.map((locationKey) => {
              const { location, items } = locationGroups[locationKey];
              const locationSelected = items.some(item => selectedItems.includes(item.id));
              
              return (
                <div key={locationKey} className="border-b border-gray-100">
                  <div className={`p-4 ${locationSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <MapPin size={16} className="mr-2 text-blue-600" />
                        Location {location.aisle}-{location.shelf}-{location.position}
                      </h3>
                      <span className="text-sm text-gray-500">{items.length} items</span>
                    </div>
                    
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center p-2 rounded cursor-pointer ${
                            selectedItems.includes(item.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => toggleItemSelection(item.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} | {item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Visualization */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Optimal Route</h2>
          </div>
          <div className="p-6">
            {pathResult ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Route Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700">Total Distance: <span className="font-medium">{pathResult.totalDistance} units</span></p>
                      <p className="text-green-700">Stops: <span className="font-medium">{pathResult.path.length}</span></p>
                    </div>
                    <div>
                      <p className="text-green-700">Algorithm: <span className="font-medium">Dijkstra</span></p>
                      <p className="text-green-700">Complexity: <span className="font-medium">O(V log V)</span></p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Step-by-step Route</h3>
                  <div className="space-y-2">
                    {pathResult.path.map((nodeIndex, stepIndex) => {
                      const location = pathFinder.getLocationByIndex(nodeIndex);
                      if (!location) return null;
                      
                      const isStart = stepIndex === 0;
                      const isEnd = stepIndex === pathResult.path.length - 1;
                      
                      return (
                        <div key={stepIndex} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isStart ? 'bg-green-500 text-white' :
                            isEnd ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {stepIndex + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {location.aisle}-{location.shelf}-{location.position}
                              {isStart && <span className="text-green-600 ml-2">(Start)</span>}
                              {isEnd && <span className="text-red-600 ml-2">(End)</span>}
                            </p>
                            {/* Show items at this location */}
                            {locationGroups[`${location.aisle}-${location.shelf}-${location.position}`]?.items
                              .filter(item => selectedItems.includes(item.id))
                              .map(item => (
                                <p key={item.id} className="text-sm text-gray-600">• {item.name}</p>
                              ))
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Route size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No route calculated</h3>
                <p className="text-gray-600">
                  Select items and click "Calculate Route" to see the optimal path.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warehouse Grid Visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Grid</h2>
        <div className="grid grid-cols-6 gap-2">
          {uniqueLocations.map((locationKey) => {
            const { location, items } = locationGroups[locationKey];
            const hasSelectedItems = items.some(item => selectedItems.includes(item.id));
            const isStartLocation = 
              location.aisle === startLocation.aisle && 
              location.shelf === startLocation.shelf && 
              location.position === startLocation.position;
            
            let pathIndex = -1;
            if (pathResult) {
              pathIndex = pathResult.path.findIndex(nodeIndex => {
                const pathLocation = pathFinder.getLocationByIndex(nodeIndex);
                return pathLocation && 
                  pathLocation.aisle === location.aisle && 
                  pathLocation.shelf === location.shelf && 
                  pathLocation.position === location.position;
              });
            }
            
            return (
              <div
                key={locationKey}
                className={`p-3 rounded-lg border-2 text-center text-xs relative ${
                  isStartLocation ? 'bg-green-100 border-green-500' :
                  hasSelectedItems ? 'bg-blue-100 border-blue-500' :
                  'bg-gray-100 border-gray-300'
                }`}
              >
                <div className="font-medium">{locationKey}</div>
                <div className="text-xs mt-1">{items.length} items</div>
                
                {pathIndex >= 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {pathIndex + 1}
                  </div>
                )}
                
                {isStartLocation && (
                  <div className="absolute -top-1 -left-1 text-green-600">
                    <Navigation size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
            <span>Start Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
            <span>Selected Items</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
            <span>Other Locations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
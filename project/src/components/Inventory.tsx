/**
 * Inventory Management Component
 * CRUD operations with algorithmic sorting
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUpDown, Clock } from 'lucide-react';
import { useWarehouseData } from '../hooks/useWarehouseData';
import { InventoryItem, SortAlgorithm, AlgorithmPerformance } from '../types';
import { MergeSort, QuickSort } from '../algorithms/sorting';

const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, loading } = useWarehouseData();
  const [sortedInventory, setSortedInventory] = useState<InventoryItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof InventoryItem>('name');
  const [sortAlgorithm, setSortAlgorithm] = useState<SortAlgorithm>('mergeSort');
  const [performance, setPerformance] = useState<AlgorithmPerformance | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    quantity: 0,
    minStock: 0,
    maxStock: 100,
    unitPrice: 0,
    supplier: '',
    weight: 0
  });

  const mergeSort = new MergeSort();
  const quickSort = new QuickSort();

  // Sort inventory whenever inventory, sortBy, or sortAlgorithm changes
  useEffect(() => {
    if (inventory.length > 0) {
      sortInventory();
    }
  }, [inventory, sortBy, sortAlgorithm]);

  const sortInventory = () => {
    const algorithm = sortAlgorithm === 'mergeSort' ? mergeSort : quickSort;
    const result = algorithm.sort(inventory, sortBy);
    setSortedInventory(result.sortedItems);
    setPerformance(result.performance);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) return;

    const item: InventoryItem = {
      id: `INV${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity || 0,
      minStock: newItem.minStock || 0,
      maxStock: newItem.maxStock || 100,
      unitPrice: newItem.unitPrice || 0,
      location: { aisle: 'A', shelf: 1, position: 1 },
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      supplier: newItem.supplier || '',
      weight: newItem.weight || 0,
      value: (newItem.quantity || 0) * (newItem.unitPrice || 0)
    };

    addInventoryItem(item);
    setNewItem({ name: '', category: '', quantity: 0, minStock: 0, maxStock: 100, unitPrice: 0, supplier: '', weight: 0 });
    setIsAddingItem(false);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<InventoryItem>) => {
    const existingItem = inventory.find(item => item.id === itemId);
    if (!existingItem) return;

    const updatedItem: InventoryItem = {
      ...existingItem,
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
      value: (updates.quantity ?? existingItem.quantity) * (updates.unitPrice ?? existingItem.unitPrice)
    };

    updateInventoryItem(updatedItem);
    setEditingItem(null);
  };

  const getLowStockClass = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) return 'bg-red-50 border-red-200';
    if (item.quantity <= item.minStock * 1.5) return 'bg-yellow-50 border-yellow-200';
    return 'bg-white';
  };

  const sortOptions: Array<{ key: keyof InventoryItem; label: string }> = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'value', label: 'Total Value' },
    { key: 'dateAdded', label: 'Date Added' }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage warehouse inventory with algorithmic sorting</p>
          </div>
          <button
            onClick={() => setIsAddingItem(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof InventoryItem)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
            <select
              value={sortAlgorithm}
              onChange={(e) => setSortAlgorithm(e.target.value as SortAlgorithm)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mergeSort">Merge Sort - O(n log n)</option>
              <option value="quickSort">Quick Sort - O(n log n)</option>
            </select>
          </div>

          {performance && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-700 mb-2">
                <Clock size={16} className="mr-1" />
                <span className="font-medium">Performance</span>
              </div>
              <p className="text-sm text-blue-600">
                {performance.algorithm}: {performance.executionTime.toFixed(2)}ms
              </p>
              <p className="text-xs text-blue-500">
                {performance.comparisons} comparisons, {performance.swaps} swaps
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Form */}
      {isAddingItem && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity || 0}
              onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Min Stock"
              value={newItem.minStock || 0}
              onChange={(e) => setNewItem(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={newItem.unitPrice || 0}
              onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Supplier"
              value={newItem.supplier || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X size={16} className="mr-1 inline" />
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save size={16} className="mr-1 inline" />
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInventory.map((item) => (
                <tr key={item.id} className={`${getLowStockClass(item)} hover:bg-gray-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        defaultValue={item.name}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onBlur={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                      />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.id}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        defaultValue={item.quantity}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onBlur={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                        {item.quantity <= item.minStock && (
                          <div className="text-xs text-red-600 font-medium">Low Stock!</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location.aisle}-{item.location.shelf}-{item.location.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteInventoryItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
/**
 * Search Component
 * Advanced search with Binary Search and Hash Map algorithms
 */

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Clock, Hash, Binary, Filter } from 'lucide-react';
import { useWarehouseData } from '../hooks/useWarehouseData';
import { InventoryItem, SearchAlgorithm, AlgorithmPerformance } from '../types';
import { BinarySearch, HashMapSearch } from '../algorithms/searching';

const Search: React.FC = () => {
  const { inventory, addActivity, loading } = useWarehouseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<keyof InventoryItem>('name');
  const [searchAlgorithm, setSearchAlgorithm] = useState<SearchAlgorithm>('hashMap');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [performance, setPerformance] = useState<AlgorithmPerformance | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const binarySearch = new BinarySearch();
  const hashMapSearch = new HashMapSearch();

  // Initialize hash map when component mounts
  useEffect(() => {
    if (inventory.length > 0) {
      hashMapSearch.buildHashMap(inventory);
    }
  }, [inventory]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setPerformance(null);
      return;
    }

    setIsSearching(true);
    
    // Simulate async search for better UX
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      let result;
      
      if (searchAlgorithm === 'binarySearch') {
        result = binarySearch.search(inventory, searchTerm, searchBy);
      } else {
        result = hashMapSearch.search(searchTerm, searchBy);
      }

      setSearchResults(result.results);
      setPerformance(result.performance);
      
      addActivity('search', `Searched for "${searchTerm}" using ${result.performance.algorithm}`);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setPerformance(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const searchOptions: Array<{ key: keyof InventoryItem; label: string }> = [
    { key: 'name', label: 'Name' },
    { key: 'id', label: 'ID' },
    { key: 'category', label: 'Category' },
    { key: 'supplier', label: 'Supplier' }
  ];

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
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
            <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
            <p className="text-gray-600 mt-1">Find inventory items using optimized search algorithms</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Filter size={16} className="mr-1" />
            {inventory.length} items indexed
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Term</label>
            <div className="relative">
              <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter search term..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as keyof InventoryItem)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {searchOptions.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
            <select
              value={searchAlgorithm}
              onChange={(e) => setSearchAlgorithm(e.target.value as SearchAlgorithm)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hashMap">Hash Map - O(1)</option>
              <option value="binarySearch">Binary Search - O(log n)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <SearchIcon size={16} className="mr-2" />
          )}
          Search
        </button>
      </div>

      {/* Performance Metrics */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-700 mb-2">
              {searchAlgorithm === 'hashMap' ? <Hash size={20} /> : <Binary size={20} />}
              <span className="ml-2 font-medium">{performance.algorithm}</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{performance.executionTime.toFixed(3)}ms</p>
            <p className="text-sm text-blue-600">Execution Time</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-700 mb-2">
              <Clock size={20} />
              <span className="ml-2 font-medium">Comparisons</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{performance.comparisons || 0}</p>
            <p className="text-sm text-green-600">Operations</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center text-purple-700 mb-2">
              <SearchIcon size={20} />
              <span className="ml-2 font-medium">Results Found</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{searchResults.length}</p>
            <p className="text-sm text-purple-600">of {performance.dataSize} items</p>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results
            {searchResults.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({searchResults.length} found)
              </span>
            )}
          </h2>
        </div>
        
        {searchResults.length > 0 ? (
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
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {highlightMatch(item.name, searchTerm)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {highlightMatch(item.id, searchTerm)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {highlightMatch(item.category, searchTerm)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                      {item.quantity <= item.minStock && (
                        <div className="text-xs text-red-600 font-medium">Low Stock!</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location.aisle}-{item.location.shelf}-{item.location.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {highlightMatch(item.supplier, searchTerm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : searchTerm && !isSearching ? (
          <div className="p-12 text-center">
            <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search term or changing the search field.
            </p>
          </div>
        ) : (
          <div className="p-12 text-center">
            <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">
              Enter a search term above to find inventory items using advanced algorithms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
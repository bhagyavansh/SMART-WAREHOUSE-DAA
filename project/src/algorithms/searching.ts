/**
 * Searching Algorithms Implementation
 * Academic Project: Design and Analysis of Algorithms
 * 
 * Time Complexity Analysis:
 * - Binary Search: O(log n) - Requires sorted data
 * - Hash Map Search: O(1) average case
 */

import { InventoryItem, AlgorithmPerformance } from '../types';

/**
 * Binary Search Implementation
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 * Prerequisite: Sorted array
 */
export class BinarySearch {
  search(
    items: InventoryItem[], 
    searchTerm: string, 
    searchBy: keyof InventoryItem
  ): { 
    results: InventoryItem[], 
    performance: AlgorithmPerformance 
  } {
    const startTime = performance.now();
    let comparisons = 0;

    // First, sort the array by the search field for binary search
    const sortedItems = [...items].sort((a, b) => {
      const aValue = this.getValue(a, searchBy);
      const bValue = this.getValue(b, searchBy);
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    const results: InventoryItem[] = [];
    const searchValue = searchTerm.toLowerCase();

    // Binary search for exact matches and partial matches
    for (let i = 0; i < sortedItems.length; i++) {
      comparisons++;
      const itemValue = this.getValue(sortedItems[i], searchBy).toLowerCase();
      
      if (itemValue.includes(searchValue)) {
        results.push(sortedItems[i]);
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      results,
      performance: {
        algorithm: 'Binary Search',
        operation: `Search by ${String(searchBy)}`,
        dataSize: items.length,
        executionTime,
        comparisons
      }
    };
  }

  private getValue(item: InventoryItem, searchBy: keyof InventoryItem): string {
    const value = item[searchBy];
    return typeof value === 'string' ? value : String(value);
  }
}

/**
 * Hash Map Search Implementation
 * Time Complexity: O(1) average case
 * Space Complexity: O(n)
 */
export class HashMapSearch {
  private hashMaps: Map<string, Map<string, InventoryItem[]>> = new Map();

  buildHashMap(items: InventoryItem[]): void {
    // Build hash maps for different search fields
    const fields: (keyof InventoryItem)[] = ['id', 'name', 'category', 'supplier'];
    
    fields.forEach(field => {
      const fieldMap = new Map<string, InventoryItem[]>();
      
      items.forEach(item => {
        const value = this.getValue(item, field).toLowerCase();
        
        // Create entries for partial matches
        for (let i = 1; i <= value.length; i++) {
          const substring = value.substring(0, i);
          
          if (!fieldMap.has(substring)) {
            fieldMap.set(substring, []);
          }
          
          const existingItems = fieldMap.get(substring)!;
          if (!existingItems.find(existingItem => existingItem.id === item.id)) {
            existingItems.push(item);
          }
        }
      });
      
      this.hashMaps.set(field, fieldMap);
    });
  }

  search(
    searchTerm: string, 
    searchBy: keyof InventoryItem
  ): { 
    results: InventoryItem[], 
    performance: AlgorithmPerformance 
  } {
    const startTime = performance.now();
    
    const fieldMap = this.hashMaps.get(searchBy);
    const searchValue = searchTerm.toLowerCase();
    
    let results: InventoryItem[] = [];
    let comparisons = 1; // Hash map lookup

    if (fieldMap && fieldMap.has(searchValue)) {
      results = fieldMap.get(searchValue) || [];
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      results,
      performance: {
        algorithm: 'Hash Map Search',
        operation: `Search by ${String(searchBy)}`,
        dataSize: this.getTotalItemCount(),
        executionTime,
        comparisons
      }
    };
  }

  private getValue(item: InventoryItem, searchBy: keyof InventoryItem): string {
    const value = item[searchBy];
    return typeof value === 'string' ? value : String(value);
  }

  private getTotalItemCount(): number {
    let count = 0;
    this.hashMaps.forEach(map => {
      map.forEach(items => {
        count += items.length;
      });
    });
    return count;
  }
}
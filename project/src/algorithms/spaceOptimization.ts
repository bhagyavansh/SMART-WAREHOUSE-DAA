/**
 * Space Optimization Algorithms Implementation
 * Academic Project: Design and Analysis of Algorithms
 * 
 * Algorithms:
 * - Greedy Best-Fit: O(n log n) - Simple, efficient space allocation
 * - 0/1 Knapsack: O(nW) - Optimal value maximization with weight constraints
 */

import { InventoryItem, WarehouseSpace, AlgorithmPerformance } from '../types';

export interface SpaceAllocation {
  item: InventoryItem;
  allocatedSpace: WarehouseSpace;
  efficiency: number;
}

/**
 * Greedy Best-Fit Algorithm Implementation
 * Time Complexity: O(n log n)
 * Space Complexity: O(1)
 */
export class GreedyBestFit {
  allocateSpace(
    items: InventoryItem[], 
    availableSpaces: WarehouseSpace[]
  ): {
    allocations: SpaceAllocation[],
    unallocated: InventoryItem[],
    performance: AlgorithmPerformance
  } {
    const startTime = performance.now();
    let comparisons = 0;

    const allocations: SpaceAllocation[] = [];
    const unallocated: InventoryItem[] = [];
    const spaces = [...availableSpaces].filter(space => space.available > 0);

    // Sort items by value density (value/weight) in descending order
    const sortedItems = [...items].sort((a, b) => {
      comparisons++;
      const aDensity = a.value / a.weight;
      const bDensity = b.value / b.weight;
      return bDensity - aDensity;
    });

    for (const item of sortedItems) {
      let bestSpace: WarehouseSpace | null = null;
      let bestFit = Infinity;

      // Find the best-fit space (smallest space that can accommodate the item)
      for (const space of spaces) {
        comparisons++;
        
        if (space.available >= item.quantity) {
          const wastedSpace = space.available - item.quantity;
          
          if (wastedSpace < bestFit) {
            bestFit = wastedSpace;
            bestSpace = space;
          }
        }
      }

      if (bestSpace) {
        // Allocate the item to the best-fit space
        const efficiency = ((item.quantity / bestSpace.capacity) * 100);
        
        allocations.push({
          item,
          allocatedSpace: bestSpace,
          efficiency
        });

        // Update space availability
        bestSpace.available -= item.quantity;
        bestSpace.occupied += item.quantity;
        bestSpace.itemId = item.id;

        // Remove space if fully occupied
        if (bestSpace.available === 0) {
          const index = spaces.indexOf(bestSpace);
          spaces.splice(index, 1);
        }
      } else {
        unallocated.push(item);
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      allocations,
      unallocated,
      performance: {
        algorithm: 'Greedy Best-Fit',
        operation: 'Space Allocation',
        dataSize: items.length,
        executionTime,
        comparisons
      }
    };
  }
}

/**
 * 0/1 Knapsack Algorithm Implementation
 * Time Complexity: O(nW) where n is number of items, W is capacity
 * Space Complexity: O(nW)
 */
export class KnapsackOptimization {
  optimizeValue(
    items: InventoryItem[], 
    capacity: number
  ): {
    selectedItems: InventoryItem[],
    totalValue: number,
    totalWeight: number,
    performance: AlgorithmPerformance
  } {
    const startTime = performance.now();
    let comparisons = 0;

    const n = items.length;
    
    // Create DP table
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      const weight = Math.ceil(item.weight);
      const value = item.value;

      for (let w = 1; w <= capacity; w++) {
        comparisons++;
        
        if (weight <= w) {
          // Choose maximum between including and excluding current item
          const includeValue = value + dp[i - 1][w - weight];
          const excludeValue = dp[i - 1][w];
          
          dp[i][w] = Math.max(includeValue, excludeValue);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find selected items
    const selectedItems: InventoryItem[] = [];
    let w = capacity;
    let totalWeight = 0;

    for (let i = n; i > 0 && w > 0; i--) {
      comparisons++;
      
      if (dp[i][w] !== dp[i - 1][w]) {
        const item = items[i - 1];
        selectedItems.push(item);
        w -= Math.ceil(item.weight);
        totalWeight += item.weight;
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      selectedItems: selectedItems.reverse(),
      totalValue: dp[n][capacity],
      totalWeight,
      performance: {
        algorithm: '0/1 Knapsack',
        operation: 'Value Optimization',
        dataSize: items.length,
        executionTime,
        comparisons
      }
    };
  }
}
/**
 * Sorting Algorithms Implementation
 * Academic Project: Design and Analysis of Algorithms
 * 
 * Time Complexity Analysis:
 * - Merge Sort: O(n log n) - Stable, consistent performance
 * - Quick Sort: O(n log n) average, O(n²) worst case
 */

import { InventoryItem, AlgorithmPerformance } from '../types';

/**
 * Merge Sort Implementation
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * Stable: Yes
 */
export class MergeSort {
  private comparisons = 0;
  private swaps = 0;

  sort(items: InventoryItem[], sortBy: keyof InventoryItem): { 
    sortedItems: InventoryItem[], 
    performance: AlgorithmPerformance 
  } {
    const startTime = performance.now();
    this.comparisons = 0;
    this.swaps = 0;

    const sortedItems = this.mergeSort([...items], sortBy);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      sortedItems,
      performance: {
        algorithm: 'Merge Sort',
        operation: `Sort by ${String(sortBy)}`,
        dataSize: items.length,
        executionTime,
        comparisons: this.comparisons,
        swaps: this.swaps
      }
    };
  }

  private mergeSort(arr: InventoryItem[], sortBy: keyof InventoryItem): InventoryItem[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), sortBy);
    const right = this.mergeSort(arr.slice(mid), sortBy);

    return this.merge(left, right, sortBy);
  }

  private merge(left: InventoryItem[], right: InventoryItem[], sortBy: keyof InventoryItem): InventoryItem[] {
    const result: InventoryItem[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      this.comparisons++;
      
      const leftValue = this.getValue(left[leftIndex], sortBy);
      const rightValue = this.getValue(right[rightIndex], sortBy);

      if (leftValue <= rightValue) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
        this.swaps++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  private getValue(item: InventoryItem, sortBy: keyof InventoryItem): any {
    const value = item[sortBy];
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  }
}

/**
 * Quick Sort Implementation
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n)
 * Stable: No
 */
export class QuickSort {
  private comparisons = 0;
  private swaps = 0;

  sort(items: InventoryItem[], sortBy: keyof InventoryItem): { 
    sortedItems: InventoryItem[], 
    performance: AlgorithmPerformance 
  } {
    const startTime = performance.now();
    this.comparisons = 0;
    this.swaps = 0;

    const sortedItems = [...items];
    this.quickSort(sortedItems, 0, sortedItems.length - 1, sortBy);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      sortedItems,
      performance: {
        algorithm: 'Quick Sort',
        operation: `Sort by ${String(sortBy)}`,
        dataSize: items.length,
        executionTime,
        comparisons: this.comparisons,
        swaps: this.swaps
      }
    };
  }

  private quickSort(arr: InventoryItem[], low: number, high: number, sortBy: keyof InventoryItem): void {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high, sortBy);
      this.quickSort(arr, low, pivotIndex - 1, sortBy);
      this.quickSort(arr, pivotIndex + 1, high, sortBy);
    }
  }

  private partition(arr: InventoryItem[], low: number, high: number, sortBy: keyof InventoryItem): number {
    const pivot = this.getValue(arr[high], sortBy);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;
      
      if (this.getValue(arr[j], sortBy) <= pivot) {
        i++;
        this.swap(arr, i, j);
        if (i !== j) this.swaps++;
      }
    }

    this.swap(arr, i + 1, high);
    if (i + 1 !== high) this.swaps++;
    return i + 1;
  }

  private swap(arr: InventoryItem[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  private getValue(item: InventoryItem, sortBy: keyof InventoryItem): any {
    const value = item[sortBy];
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  }
}
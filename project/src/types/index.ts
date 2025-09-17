/**
 * Core Types for Warehouse Management System
 * Academic Project: Design and Analysis of Algorithms
 */

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  location: {
    aisle: string;
    shelf: number;
    position: number;
  };
  dateAdded: string;
  lastUpdated: string;
  supplier: string;
  weight: number;
  value: number;
}

export interface WarehouseSpace {
  id: string;
  aisle: string;
  shelf: number;
  position: number;
  capacity: number;
  occupied: number;
  available: number;
  itemId?: string;
}

export interface OrderPickingPath {
  orderId: string;
  items: string[];
  locations: { aisle: string; shelf: number; position: number }[];
  totalDistance: number;
  optimizedPath: number[];
  executionTime: number;
}

export interface AlgorithmPerformance {
  algorithm: string;
  operation: string;
  dataSize: number;
  executionTime: number;
  comparisons?: number;
  swaps?: number;
}

export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  spaceUtilization: number;
  averageAge: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'add' | 'update' | 'delete' | 'search' | 'optimization';
  description: string;
  timestamp: string;
}

export type SortAlgorithm = 'mergeSort' | 'quickSort';
export type SearchAlgorithm = 'binarySearch' | 'hashMap';
export type OptimizationAlgorithm = 'greedy' | 'knapsack';
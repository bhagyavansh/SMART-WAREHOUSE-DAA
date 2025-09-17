/**
 * Custom Hook for Warehouse Data Management
 * Handles local storage and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, WarehouseSpace, Activity, DashboardStats } from '../types';
import { sampleInventoryItems, sampleWarehouseSpaces } from '../data/sampleData';

const STORAGE_KEYS = {
  INVENTORY: 'warehouse_inventory',
  SPACES: 'warehouse_spaces',
  ACTIVITIES: 'warehouse_activities'
};

export const useWarehouseData = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouseSpaces, setWarehouseSpaces] = useState<WarehouseSpace[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data on first load
  useEffect(() => {
    const loadData = () => {
      try {
        // Load inventory
        const savedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory));
        } else {
          setInventory(sampleInventoryItems);
          localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(sampleInventoryItems));
        }

        // Load warehouse spaces
        const savedSpaces = localStorage.getItem(STORAGE_KEYS.SPACES);
        if (savedSpaces) {
          setWarehouseSpaces(JSON.parse(savedSpaces));
        } else {
          setWarehouseSpaces(sampleWarehouseSpaces);
          localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(sampleWarehouseSpaces));
        }

        // Load activities
        const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        } else {
          const initialActivity: Activity = {
            id: '1',
            type: 'add',
            description: 'System initialized with sample data',
            timestamp: new Date().toISOString()
          };
          setActivities([initialActivity]);
          localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([initialActivity]));
        }
      } catch (error) {
        console.error('Error loading warehouse data:', error);
        // Fallback to sample data
        setInventory(sampleInventoryItems);
        setWarehouseSpaces(sampleWarehouseSpaces);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!loading && inventory.length > 0) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }
  }, [inventory, loading]);

  useEffect(() => {
    if (!loading && warehouseSpaces.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(warehouseSpaces));
    }
  }, [warehouseSpaces, loading]);

  useEffect(() => {
    if (!loading && activities.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    }
  }, [activities, loading]);

  // Add activity log
  const addActivity = useCallback((type: Activity['type'], description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date().toISOString()
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
  }, []);

  // Inventory operations
  const addInventoryItem = useCallback((item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
    addActivity('add', `Added item: ${item.name} (${item.quantity} units)`);
  }, [addActivity]);

  const updateInventoryItem = useCallback((updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    addActivity('update', `Updated item: ${updatedItem.name}`);
  }, [addActivity]);

  const deleteInventoryItem = useCallback((itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    setInventory(prev => prev.filter(item => item.id !== itemId));
    if (item) {
      addActivity('delete', `Deleted item: ${item.name}`);
    }
  }, [inventory, addActivity]);

  // Warehouse space operations
  const updateWarehouseSpace = useCallback((updatedSpace: WarehouseSpace) => {
    setWarehouseSpaces(prev => prev.map(space => 
      space.id === updatedSpace.id ? updatedSpace : space
    ));
  }, []);

  // Calculate dashboard statistics
  const getDashboardStats = useCallback((): DashboardStats => {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock).length;
    
    const totalCapacity = warehouseSpaces.reduce((sum, space) => sum + space.capacity, 0);
    const totalOccupied = warehouseSpaces.reduce((sum, space) => sum + space.occupied, 0);
    const spaceUtilization = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

    // Calculate average age of items
    const now = new Date();
    const averageAge = inventory.length > 0 
      ? inventory.reduce((sum, item) => {
          const itemDate = new Date(item.dateAdded);
          const ageInDays = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
          return sum + ageInDays;
        }, 0) / inventory.length
      : 0;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      spaceUtilization,
      averageAge,
      recentActivity: activities.slice(0, 5)
    };
  }, [inventory, warehouseSpaces, activities]);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    setInventory(sampleInventoryItems);
    setWarehouseSpaces(sampleWarehouseSpaces);
    const resetActivity: Activity = {
      id: Date.now().toString(),
      type: 'add',
      description: 'System reset to sample data',
      timestamp: new Date().toISOString()
    };
    setActivities([resetActivity]);
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  return {
    inventory,
    warehouseSpaces,
    activities,
    loading,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateWarehouseSpace,
    getDashboardStats,
    addActivity,
    resetToSampleData
  };
};
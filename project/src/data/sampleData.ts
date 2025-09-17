/**
 * Sample Data for Warehouse Management System
 * Pre-populated data for algorithm demonstration
 */

import { InventoryItem, WarehouseSpace } from '../types';

export const sampleInventoryItems: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    quantity: 45,
    minStock: 10,
    maxStock: 100,
    unitPrice: 79.99,
    location: { aisle: 'A', shelf: 1, position: 1 },
    dateAdded: '2024-01-15',
    lastUpdated: '2024-01-20',
    supplier: 'TechCorp',
    weight: 0.3,
    value: 3599.55
  },
  {
    id: 'INV002',
    name: 'Gaming Mouse',
    category: 'Electronics',
    quantity: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 45.99,
    location: { aisle: 'A', shelf: 1, position: 2 },
    dateAdded: '2024-01-10',
    lastUpdated: '2024-01-18',
    supplier: 'GameGear',
    weight: 0.15,
    value: 367.92
  },
  {
    id: 'INV003',
    name: 'Office Chair',
    category: 'Furniture',
    quantity: 25,
    minStock: 5,
    maxStock: 30,
    unitPrice: 199.99,
    location: { aisle: 'B', shelf: 2, position: 1 },
    dateAdded: '2024-01-08',
    lastUpdated: '2024-01-19',
    supplier: 'FurniMax',
    weight: 15.5,
    value: 4999.75
  },
  {
    id: 'INV004',
    name: 'Laptop Stand',
    category: 'Accessories',
    quantity: 32,
    minStock: 20,
    maxStock: 60,
    unitPrice: 29.99,
    location: { aisle: 'A', shelf: 2, position: 1 },
    dateAdded: '2024-01-12',
    lastUpdated: '2024-01-21',
    supplier: 'AccessPlus',
    weight: 1.2,
    value: 959.68
  },
  {
    id: 'INV005',
    name: 'LED Monitor',
    category: 'Electronics',
    quantity: 3,
    minStock: 8,
    maxStock: 25,
    unitPrice: 299.99,
    location: { aisle: 'C', shelf: 1, position: 1 },
    dateAdded: '2024-01-05',
    lastUpdated: '2024-01-17',
    supplier: 'DisplayTech',
    weight: 4.8,
    value: 899.97
  },
  {
    id: 'INV006',
    name: 'Wireless Keyboard',
    category: 'Electronics',
    quantity: 18,
    minStock: 12,
    maxStock: 40,
    unitPrice: 69.99,
    location: { aisle: 'A', shelf: 1, position: 3 },
    dateAdded: '2024-01-14',
    lastUpdated: '2024-01-22',
    supplier: 'KeyboardCo',
    weight: 0.8,
    value: 1259.82
  },
  {
    id: 'INV007',
    name: 'Desk Lamp',
    category: 'Office Supplies',
    quantity: 15,
    minStock: 10,
    maxStock: 35,
    unitPrice: 39.99,
    location: { aisle: 'B', shelf: 1, position: 1 },
    dateAdded: '2024-01-11',
    lastUpdated: '2024-01-20',
    supplier: 'LightWorks',
    weight: 2.1,
    value: 599.85
  },
  {
    id: 'INV008',
    name: 'USB Cable',
    category: 'Accessories',
    quantity: 2,
    minStock: 25,
    maxStock: 100,
    unitPrice: 12.99,
    location: { aisle: 'A', shelf: 3, position: 1 },
    dateAdded: '2024-01-09',
    lastUpdated: '2024-01-16',
    supplier: 'CableTech',
    weight: 0.1,
    value: 25.98
  }
];

export const sampleWarehouseSpaces: WarehouseSpace[] = [
  // Aisle A
  { id: 'A-1-1', aisle: 'A', shelf: 1, position: 1, capacity: 100, occupied: 45, available: 55, itemId: 'INV001' },
  { id: 'A-1-2', aisle: 'A', shelf: 1, position: 2, capacity: 100, occupied: 8, available: 92, itemId: 'INV002' },
  { id: 'A-1-3', aisle: 'A', shelf: 1, position: 3, capacity: 100, occupied: 18, available: 82, itemId: 'INV006' },
  { id: 'A-2-1', aisle: 'A', shelf: 2, position: 1, capacity: 100, occupied: 32, available: 68, itemId: 'INV004' },
  { id: 'A-2-2', aisle: 'A', shelf: 2, position: 2, capacity: 100, occupied: 0, available: 100 },
  { id: 'A-3-1', aisle: 'A', shelf: 3, position: 1, capacity: 100, occupied: 2, available: 98, itemId: 'INV008' },
  
  // Aisle B
  { id: 'B-1-1', aisle: 'B', shelf: 1, position: 1, capacity: 50, occupied: 15, available: 35, itemId: 'INV007' },
  { id: 'B-1-2', aisle: 'B', shelf: 1, position: 2, capacity: 50, occupied: 0, available: 50 },
  { id: 'B-2-1', aisle: 'B', shelf: 2, position: 1, capacity: 30, occupied: 25, available: 5, itemId: 'INV003' },
  { id: 'B-2-2', aisle: 'B', shelf: 2, position: 2, capacity: 30, occupied: 0, available: 30 },
  
  // Aisle C
  { id: 'C-1-1', aisle: 'C', shelf: 1, position: 1, capacity: 100, occupied: 3, available: 97, itemId: 'INV005' },
  { id: 'C-1-2', aisle: 'C', shelf: 1, position: 2, capacity: 100, occupied: 0, available: 100 },
  { id: 'C-2-1', aisle: 'C', shelf: 2, position: 1, capacity: 100, occupied: 0, available: 100 },
  { id: 'C-2-2', aisle: 'C', shelf: 2, position: 2, capacity: 100, occupied: 0, available: 100 }
];
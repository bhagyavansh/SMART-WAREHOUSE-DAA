/**
 * Dijkstra's Algorithm Implementation
 * Academic Project: Design and Analysis of Algorithms
 * 
 * Time Complexity: O((V + E) log V) with priority queue
 * Space Complexity: O(V)
 * 
 * Used for finding shortest path between warehouse locations
 */

import { AlgorithmPerformance } from '../types';

export interface Location {
  aisle: string;
  shelf: number;
  position: number;
}

export interface PathResult {
  path: number[];
  totalDistance: number;
  visitedNodes: number[];
  performance: AlgorithmPerformance;
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Finds optimal route for order picking in warehouse
 */
export class DijkstraPathFinder {
  private graph: number[][] = [];
  private locations: Location[] = [];

  /**
   * Initialize warehouse layout as a graph
   * Each location is a node, distances are edges
   */
  initializeWarehouseGraph(locations: Location[]): void {
    this.locations = locations;
    const n = locations.length;
    
    // Initialize distance matrix
    this.graph = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Set diagonal to 0 (distance from location to itself)
    for (let i = 0; i < n; i++) {
      this.graph[i][i] = 0;
    }

    // Calculate distances between adjacent locations
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = this.calculateDistance(locations[i], locations[j]);
        this.graph[i][j] = distance;
        this.graph[j][i] = distance; // Undirected graph
      }
    }
  }

  /**
   * Find shortest path visiting all specified locations
   * Uses Dijkstra + TSP approximation for multiple destinations
   */
  findOptimalPickingPath(
    startLocation: Location,
    destinationLocations: Location[]
  ): PathResult {
    const startTime = performance.now();
    let comparisons = 0;

    // Find indices of locations
    const startIndex = this.findLocationIndex(startLocation);
    const destIndices = destinationLocations.map(loc => this.findLocationIndex(loc));
    
    if (startIndex === -1 || destIndices.includes(-1)) {
      throw new Error('Invalid location specified');
    }

    // Use nearest neighbor heuristic for TSP approximation
    const path: number[] = [startIndex];
    const visited = new Set<number>([startIndex]);
    const visitedNodes: number[] = [startIndex];
    let totalDistance = 0;
    let currentLocation = startIndex;

    // Visit all destination locations using nearest neighbor
    while (visited.size <= destIndices.length) {
      let nearestLocation = -1;
      let nearestDistance = Infinity;

      // Find nearest unvisited destination
      for (const destIndex of destIndices) {
        comparisons++;
        
        if (!visited.has(destIndex)) {
          const distance = this.dijkstra(currentLocation, destIndex).distance;
          
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestLocation = destIndex;
          }
        }
      }

      if (nearestLocation !== -1) {
        // Find shortest path to nearest location
        const result = this.dijkstra(currentLocation, nearestLocation);
        
        // Add path nodes (excluding start which is already in path)
        path.push(...result.path.slice(1));
        visitedNodes.push(...result.visitedNodes);
        totalDistance += result.distance;
        
        visited.add(nearestLocation);
        currentLocation = nearestLocation;
      } else {
        break;
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      path,
      totalDistance,
      visitedNodes,
      performance: {
        algorithm: "Dijkstra's Algorithm",
        operation: 'Shortest Path Finding',
        dataSize: this.locations.length,
        executionTime,
        comparisons
      }
    };
  }

  /**
   * Standard Dijkstra's algorithm implementation
   * Finds shortest path between two nodes
   */
  private dijkstra(start: number, end: number): { path: number[], distance: number, visitedNodes: number[] } {
    const n = this.graph.length;
    const distances: number[] = Array(n).fill(Infinity);
    const previous: (number | null)[] = Array(n).fill(null);
    const visited: boolean[] = Array(n).fill(false);
    const visitedNodes: number[] = [];

    distances[start] = 0;

    for (let i = 0; i < n; i++) {
      // Find unvisited node with minimum distance
      let minDistance = Infinity;
      let currentNode = -1;

      for (let j = 0; j < n; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j];
          currentNode = j;
        }
      }

      if (currentNode === -1) break;

      visited[currentNode] = true;
      visitedNodes.push(currentNode);

      // Stop if we reached the destination
      if (currentNode === end) break;

      // Update distances to neighbors
      for (let neighbor = 0; neighbor < n; neighbor++) {
        if (!visited[neighbor] && this.graph[currentNode][neighbor] !== Infinity) {
          const newDistance = distances[currentNode] + this.graph[currentNode][neighbor];
          
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = currentNode;
          }
        }
      }
    }

    // Reconstruct path
    const path: number[] = [];
    let current: number | null = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return {
      path,
      distance: distances[end],
      visitedNodes
    };
  }

  /**
   * Calculate Manhattan distance between two warehouse locations
   */
  private calculateDistance(loc1: Location, loc2: Location): number {
    // Convert aisle letters to numbers (A=1, B=2, C=3, etc.)
    const aisle1 = loc1.aisle.charCodeAt(0) - 64;
    const aisle2 = loc2.aisle.charCodeAt(0) - 64;

    // Manhattan distance in warehouse grid
    const aisleDistance = Math.abs(aisle1 - aisle2) * 10; // 10 units between aisles
    const shelfDistance = Math.abs(loc1.shelf - loc2.shelf) * 5; // 5 units between shelves
    const positionDistance = Math.abs(loc1.position - loc2.position) * 2; // 2 units between positions

    return aisleDistance + shelfDistance + positionDistance;
  }

  /**
   * Find index of location in the locations array
   */
  private findLocationIndex(location: Location): number {
    return this.locations.findIndex(loc => 
      loc.aisle === location.aisle && 
      loc.shelf === location.shelf && 
      loc.position === location.position
    );
  }

  /**
   * Get location by index
   */
  getLocationByIndex(index: number): Location | null {
    return this.locations[index] || null;
  }

  /**
   * Get all locations
   */
  getAllLocations(): Location[] {
    return [...this.locations];
  }
}
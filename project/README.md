# DAA-Based Smart Warehouse Management System

A comprehensive warehouse management system built for academic purposes, demonstrating practical applications of Design and Analysis of Algorithms (DAA) concepts.

## 🎯 Project Overview

This project implements a full-featured Warehouse Management System (WMS) that showcases how core algorithms from DAA can be applied to solve real-world problems in warehouse operations. The system provides an intuitive web interface with advanced algorithmic optimizations for inventory management, space allocation, and route planning.

## 🚀 Features

### Core Modules

1. **Admin Dashboard**
   - Real-time warehouse statistics and metrics
   - Low stock alerts and notifications
   - Algorithm performance monitoring
   - Recent activity tracking

2. **Inventory Management**
   - Complete CRUD operations for inventory items
   - Algorithmic sorting using Merge Sort and Quick Sort
   - Real-time performance comparison
   - Low stock detection and alerts

3. **Advanced Search**
   - Binary Search implementation for sorted data
   - Hash Map search for O(1) average case performance
   - Performance metrics and comparison
   - Partial matching and fuzzy search

4. **Space Optimization**
   - Greedy Best-Fit algorithm for space allocation
   - 0/1 Knapsack algorithm for value optimization
   - Visual warehouse layout representation
   - Efficiency metrics and recommendations

5. **Route Optimization**
   - Dijkstra's algorithm for shortest path calculation
   - Order picking route optimization
   - Interactive warehouse grid visualization
   - Performance analysis and metrics

6. **Comprehensive Reporting**
   - Low stock analysis and alerts
   - Space utilization reports
   - Item aging analysis
   - Data visualization with charts and graphs

## 🧮 Algorithms Implemented

| Feature | Algorithm | Time Complexity | Space Complexity |
|---------|-----------|----------------|------------------|
| Inventory Sorting | Merge Sort | O(n log n) | O(n) |
| Inventory Sorting | Quick Sort | O(n log n) avg | O(log n) |
| Item Search | Binary Search | O(log n) | O(1) |
| Item Search | Hash Map | O(1) avg | O(n) |
| Space Allocation | Greedy Best-Fit | O(n log n) | O(1) |
| Value Optimization | 0/1 Knapsack | O(nW) | O(nW) |
| Route Planning | Dijkstra's Algorithm | O((V + E) log V) | O(V) |

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: Local Storage (simulating database)

## 📁 Project Structure

```
src/
├── algorithms/           # Algorithm implementations
│   ├── sorting.ts       # Merge Sort & Quick Sort
│   ├── searching.ts     # Binary Search & Hash Map
│   ├── spaceOptimization.ts # Greedy & Knapsack
│   └── dijkstra.ts      # Dijkstra's Algorithm
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Inventory.tsx    # Inventory management
│   ├── Search.tsx       # Search functionality
│   ├── SpaceOptimization.tsx # Space allocation
│   ├── RouteOptimization.tsx # Route planning
│   ├── Reports.tsx      # Analytics & reports
│   └── Layout.tsx       # Main layout
├── data/               # Sample data
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── App.tsx             # Main application
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd warehouse-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📊 Algorithm Analysis

### Sorting Algorithms

**Merge Sort**
- **Time Complexity**: O(n log n) - Consistent performance
- **Space Complexity**: O(n) - Requires additional memory
- **Stability**: Stable sorting algorithm
- **Best Use Case**: Large datasets requiring consistent performance

**Quick Sort**
- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n) - In-place sorting
- **Stability**: Not stable
- **Best Use Case**: General-purpose sorting with good average performance

### Search Algorithms

**Binary Search**
- **Time Complexity**: O(log n)
- **Space Complexity**: O(1)
- **Prerequisite**: Sorted data
- **Best Use Case**: Searching in sorted datasets

**Hash Map Search**
- **Time Complexity**: O(1) average case
- **Space Complexity**: O(n)
- **Prerequisite**: Hash table construction
- **Best Use Case**: Frequent searches with fast lookup requirements

### Optimization Algorithms

**Greedy Best-Fit**
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Approach**: Local optimization
- **Best Use Case**: Space allocation with good practical results

**0/1 Knapsack**
- **Time Complexity**: O(nW) where W is capacity
- **Space Complexity**: O(nW)
- **Approach**: Dynamic programming for optimal solution
- **Best Use Case**: Value optimization with weight constraints

**Dijkstra's Algorithm**
- **Time Complexity**: O((V + E) log V) with priority queue
- **Space Complexity**: O(V)
- **Approach**: Greedy shortest path algorithm
- **Best Use Case**: Finding shortest paths in weighted graphs

## 🎓 Academic Features

### Algorithm Performance Monitoring
- Real-time execution time measurement
- Comparison metrics (comparisons, swaps)
- Visual performance indicators
- Complexity analysis display

### Educational Documentation
- Comprehensive code comments
- Algorithm complexity annotations
- Step-by-step execution visualization
- Performance comparison tools

### Sample Data
- Pre-populated inventory items
- Realistic warehouse scenarios
- Test cases for algorithm validation
- Performance benchmarking data

## 📈 Usage Examples

### Inventory Sorting
1. Navigate to the Inventory module
2. Select sorting criteria (name, quantity, price, etc.)
3. Choose algorithm (Merge Sort or Quick Sort)
4. View performance metrics and sorted results

### Advanced Search
1. Go to the Search module
2. Enter search term and select search field
3. Choose algorithm (Binary Search or Hash Map)
4. Compare execution times and results

### Space Optimization
1. Access the Space Optimization module
2. Select items for allocation
3. Choose algorithm (Greedy or Knapsack)
4. View optimal allocation results

### Route Planning
1. Open the Route Optimization module
2. Set starting location
3. Select items to collect
4. Calculate optimal picking route using Dijkstra's algorithm

## 🔧 Configuration

The system uses local storage to persist data between sessions. To reset to sample data, use the reset functionality in the dashboard.

## 📝 Report Generation

The system can generate detailed reports in text format including:
- Inventory overview and statistics
- Low stock alerts and recommendations
- Space utilization analysis
- Item aging reports

## 🤝 Contributing

This is an academic project. For educational purposes, you can:
1. Fork the repository
2. Implement additional algorithms
3. Add new features or optimizations
4. Submit pull requests with improvements

## 📄 License

This project is created for educational purposes as part of a Design and Analysis of Algorithms course.

## 🎯 Learning Objectives

By studying this project, students will understand:
- Practical applications of sorting algorithms
- Search algorithm implementation and optimization
- Dynamic programming concepts (Knapsack problem)
- Graph algorithms (Dijkstra's shortest path)
- Algorithm complexity analysis
- Performance measurement and comparison
- Real-world problem-solving with algorithms

## 📞 Support

For questions about the algorithms or implementation details, please refer to the comprehensive code comments and documentation within each algorithm file.

---

**Note**: This project is designed for educational purposes and demonstrates algorithmic concepts in a practical warehouse management context. The implementations prioritize clarity and educational value while maintaining production-quality code standards.
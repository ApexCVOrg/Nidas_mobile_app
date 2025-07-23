export interface TopSellingProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface SalesChart {
  labels: string[];
  data: number[];
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
  topSellingProducts: TopSellingProduct[];
  recentOrders: any[];
  salesChart: SalesChart;
}

export interface ProductAnalytics {
  total: number;
  categories: Array<{
    name: string;
    count: number;
  }>;
  lowStock: Array<{
    id: string;
    name: string;
    stock: number;
    threshold: number;
  }>;
}

export interface CustomerAnalytics {
  total: number;
  newThisMonth: number;
  activeUsers: number;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    orders: number;
  }>;
}

export const mockAnalytics = {
  dashboard: {
    totalSales: 156000000,
    totalOrders: 89,
    totalCustomers: 156,
    totalProducts: 234,
    monthlyGrowth: 12.5,
    topSellingProducts: [
      { id: 'p006', name: 'ULTRABOOST 22', sales: 15, revenue: 63000000 },
      { id: 'p008', name: 'ADIDAS ORIGINALS', sales: 12, revenue: 14400000 },
      { id: 'p007', name: 'STAN SMITH', sales: 8, revenue: 22400000 }
    ],
    recentOrders: [], // Will be populated from orders data
    salesChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000]
    }
  },
  products: {
    total: 234,
    categories: [
      { name: 'Men', count: 89 },
      { name: 'Women', count: 76 },
      { name: 'Kids', count: 45 },
      { name: 'Sport', count: 24 }
    ],
    lowStock: [
      { id: 'p007', name: 'STAN SMITH', stock: 2, threshold: 5 },
      { id: 'p010', name: 'TERREX', stock: 1, threshold: 3 }
    ]
  },
  customers: {
    total: 156,
    newThisMonth: 23,
    activeUsers: 89,
    topCustomers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', totalSpent: 6600000, orders: 2 },
      { id: '4', name: 'Jane Smith', email: 'jane@example.com', totalSpent: 4200000, orders: 1 }
    ]
  }
}; 
import { mockAnalytics } from '../mockData/analytics';
import { mockOrders } from '../mockData/orders';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AnalyticsApiService {
  // Get dashboard stats
  async getDashboardStats() {
    await delay(500);
    
    // Populate recent orders from mock data
    const dashboardStats = {
      ...mockAnalytics.dashboard,
      recentOrders: mockOrders.slice(0, 5)
    };
    
    return {
      success: true,
      data: dashboardStats
    };
  }

  // Get product analytics
  async getProductAnalytics() {
    await delay(400);
    
    return {
      success: true,
      data: mockAnalytics.products
    };
  }

  // Get customer analytics
  async getCustomerAnalytics() {
    await delay(400);
    
    return {
      success: true,
      data: mockAnalytics.customers
    };
  }

  // Get sales chart
  async getSalesChart(period: string = 'monthly') {
    await delay(300);
    
    return {
      success: true,
      data: mockAnalytics.dashboard.salesChart
    };
  }

  // Get revenue analytics
  async getRevenueAnalytics() {
    await delay(400);
    
    const totalRevenue = mockOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    const monthlyRevenue = mockAnalytics.dashboard.salesChart.data;
    const averageOrderValue = totalRevenue / mockOrders.filter(o => o.status === 'completed').length || 0;
    
    return {
      success: true,
      data: {
        totalRevenue,
        monthlyRevenue,
        averageOrderValue,
        growthRate: mockAnalytics.dashboard.monthlyGrowth
      }
    };
  }

  // Get inventory analytics
  async getInventoryAnalytics() {
    await delay(300);
    
    return {
      success: true,
      data: {
        totalProducts: mockAnalytics.products.total,
        lowStockItems: mockAnalytics.products.lowStock,
        categoryDistribution: mockAnalytics.products.categories,
        stockAlerts: mockAnalytics.products.lowStock.length
      }
    };
  }

  // Get user analytics
  async getUserAnalytics() {
    await delay(300);
    
    return {
      success: true,
      data: {
        totalUsers: mockAnalytics.customers.total,
        newUsers: mockAnalytics.customers.newThisMonth,
        activeUsers: mockAnalytics.customers.activeUsers,
        topCustomers: mockAnalytics.customers.topCustomers
      }
    };
  }
} 
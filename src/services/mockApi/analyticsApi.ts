import { mockAnalytics } from '../mockData/analytics';
import { mockOrders } from '../mockData/orders';
import api from '../../api/axiosInstance';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AnalyticsApiService {
  // Get dashboard stats
  async getDashboardStats() {
    await delay(500);
    // Lấy recent orders từ json-server
    const response = await api.get('/orders');
    const allOrders: any[] = response.data;
    // Sắp xếp theo ngày tạo mới nhất
    allOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Lấy 5 đơn hàng gần nhất
    const recentOrders = allOrders.slice(0, 5);
    const dashboardStats = {
      ...mockAnalytics.dashboard,
      recentOrders
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
      data: {
        ...mockAnalytics.products,
        topSellingProducts: mockAnalytics.dashboard.topSellingProducts
      }
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
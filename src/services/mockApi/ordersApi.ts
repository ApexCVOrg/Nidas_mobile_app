import { mockOrders, MockOrder } from '../mockData/orders';
import api from '../../api/axiosInstance';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class OrdersApiService {
  // Get all orders từ json-server
  async getOrders(params?: any) {
    const response = await api.get('/orders');
    let orders = response.data;
    return {
      success: true,
      data: {
        orders,
        total: orders.length,
        page: 1,
        limit: orders.length,
        totalPages: 1
      }
    };
  }

  // Get order by ID
  async getOrderById(id: string) {
    await delay(200);
    
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    return {
      success: true,
      data: order
    };
  }

  // Create new order
  async createOrder(orderData: any) {
    await delay(500);
    
    const newOrder: MockOrder = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    
    return {
      success: true,
      data: newOrder
    };
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
    // PATCH /orders/:id
    const response = await api.patch(`/orders/${orderId}`, { status });
    return {
      success: true,
      data: response.data,
    };
  }

  // Get user orders
  async getUserOrders(userId: string) {
    await delay(300);
    
    const userOrders = mockOrders.filter(o => o.userId === userId);
    
    return {
      success: true,
      data: {
        orders: userOrders,
        total: userOrders.length
      }
    };
  }

  // Get order statistics
  async getOrderStats() {
    await delay(300);
    
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
    const completedOrders = mockOrders.filter(o => o.status === 'completed').length;
    const cancelledOrders = mockOrders.filter(o => o.status === 'cancelled').length;
    
    const totalRevenue = mockOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue: totalRevenue / completedOrders || 0
      }
    };
  }
} 
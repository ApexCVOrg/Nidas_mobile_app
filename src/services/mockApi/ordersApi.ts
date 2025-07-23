import { mockOrders, MockOrder } from '../mockData/orders';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class OrdersApiService {
  // Get all orders
  async getOrders(params?: any) {
    await delay(400);
    
    let orders = [...mockOrders];
    
    if (params?.userId) {
      orders = orders.filter(o => o.userId === params.userId);
    }
    
    if (params?.status) {
      orders = orders.filter(o => o.status === params.status);
    }
    
    if (params?.dateFrom) {
      orders = orders.filter(o => new Date(o.createdAt) >= new Date(params.dateFrom));
    }
    
    if (params?.dateTo) {
      orders = orders.filter(o => new Date(o.createdAt) <= new Date(params.dateTo));
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        orders: paginatedOrders,
        total: orders.length,
        page,
        limit,
        totalPages: Math.ceil(orders.length / limit)
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
    await delay(300);
    
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    order.status = status;
    
    return {
      success: true,
      data: order
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
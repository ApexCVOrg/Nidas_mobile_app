import { mockUsers, MockUser } from './users';
import { mockOrders, MockOrder } from './orders';

// Simulate database storage
export class MockDatabase {
  private static instance: MockDatabase;
  private users: MockUser[] = [...mockUsers];
  private orders: MockOrder[] = [...mockOrders];

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // User operations
  async saveUser(user: MockUser): Promise<void> {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    console.log('💾 Mock DB: User saved:', user.email);
  }

  async getUserById(id: string): Promise<MockUser | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async getAllUsers(): Promise<MockUser[]> {
    return [...this.users];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      console.log('🗑️ Mock DB: User deleted:', id);
      return true;
    }
    return false;
  }

  // Order operations
  async saveOrder(order: MockOrder): Promise<void> {
    const existingIndex = this.orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      this.orders[existingIndex] = order;
    } else {
      this.orders.push(order);
    }
    console.log('💾 Mock DB: Order saved:', order.id);
  }

  async getOrderById(id: string): Promise<MockOrder | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async getAllOrders(): Promise<MockOrder[]> {
    return [...this.orders];
  }

  async getOrdersByUserId(userId: string): Promise<MockOrder[]> {
    return this.orders.filter(o => o.userId === userId);
  }

  async deleteOrder(id: string): Promise<boolean> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index >= 0) {
      this.orders.splice(index, 1);
      console.log('🗑️ Mock DB: Order deleted:', id);
      return true;
    }
    return false;
  }

  // Export data (for backup/sync purposes)
  async exportData() {
    return {
      users: this.users,
      orders: this.orders,
      timestamp: new Date().toISOString()
    };
  }

  // Import data (for restore purposes)
  async importData(data: { users: MockUser[], orders: MockOrder[] }) {
    this.users = [...data.users];
    this.orders = [...data.orders];
    console.log('📥 Mock DB: Data imported successfully');
  }
}

// Export singleton instance
export const mockDatabase = MockDatabase.getInstance(); 
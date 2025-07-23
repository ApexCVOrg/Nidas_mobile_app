import { mockUsers, MockUser } from '../mockData/users';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UsersApiService {
  // Get all users
  async getUsers(params?: any) {
    await delay(400);
    
    let users = mockUsers.filter(u => u.role !== 'admin'); // Don't show admin users
    
    if (params?.role) {
      users = users.filter(u => u.role === params.role);
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        users: paginatedUsers,
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit)
      }
    };
  }

  // Get user by ID
  async getUserById(id: string) {
    await delay(200);
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: user
    };
  }

  // Create new user
  async createUser(userData: any) {
    await delay(500);
    
    const newUser: MockUser = {
      id: (mockUsers.length + 1).toString(),
      ...userData,
      role: userData.role || 'user'
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: newUser
    };
  }

  // Update user
  async updateUser(id: string, userData: any) {
    await delay(400);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData
    };
    
    return {
      success: true,
      data: mockUsers[userIndex]
    };
  }

  // Delete user
  async deleteUser(id: string) {
    await delay(300);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);
    
    return {
      success: true,
      data: deletedUser
    };
  }

  // Get user statistics
  async getUserStats() {
    await delay(300);
    
    const totalUsers = mockUsers.length;
    const userCount = mockUsers.filter(u => u.role === 'user').length;
    const managerCount = mockUsers.filter(u => u.role === 'manager').length;
    const adminCount = mockUsers.filter(u => u.role === 'admin').length;
    
    return {
      success: true,
      data: {
        totalUsers,
        userCount,
        managerCount,
        adminCount,
        roleDistribution: {
          user: userCount,
          manager: managerCount,
          admin: adminCount
        }
      }
    };
  }
} 
import { mockUsers, MockUser } from '../mockData/users';
import api from '../../api/axiosInstance';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UsersApiService {
  // Get all users từ json-server
  async getUsers(params?: any) {
    const response = await api.get('/users');
    let users = response.data;
    return {
      success: true,
      data: {
        users,
        total: users.length,
        page: 1,
        limit: users.length,
        totalPages: 1
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
    // PATCH /users/:id (id có thể là chuỗi)
    const response = await api.patch(`/users/${id}`, userData);
    return {
      success: true,
      data: response.data,
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
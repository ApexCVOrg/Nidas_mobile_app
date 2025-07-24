// Import utility function để cập nhật JSON
import { addUserAndUpdateJson, addAddressAndUpdateJson } from './jsonUpdater';
import { updateAllJsonFiles } from './updateJsonFiles';

export interface MockUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'manager' | 'admin';
  avatar: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isBanned?: boolean;
}

export interface MockAddress {
  id: string;
  userId: string;
  recipientName: string;
  addressNumber?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'user',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    phone: '0123456789',
    role: 'user',
    avatar: 'default-avatar.svg',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'manager',
    name: 'Store Manager',
    email: 'manager@example.com',
    password: 'manager123',
    phone: '0987654321',
    role: 'manager',
    avatar: 'default-avatar.svg',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    username: 'admin',
    name: 'System Admin',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '0555666777',
    role: 'admin',
    avatar: 'default-avatar.svg',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAddresses: MockAddress[] = [
  {
    id: '1',
    userId: '1',
    recipientName: 'Regular User',
    street: '123 Main Street',
    city: 'Ho Chi Minh City',
    state: 'Ho Chi Minh',
    country: 'Vietnam',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    recipientName: 'Store Manager',
    street: '456 Business Ave',
    city: 'Ha Noi',
    state: 'Ha Noi',
    country: 'Vietnam',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    userId: '3',
    recipientName: 'System Admin',
    street: '789 Admin Blvd',
    city: 'Da Nang',
    state: 'Da Nang',
    country: 'Vietnam',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
  ];

// Function to add new user to mockUsers array
export const addMockUser = (userData: {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'user' | 'manager' | 'admin';
  avatar?: string;
}) => {
  console.log('🔍 Mock: addMockUser called with:', userData.email);
  
  // Thêm user vào array
  const newUser: MockUser = {
    id: (mockUsers.length + 1).toString(),
    username: userData.username,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    role: userData.role || 'user',
    avatar: userData.avatar || 'default-avatar.svg',
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  console.log('✅ Mock: User added to mockUsers array:', newUser.email);
  
  // Cập nhật tất cả file JSON
  try {
    updateAllJsonFiles();
    console.log('📁 Mock: JSON files updated successfully');
  } catch (error) {
    console.error('❌ Mock: Error updating JSON files:', error);
  }
  
  return newUser;
};

// Function to add new address to mockAddresses array
export const addMockAddress = (addressData: {
  userId: string;
  recipientName: string;
  addressNumber?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}) => {
  console.log('🔍 Mock: addMockAddress called for user:', addressData.userId);
  
  // Thêm address vào array
  const newAddress: MockAddress = {
    id: (mockAddresses.length + 1).toString(),
    userId: addressData.userId,
    recipientName: addressData.recipientName,
    addressNumber: addressData.addressNumber,
    street: addressData.street,
    city: addressData.city,
    state: addressData.state,
    country: addressData.country,
    isDefault: addressData.isDefault || false,
    createdAt: new Date().toISOString()
  };
  
  mockAddresses.push(newAddress);
  console.log('✅ Mock: Address added to mockAddresses array for user:', addressData.userId);
  
  // Cập nhật tất cả file JSON
  try {
    updateAllJsonFiles();
    console.log('📁 Mock: JSON files updated successfully');
  } catch (error) {
    console.error('❌ Mock: Error updating JSON files:', error);
  }
  
  return newAddress;
};

// Function to find user by email
export const findMockUserByEmail = (email: string) => {
  return mockUsers.find(user => user.email === email);
};

// Function to find user by username
export const findMockUserByUsername = (username: string) => {
  return mockUsers.find(user => user.username === username);
};

// Function to find user by id
export const findMockUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

// Function to find addresses by user id
export const findMockAddressesByUserId = (userId: string) => {
  return mockAddresses.filter(address => address.userId === userId);
};

// Function to verify user email
export const verifyMockUserEmail = (email: string) => {
  const user = findMockUserByEmail(email);
  if (user) {
    user.isEmailVerified = true;
    user.updatedAt = new Date().toISOString();
    console.log('📁 Mock: Email verified for user:', email);
    return true;
  }
  return false;
};

// Function to update user
export const updateMockUser = (id: string, updates: Partial<MockUser>) => {
  const user = findMockUserById(id);
  if (user) {
    Object.assign(user, updates);
    user.updatedAt = new Date().toISOString();
    console.log('📁 Mock: User updated:', user.email);
    return user;
  }
  return null;
};

// Function to get all users (for admin)
export const getAllMockUsers = () => {
  return mockUsers.map(user => ({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }));
};

// Function to get user statistics
export const getMockUserStats = () => {
  const totalUsers = mockUsers.length;
  const verifiedUsers = mockUsers.filter(user => user.isEmailVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const userRoles = mockUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalUsers,
    verifiedUsers,
    unverifiedUsers,
    userRoles
  };
};

// File operations for persistent storage
export const saveMockDataToFile = async () => {
  try {
    const data = {
      users: mockUsers,
      addresses: mockAddresses
    };
    
    // In React Native, we can't directly write to files
    // So we'll use AsyncStorage or just log the data
    console.log('📁 Mock: Data saved to memory (would save to file in real app)');
    console.log('📁 Mock: Current users count:', mockUsers.length);
    console.log('📁 Mock: Current addresses count:', mockAddresses.length);
    
    // For development, you can copy this data to mockData.json manually
    console.log('📁 Mock: Copy this data to mockData.json:');
    console.log(JSON.stringify(data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Mock: Failed to save data:', error);
    return false;
  }
};

export const loadMockDataFromFile = async () => {
  try {
    // In React Native, we can't directly read files
    // So we'll use the static data from mockData.json
    console.log('📁 Mock: Loading data from static file');
    return true;
  } catch (error) {
    console.error('❌ Mock: Failed to load data:', error);
    return false;
  }
}; 
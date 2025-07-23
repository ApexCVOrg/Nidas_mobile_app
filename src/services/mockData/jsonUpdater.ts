import { mockUsers, mockAddresses } from './users';
import { mockOrders } from './orders';

// Interface để định nghĩa cấu trúc dữ liệu JSON
interface MockDataStructure {
  users: any[];
  addresses: any[];
  orders: any[];
  analytics?: any;
  metadata?: {
    lastUpdated: string;
    version: string;
    description: string;
  };
}

// Function để cập nhật tất cả file JSON
export const updateAllJsonFiles = () => {
  const currentData: MockDataStructure = {
    users: [...mockUsers],
    addresses: [...mockAddresses],
    orders: [...mockOrders],
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
      description: "Dữ liệu mock được cập nhật tự động"
    }
  };

  // Log để copy vào file JSON
  console.log('📁 Mock: Cập nhật dữ liệu JSON - Copy dữ liệu sau vào các file JSON:');
  console.log('=== USERS.JSON ===');
  console.log(JSON.stringify({ users: currentData.users, addresses: currentData.addresses }, null, 2));
  
  console.log('=== ORDERS.JSON ===');
  console.log(JSON.stringify({ orders: currentData.orders }, null, 2));
  
  console.log('=== ALL-MOCK-DATA.JSON ===');
  console.log(JSON.stringify(currentData, null, 2));

  return currentData;
};

// Function để thêm user mới và cập nhật JSON
export const addUserAndUpdateJson = (userData: {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'user' | 'manager' | 'admin';
  avatar?: string;
}) => {
  // Thêm user vào array
  const newUser = {
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
  
  // Cập nhật JSON
  updateAllJsonFiles();
  
  console.log('✅ Mock: User mới đã được thêm và JSON đã được cập nhật:', newUser.email);
  return newUser;
};

// Function để thêm address mới và cập nhật JSON
export const addAddressAndUpdateJson = (addressData: {
  userId: string;
  recipientName: string;
  addressNumber?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}) => {
  // Thêm address vào array
  const newAddress = {
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
  
  // Cập nhật JSON
  updateAllJsonFiles();
  
  console.log('✅ Mock: Address mới đã được thêm và JSON đã được cập nhật cho user:', addressData.userId);
  return newAddress;
};

// Function để thêm order mới và cập nhật JSON
export const addOrderAndUpdateJson = (orderData: {
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
}) => {
  // Thêm order vào array
  const newOrder = {
    id: `order_${mockOrders.length + 1}`,
    userId: orderData.userId,
    items: orderData.items,
    total: orderData.total,
    status: orderData.status,
    createdAt: new Date().toISOString(),
    shippingAddress: orderData.shippingAddress
  };
  
  mockOrders.push(newOrder);
  
  // Cập nhật JSON
  updateAllJsonFiles();
  
  console.log('✅ Mock: Order mới đã được thêm và JSON đã được cập nhật:', newOrder.id);
  return newOrder;
};

// Function để xóa user và cập nhật JSON
export const deleteUserAndUpdateJson = (userId: string) => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex >= 0) {
    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    
    // Xóa addresses của user
    const addressIndices = mockAddresses
      .map((address, index) => address.userId === userId ? index : -1)
      .filter(index => index >= 0)
      .reverse(); // Đảo ngược để xóa từ cuối lên đầu
    
    addressIndices.forEach(index => {
      mockAddresses.splice(index, 1);
    });
    
    // Cập nhật JSON
    updateAllJsonFiles();
    
    console.log('🗑️ Mock: User đã được xóa và JSON đã được cập nhật:', deletedUser.email);
    return deletedUser;
  }
  return null;
};

// Function để cập nhật user và cập nhật JSON
export const updateUserAndUpdateJson = (userId: string, updates: any) => {
  const user = mockUsers.find(user => user.id === userId);
  if (user) {
    Object.assign(user, updates);
    user.updatedAt = new Date().toISOString();
    
    // Cập nhật JSON
    updateAllJsonFiles();
    
    console.log('✏️ Mock: User đã được cập nhật và JSON đã được cập nhật:', user.email);
    return user;
  }
  return null;
};

// Export các function để sử dụng
export default {
  updateAllJsonFiles,
  addUserAndUpdateJson,
  addAddressAndUpdateJson,
  addOrderAndUpdateJson,
  deleteUserAndUpdateJson,
  updateUserAndUpdateJson
}; 
import { mockUsers, mockAddresses } from './users';
import { mockOrders } from './orders';
import { mockAnalytics } from './analytics';

// Function để cập nhật tất cả file JSON
export const updateAllJsonFiles = () => {
  console.log('🔄 Mock: Bắt đầu cập nhật tất cả file JSON...');
  
  // Dữ liệu cho users.json
  const usersData = {
    users: mockUsers,
    addresses: mockAddresses
  };
  
  // Dữ liệu cho orders.json
  const ordersData = {
    orders: mockOrders
  };
  
  // Dữ liệu cho analytics.json
  const analyticsData = mockAnalytics;
  
  // Dữ liệu cho database.json
  const databaseData = {
    users: mockUsers,
    orders: mockOrders,
    timestamp: new Date().toISOString()
  };
  
  // Dữ liệu cho all-mock-data.json
  const allData = {
    users: mockUsers,
    addresses: mockAddresses,
    orders: mockOrders,
    analytics: mockAnalytics,
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
      description: "Dữ liệu mock được cập nhật tự động"
    }
  };
  
  // Log ra console để copy vào file
  console.log('\n📁 Mock: === USERS.JSON ===');
  console.log(JSON.stringify(usersData, null, 2));
  
  console.log('\n📁 Mock: === ORDERS.JSON ===');
  console.log(JSON.stringify(ordersData, null, 2));
  
  console.log('\n📁 Mock: === ANALYTICS.JSON ===');
  console.log(JSON.stringify(analyticsData, null, 2));
  
  console.log('\n📁 Mock: === DATABASE.JSON ===');
  console.log(JSON.stringify(databaseData, null, 2));
  
  console.log('\n📁 Mock: === ALL-MOCK-DATA.JSON ===');
  console.log(JSON.stringify(allData, null, 2));
  
  console.log('\n✅ Mock: Tất cả dữ liệu JSON đã được chuẩn bị!');
  console.log('📋 Mock: Copy dữ liệu trên và paste vào các file JSON tương ứng.');
  
  return {
    usersData,
    ordersData,
    analyticsData,
    databaseData,
    allData
  };
};

// Function để cập nhật file JSON cụ thể
export const updateSpecificJsonFile = (fileType: 'users' | 'orders' | 'analytics' | 'database' | 'all') => {
  console.log(`🔄 Mock: Cập nhật file ${fileType}.json...`);
  
  switch (fileType) {
    case 'users':
      const usersData = {
        users: mockUsers,
        addresses: mockAddresses
      };
      console.log('\n📁 Mock: === USERS.JSON ===');
      console.log(JSON.stringify(usersData, null, 2));
      return usersData;
      
    case 'orders':
      const ordersData = {
        orders: mockOrders
      };
      console.log('\n📁 Mock: === ORDERS.JSON ===');
      console.log(JSON.stringify(ordersData, null, 2));
      return ordersData;
      
    case 'analytics':
      console.log('\n📁 Mock: === ANALYTICS.JSON ===');
      console.log(JSON.stringify(mockAnalytics, null, 2));
      return mockAnalytics;
      
    case 'database':
      const databaseData = {
        users: mockUsers,
        orders: mockOrders,
        timestamp: new Date().toISOString()
      };
      console.log('\n📁 Mock: === DATABASE.JSON ===');
      console.log(JSON.stringify(databaseData, null, 2));
      return databaseData;
      
    case 'all':
      return updateAllJsonFiles();
      
    default:
      console.log('❌ Mock: Loại file không hợp lệ');
      return null;
  }
};

// Function để hiển thị thống kê dữ liệu hiện tại
export const showDataStats = () => {
  console.log('\n📊 Mock: Thống kê dữ liệu hiện tại:');
  console.log(`👥 Users: ${mockUsers.length}`);
  console.log(`📍 Addresses: ${mockAddresses.length}`);
  console.log(`📦 Orders: ${mockOrders.length}`);
  
  const userRoles = mockUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('👤 User roles:', userRoles);
  
  const verifiedUsers = mockUsers.filter(user => user.isEmailVerified).length;
  console.log(`✅ Verified users: ${verifiedUsers}/${mockUsers.length}`);
  
  return {
    totalUsers: mockUsers.length,
    totalAddresses: mockAddresses.length,
    totalOrders: mockOrders.length,
    userRoles,
    verifiedUsers
  };
};

// Export default
export default {
  updateAllJsonFiles,
  updateSpecificJsonFile,
  showDataStats
}; 
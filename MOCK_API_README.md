# 📱 Mock API Implementation Guide

## 🎯 **Tổng quan**

Dự án mobile app của bạn đã được tích hợp **Mock API** hoàn chỉnh để có thể chạy độc lập mà không cần backend server. Hệ thống bao gồm:

- ✅ **Mock API Service** với đầy đủ endpoints
- ✅ **Admin Dashboard** với analytics và quản lý
- ✅ **Manager Dashboard** với quản lý cửa hàng
- ✅ **Authentication** với role-based routing
- ✅ **Mock Data** cho products, orders, users

## 🚀 **Cách sử dụng**

### **1. Đăng nhập với các role khác nhau:**

```typescript
// Admin Account
Username: admin
Password: admin123

// Manager Account  
Username: manager
Password: manager123

// Regular User Account
Username: user
Password: password123
```

### **2. Chuyển đổi giữa Mock API và Real API:**

```typescript
// Trong src/services/mockApi.ts
const useMock = __DEV__; // Tự động sử dụng Mock trong development

// Để force sử dụng Mock API:
const useMock = true;

// Để sử dụng Real API:
const useMock = false;
```

## 📊 **Mock Data Structure**

### **Users Data:**
```json
{
  "id": "1",
  "email": "user@example.com",
  "username": "user",
  "role": "user|manager|admin",
  "name": "User Name"
}
```

### **Products Data:**
```json
{
  "id": "p006",
  "name": "ULTRABOOST 22",
  "price": "4.200.000đ",
  "category": "sport",
  "brand": "Adidas",
  "rating": 4.8
}
```

### **Orders Data:**
```json
{
  "id": "order_1",
  "userId": "1",
  "items": [...],
  "total": 4200000,
  "status": "pending|completed|cancelled",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## 🏢 **Admin Dashboard Features**

### **Overview Stats:**
- 📈 Total Sales: 156,000,000 VND
- 📦 Total Orders: 89
- 👥 Total Customers: 156
- 🛍️ Total Products: 234

### **Quick Actions:**
- 🛠️ Manage Products
- 📋 View Orders
- 👥 User Management
- 📊 Analytics

### **Analytics:**
- 📈 Sales Chart (Monthly data)
- 🏆 Top Selling Products
- 📦 Recent Orders
- 📊 Customer Analytics

## 🏪 **Manager Dashboard Features**

### **Store Management:**
- 📊 Today's Sales Overview
- ⚠️ Low Stock Alerts
- 📦 Pending Orders
- 🛍️ Active Products

### **Quick Actions:**
- 📋 Process Orders
- 📦 Inventory Management
- 💬 Customer Support
- 📊 Sales Report
- 🛠️ Product Management
- 👥 Staff Management

## 🔧 **API Endpoints Available**

### **Authentication:**
```typescript
// Login
await mockApi.login({ username, password })

// Register  
await mockApi.register(userData)
```

### **Products:**
```typescript
// Get all products
await mockApi.getProducts()

// Get product by ID
await mockApi.getProductById(id)

// Get products with filters
await mockApi.getProducts({ 
  category: 'sport',
  search: 'ultraboost',
  page: 1,
  limit: 20
})
```

### **Orders:**
```typescript
// Get all orders
await mockApi.getOrders()

// Get user orders
await mockApi.getOrders({ userId: '1' })

// Create new order
await mockApi.createOrder(orderData)
```

### **Analytics (Admin/Manager):**
```typescript
// Dashboard stats
await mockApi.getDashboardStats()

// Product analytics
await mockApi.getProductAnalytics()

// Customer analytics  
await mockApi.getCustomerAnalytics()

// Sales chart
await mockApi.getSalesChart('monthly')
```

### **User Management (Admin):**
```typescript
// Get all users
await mockApi.getUsers()

// Get user by ID
await mockApi.getUserById(id)
```

## 🎨 **UI Components**

### **Admin Dashboard:**
- 📊 Stat Cards với icons và colors
- 🎯 Quick Action Cards
- 📈 Top Selling Products list
- 📦 Recent Orders với status badges

### **Manager Dashboard:**
- ⚠️ Low Stock Alerts
- 📋 Order Processing interface
- 📦 Inventory Management
- 💬 Customer Support chat

## 🔄 **Navigation Flow**

```
Login Screen
├── Admin Login → AdminDashboard
│   ├── Dashboard Tab
│   ├── Products Tab  
│   ├── Orders Tab
│   ├── Users Tab
│   └── Analytics Tab
├── Manager Login → ManagerDashboard
│   ├── Dashboard Tab
│   ├── Inventory Tab
│   ├── Orders Tab
│   ├── Support Tab
│   └── Staff Tab
└── User Login → MainTabs
    ├── Home
    ├── Search
    ├── Favorites
    └── Cart
```

## 🛠️ **Development Tips**

### **1. Thêm Mock Data:**
```typescript
// Trong src/services/mockApi.ts
const mockNewData = [
  // Add your mock data here
];

// Thêm method mới
async getNewData() {
  return {
    success: true,
    data: mockNewData
  };
}
```

### **2. Customize Mock Responses:**
```typescript
// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add error simulation
if (Math.random() < 0.1) { // 10% error rate
  throw new Error('Network error');
}
```

### **3. Test Different Scenarios:**
```typescript
// Test empty data
const mockEmptyProducts = [];

// Test loading states
const mockLoadingDelay = 2000;

// Test error states
const mockErrorRate = 0.05; // 5% error rate
```

## 📱 **Testing Instructions**

### **1. Chạy ứng dụng:**
```bash
cd Nidas_mobile_app
npm start
```

### **2. Test các role:**
1. **Admin Login:**
   - Username: `admin`
   - Password: `admin123`
   - Kiểm tra Admin Dashboard

2. **Manager Login:**
   - Username: `manager` 
   - Password: `manager123`
   - Kiểm tra Manager Dashboard

3. **User Login:**
   - Username: `user`
   - Password: `password123`
   - Kiểm tra Main App

### **3. Test Features:**
- ✅ Dashboard analytics
- ✅ Product management
- ✅ Order processing
- ✅ User management
- ✅ Inventory alerts
- ✅ Customer support

## 🔮 **Future Enhancements**

### **Planned Features:**
- 📊 Real-time charts với Chart.js
- 🔔 Push notifications
- 📱 Offline support
- 🔄 Data synchronization
- 🎨 Custom themes
- 🌐 Multi-language support

### **Mock API Improvements:**
- 📈 More realistic data
- 🔄 Data persistence
- 🎲 Random data generation
- 📊 Advanced analytics
- 🔐 Role-based permissions

## 📞 **Support**

Nếu gặp vấn đề với Mock API:

1. **Check Console Logs:** Xem logs trong Metro bundler
2. **Verify Mock Data:** Kiểm tra data trong JSON files
3. **Test Network:** Đảm bảo không có network conflicts
4. **Clear Cache:** `npx expo start --clear`

---

**🎉 Chúc bạn phát triển thành công với Mock API!** 
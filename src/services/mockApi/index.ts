import { AuthApiService } from './authApi';
import { ProductsApiService } from './productsApi';
import { OrdersApiService } from './ordersApi';
import { AnalyticsApiService } from './analyticsApi';
import { UsersApiService } from './usersApi';

// Create singleton instances
export const authApi = new AuthApiService();
export const productsApi = new ProductsApiService();
export const ordersApi = new OrdersApiService();
export const analyticsApi = new AnalyticsApiService();
export const usersApi = new UsersApiService();

// Main Mock API class that combines all services
export class MockApiService {
  // Auth methods
  login = authApi.login.bind(authApi);
  register = authApi.register.bind(authApi);
  logout = authApi.logout.bind(authApi);
  getCurrentUser = authApi.getCurrentUser.bind(authApi);
  verifyEmail = authApi.verifyEmail.bind(authApi);
  forgotPassword = authApi.forgotPassword.bind(authApi);
  sendOtp = authApi.sendOtp.bind(authApi);

  // Products methods
  getProducts = productsApi.getProducts.bind(productsApi);
  getProductById = productsApi.getProductById.bind(productsApi);
  getCategories = productsApi.getCategories.bind(productsApi);
  getBrands = productsApi.getBrands.bind(productsApi);
  searchProducts = productsApi.searchProducts.bind(productsApi);
  getFeaturedProducts = productsApi.getFeaturedProducts.bind(productsApi);
  getProductsByCategory = productsApi.getProductsByCategory.bind(productsApi);
  updateProduct = productsApi.updateProduct.bind(productsApi);
  addProduct = productsApi.addProduct.bind(productsApi);
  deleteProduct = productsApi.deleteProduct.bind(productsApi);

  // Orders methods
  getOrders = ordersApi.getOrders.bind(ordersApi);
  getOrderById = ordersApi.getOrderById.bind(ordersApi);
  createOrder = ordersApi.createOrder.bind(ordersApi);
  updateOrderStatus = ordersApi.updateOrderStatus.bind(ordersApi);
  getUserOrders = ordersApi.getUserOrders.bind(ordersApi);
  getOrderStats = ordersApi.getOrderStats.bind(ordersApi);

  // Analytics methods
  getDashboardStats = analyticsApi.getDashboardStats.bind(analyticsApi);
  getProductAnalytics = analyticsApi.getProductAnalytics.bind(analyticsApi);
  getCustomerAnalytics = analyticsApi.getCustomerAnalytics.bind(analyticsApi);
  getSalesChart = analyticsApi.getSalesChart.bind(analyticsApi);
  getRevenueAnalytics = analyticsApi.getRevenueAnalytics.bind(analyticsApi);
  getInventoryAnalytics = analyticsApi.getInventoryAnalytics.bind(analyticsApi);
  getUserAnalytics = analyticsApi.getUserAnalytics.bind(analyticsApi);

  // Users methods
  getUsers = usersApi.getUsers.bind(usersApi);
  getUserById = usersApi.getUserById.bind(usersApi);
  createUser = usersApi.createUser.bind(usersApi);
  updateUser = usersApi.updateUser.bind(usersApi);
  deleteUser = usersApi.deleteUser.bind(usersApi);
  getUserStats = usersApi.getUserStats.bind(usersApi);

  // Home data
  async getHomeData() {
    const homeData = await import('../../api/homeData.json');
    return {
      success: true,
      data: homeData.default
    };
  }

  // Favorites (placeholder)
  async getFavorites(userId: string) {
    const categoryProducts = await import('../../api/categoryProducts.json');
    const favoriteProducts = categoryProducts.default.slice(0, 5);
    
    return {
      success: true,
      data: favoriteProducts
    };
  }

  async addToFavorites(userId: string, productId: string) {
    return {
      success: true,
      message: 'Product added to favorites'
    };
  }

  async removeFromFavorites(userId: string, productId: string) {
    return {
      success: true,
      message: 'Product removed from favorites'
    };
  }
}

// Export singleton instance
export const mockApi = new MockApiService();

// Export individual services for direct access if needed
export {
  AuthApiService,
  ProductsApiService,
  OrdersApiService,
  AnalyticsApiService,
  UsersApiService
}; 
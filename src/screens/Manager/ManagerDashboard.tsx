import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi/index';

const { width } = Dimensions.get('window');

interface ManagerStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<any>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    threshold: number;
  }>;
}

const ManagerDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, productResponse] = await Promise.all([
        mockApi.getDashboardStats(),
        mockApi.getProductAnalytics()
      ]);
      
      setStats({
        ...dashboardResponse.data,
        lowStockProducts: productResponse.data.lowStock
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
                        onPress: async () => {
                try {
                  await mockApi.logout();
                  // Navigate to auth screen
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' as never }],
                  });
                } catch (error) {
                  console.error('Logout error:', error);
                  Alert.alert('Error', 'Failed to logout');
                }
              },
        },
      ]
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color, onPress, subtitle }: any) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color="white" />
        </View>
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActionCard = ({ title, subtitle, icon, onPress, color, badge }: any) => (
    <TouchableOpacity style={[styles.actionCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.actionContent}>
        <View style={styles.actionIconContainer}>
          <Icon name={icon} size={28} color={color} />
          {badge && (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const LowStockItem = ({ product }: any) => (
    <View style={styles.lowStockItem}>
      <View style={styles.lowStockInfo}>
        <Text style={styles.lowStockName}>{product.name}</Text>
        <Text style={styles.lowStockDetails}>
          Stock: {product.stock} | Threshold: {product.threshold}
        </Text>
      </View>
      <View style={[styles.stockIndicator, { backgroundColor: product.stock === 0 ? '#f44336' : '#ff9800' }]}>
        <Text style={styles.stockText}>{product.stock}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading manager dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Manager Dashboard</Text>
          <Text style={styles.headerSubtitle}>Store Management</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle" size={40} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Today's Sales"
              value={formatCurrency(stats?.totalSales || 0)}
              subtitle={`+${stats?.monthlyGrowth || 0}% from last month`}
              icon="attach-money"
              color="#4CAF50"
              onPress={() => navigation.navigate('SalesReport' as never)}
            />
            <StatCard
              title="Pending Orders"
              value={stats?.recentOrders.filter((o: any) => o.status === 'pending').length || 0}
              icon="pending"
              color="#FF9800"
              onPress={() => navigation.navigate('OrderManagement' as never)}
            />
            <StatCard
              title="Low Stock Items"
              value={stats?.lowStockProducts.length || 0}
              icon="warning"
              color="#f44336"
              onPress={() => navigation.navigate('Inventory' as never)}
            />
            <StatCard
              title="Active Products"
              value={stats?.totalProducts || 0}
              icon="inventory"
              color="#2196F3"
              onPress={() => navigation.navigate('ProductManagement' as never)}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            <ActionCard
              title="Process Orders"
              subtitle="Review and process pending orders"
              icon="receipt"
              color="#2196F3"
              badge={stats?.recentOrders.filter((o: any) => o.status === 'pending').length || 0}
              onPress={() => navigation.navigate('OrderProcessing' as never)}
            />
            <ActionCard
              title="Inventory Management"
              subtitle="Check stock levels and reorder"
              icon="inventory-2"
              color="#FF9800"
              badge={stats?.lowStockProducts.length || 0}
              onPress={() => navigation.navigate('InventoryManagement' as never)}
            />
            <ActionCard
              title="Customer Support"
              subtitle="Handle customer inquiries and chat"
              icon="support-agent"
              color="#4CAF50"
              onPress={() => navigation.navigate('CustomerSupport' as never)}
            />
            <ActionCard
              title="Sales Report"
              subtitle="View detailed sales analytics"
              icon="analytics"
              color="#9C27B0"
              onPress={() => navigation.navigate('SalesAnalytics' as never)}
            />
            <ActionCard
              title="Product Management"
              subtitle="Add, edit, and manage products"
              icon="add-box"
              color="#607D8B"
              onPress={() => navigation.navigate('ProductManagement' as never)}
            />
            <ActionCard
              title="Staff Management"
              subtitle="Manage store staff and schedules"
              icon="people"
              color="#795548"
              onPress={() => navigation.navigate('StaffManagement' as never)}
            />
          </View>
        </View>

        {/* Low Stock Alert */}
        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Low Stock Alert</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Inventory' as never)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {stats.lowStockProducts.slice(0, 3).map((product) => (
              <LowStockItem key={product.id} product={product} />
            ))}
          </View>
        )}

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders' as never)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {stats?.recentOrders.slice(0, 3).map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.orderItems}>
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.orderStatus}>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'completed' ? '#4CAF50' : '#FF9800' }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Selling Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductAnalytics' as never)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {stats?.topSellingProducts.slice(0, 3).map((product, index) => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSales}>{product.sales} sold this month</Text>
              </View>
              <View style={styles.productRevenue}>
                <Text style={styles.revenueText}>{formatCurrency(product.revenue)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
  actionsList: {
    gap: 10,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  lowStockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lowStockInfo: {
    flex: 1,
  },
  lowStockName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  lowStockDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stockIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderItems: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productSales: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  revenueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default ManagerDashboard; 
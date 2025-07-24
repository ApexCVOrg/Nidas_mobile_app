import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi';

const ProductAnalytics: React.FC = () => {
  const navigation = useNavigation();
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTopSellingProducts = async () => {
    try {
      const response = await mockApi.getProductAnalytics();
      setTopSellingProducts(response.data.topSellingProducts || []);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      Alert.alert('Error', 'Failed to load product analytics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTopSellingProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Selling Products</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Performance</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{topSellingProducts.length}</Text>
              <Text style={styles.statLabel}>Total Products</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {topSellingProducts.reduce((sum, p) => sum + p.sales, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCurrency(topSellingProducts.reduce((sum, p) => sum + p.revenue, 0))}
              </Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Top Selling Products List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          {topSellingProducts.map((product, index) => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSales}>{product.sales} units sold</Text>
                <Text style={styles.productRevenue}>{formatCurrency(product.revenue)}</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="trending-up" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="visibility" size={20} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Trend</Text>
          <View style={styles.chartPlaceholder}>
            <Icon name="bar-chart" size={48} color="#2196F3" />
            <Text style={styles.placeholderText}>Sales Performance Chart</Text>
            <Text style={styles.placeholderSubtext}>Coming soon...</Text>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  productSales: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default ProductAnalytics; 
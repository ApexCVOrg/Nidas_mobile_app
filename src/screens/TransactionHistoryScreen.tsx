import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Transaction {
  id: string;
  txnRef: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  orderInfo: string;
  createdAt: string;
  bankCode?: string;
  bankTranNo?: string;
  responseCode?: string;
}

const TransactionHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Mock data - trong thực tế sẽ lấy từ database
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      txnRef: 'ORDER_1703123456789',
      amount: 4200000,
      status: 'success',
      orderInfo: 'Thanh toán đơn hàng #1703123456789',
      createdAt: '2024-01-15T10:30:00Z',
      bankCode: 'VCB',
      bankTranNo: '123456789',
      responseCode: '00',
    },
    {
      id: '2',
      txnRef: 'ORDER_1703123456790',
      amount: 1500000,
      status: 'pending',
      orderInfo: 'Thanh toán đơn hàng #1703123456790',
      createdAt: '2024-01-15T11:00:00Z',
    },
    {
      id: '3',
      txnRef: 'ORDER_1703123456791',
      amount: 2800000,
      status: 'failed',
      orderInfo: 'Thanh toán đơn hàng #1703123456791',
      createdAt: '2024-01-15T11:30:00Z',
      responseCode: '24',
    },
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // TODO: Thay thế bằng API call thực tế
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const queryTransaction = async (txnRef: string) => {
    try {
      const response = await fetch(`http://192.168.100.246:8000/api/payments/query/${txnRef}`);
      const data = await response.json();
      
      if (data.success) {
        Alert.alert(
          'Kết quả truy vấn',
          `Trạng thái: ${data.result.vnp_ResponseCode === '00' ? 'Thành công' : 'Thất bại'}\n` +
          `Mã giao dịch: ${data.result.vnp_TransactionNo || 'N/A'}\n` +
          `Ngân hàng: ${data.result.vnp_BankCode || 'N/A'}\n` +
          `Thời gian: ${data.result.vnp_PayDate || 'N/A'}`
        );
      } else {
        Alert.alert('Lỗi', 'Không thể truy vấn giao dịch');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không kết nối được server');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'failed': return '#e74c3c';
      case 'cancelled': return '#95a5a6';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Thành công';
      case 'pending': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => setSelectedTransaction(item)}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionId}>{item.txnRef}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.orderInfo} numberOfLines={2}>
        {item.orderInfo}
      </Text>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.amount}>{formatPrice(item.amount)}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>

      {item.bankCode && (
        <View style={styles.bankInfo}>
          <Text style={styles.bankText}>Ngân hàng: {item.bankCode}</Text>
          {item.bankTranNo && (
            <Text style={styles.bankText}>Mã GD: {item.bankTranNo}</Text>
          )}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.queryButton}
          onPress={() => queryTransaction(item.txnRef)}
        >
          <Ionicons name="search-outline" size={16} color="#0066CC" />
          <Text style={styles.queryButtonText}>Truy vấn</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải lịch sử giao dịch...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  refreshButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  transactionItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  orderInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  bankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bankText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  queryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  queryButtonText: {
    fontSize: 12,
    color: '#0066CC',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionHistoryScreen; 
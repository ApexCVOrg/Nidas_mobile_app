import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi';
// XÓA: import { Picker } from '@react-native-picker/picker';

const OrderManagement: React.FC = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await mockApi.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleEditStatus = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setModalVisible(true);
  };

  const handleSaveStatus = async () => {
    if (!editingOrder) return;
    try {
      await mockApi.updateOrderStatus(editingOrder.id, newStatus);
      setModalVisible(false);
      setEditingOrder(null);
      // Đợi update xong mới fetch lại đơn hàng
      await fetchOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleViewOrder = (order: any) => {
    setViewingOrder(order);
    setViewModalVisible(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderItem}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.orderItems}>
          {item.items.length} item{item.items.length > 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.orderStatus}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
      </View>
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleViewOrder(item)}>
          <Icon name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditStatus(item)}>
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '85%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Chỉnh sửa trạng thái đơn hàng</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              {['pending', 'completed', 'cancelled'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setNewStatus(status as 'pending' | 'completed' | 'cancelled')}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 5,
                    backgroundColor: newStatus === status ? '#4CAF50' : '#eee',
                    marginHorizontal: 4,
                  }}
                >
                  <Text style={{ color: newStatus === status ? '#fff' : '#333', fontWeight: 'bold' }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#666' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveStatus}>
                <View style={{ backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5 }}>
                  <Text style={{ color: '#fff' }}>Lưu</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Chi tiết đơn hàng</Text>
            {viewingOrder && (
              <>
                <Text>Mã đơn: {viewingOrder.id}</Text>
                <Text>Ngày tạo: {new Date(viewingOrder.createdAt).toLocaleString()}</Text>
                <Text>Trạng thái: {viewingOrder.status}</Text>
                <Text>Tổng tiền: {formatCurrency(viewingOrder.total)}</Text>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Sản phẩm:</Text>
                {viewingOrder.items.map((item: any, idx: number) => (
                  <Text key={idx}>
                    - {item.name} x{item.quantity} ({item.size}, {item.color}): {formatCurrency(item.price)}
                  </Text>
                ))}
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Người nhận:</Text>
                <Text>{viewingOrder.shippingAddress.fullName}</Text>
                <Text>{viewingOrder.shippingAddress.phone}</Text>
                <Text>{viewingOrder.shippingAddress.address}</Text>
              </>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Text style={{ color: '#2196F3' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  filterButton: {
    padding: 5,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
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
    marginRight: 10,
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
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default OrderManagement; 
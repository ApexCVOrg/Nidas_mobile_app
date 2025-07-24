import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';
import OfflineIndicator from '../../components/OfflineIndicator';
import { cacheData, getCachedData, checkNetworkStatus, getOfflineActions } from '../../utils/offlineSync';
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
  // Ref để lưu callback cho auto sync
  const fetchOrdersRef = useRef<(() => Promise<void>) | null>(null);

  // State cho modal xem thay đổi offline
  const [pendingChangesModalVisible, setPendingChangesModalVisible] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  const { syncStatus, performSync, addOfflineAction } = useOfflineSync();

  const fetchOrders = async () => {
    // Lưu reference để sử dụng cho auto sync
    fetchOrdersRef.current = fetchOrders;
    try {
      setLoading(true);
      
      // Kiểm tra kết nối mạng trước
      const isOnline = await checkNetworkStatus();
      
      // Try to get cached data first
      const cachedOrders = await getCachedData('orders_data');
      if (cachedOrders) {
        setOrders(cachedOrders);
      }

      // Chỉ fetch fresh data khi online
      if (isOnline) {
        try {
          const response = await mockApi.getOrders();
          const freshOrders = response.data.orders;
          setOrders(freshOrders);
          
          // Cache the fresh data
          await cacheData('orders_data', freshOrders);
        } catch (error) {
          console.error('Error fetching fresh data:', error);
          // Nếu fetch fresh data thất bại và không có cached data, hiển thị lỗi
          if (!cachedOrders) {
            Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng. Vui lòng kiểm tra kết nối mạng.');
          }
        }
      } else {
        // Khi offline, chỉ dùng cached data
        if (!cachedOrders) {
          Alert.alert('Không có dữ liệu', 'Không có dữ liệu cached. Vui lòng kết nối mạng để tải dữ liệu.');
        }
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Kiểm tra kết nối mạng trước khi refresh
    const isOnline = await checkNetworkStatus();
    if (!isOnline) {
      Alert.alert(
        'Không có kết nối mạng',
        'Không thể refresh dữ liệu khi offline. Vui lòng kết nối mạng và thử lại.'
      );
      setRefreshing(false);
      return;
    }
    
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
    
    const updatedOrder = { ...editingOrder, status: newStatus };
    
    try {
      // Kiểm tra kết nối mạng trước
      const isOnline = await checkNetworkStatus();
      
      // Lưu offline action cho cả online và offline
      console.log('Saving offline action for manual sync');
      await addOfflineAction('UPDATE', 'order', updatedOrder);
      
      Alert.alert(
        'Đã lưu thay đổi',
        'Thay đổi đã được lưu. Vui lòng ấn nút "Đồng bộ" để áp dụng thay đổi.'
      );
      
      // KHÔNG update local state - giữ nguyên dữ liệu cũ cho cả online và offline
      // Chỉ thay đổi UI khi ấn nút đồng bộ và sync thành công
      
      setModalVisible(false);
      setEditingOrder(null);
      
      // Cache data
      await cacheData('orders_data', orders);
      
    } catch (error) {
      console.error('Error in handleSaveStatus:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu thay đổi');
    }
  };

  const handleViewOrder = (order: any) => {
    setViewingOrder(order);
    setViewModalVisible(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tắt auto sync - chỉ sync khi user ấn nút đồng bộ
  // useEffect(() => {
  //   if (syncStatus.isOnline && syncStatus.pendingActions > 0 && fetchOrdersRef.current) {
  //     // Trigger manual sync with callback to refresh data
  //     performSync(fetchOrdersRef.current);
  //   }
  // }, [syncStatus.isOnline, syncStatus.pendingActions]);

  // Hàm load pending changes
  const loadPendingChanges = async () => {
    try {
      const orderActions = await getOfflineActions('order');
      setPendingChanges(orderActions);
    } catch (error) {
      console.error('Error loading pending changes:', error);
    }
  };

  // Hàm mở modal xem thay đổi
  const handleViewPendingChanges = async () => {
    await loadPendingChanges();
    setPendingChangesModalVisible(true);
  };

  // Helper functions cho hiển thị action
  const getActionText = (type: string) => {
    switch (type) {
      case 'CREATE': return 'Thêm mới';
      case 'UPDATE': return 'Cập nhật';
      case 'DELETE': return 'Xóa';
      default: return type;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'CREATE': return '#4CAF50';
      case 'UPDATE': return '#2196F3';
      case 'DELETE': return '#f44336';
      default: return '#666';
    }
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {syncStatus.isOnline && syncStatus.pendingActions > 0 && (
            <TouchableOpacity 
              style={[styles.filterButton, { marginRight: 10, backgroundColor: '#FF9800' }]} 
              onPress={handleViewPendingChanges}
            >
              <Icon name="visibility" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-list" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Offline Indicator */}
      <OfflineIndicator
        isOnline={syncStatus.isOnline}
        pendingActions={syncStatus.pendingActions}
        onManualSync={() => performSync(() => {
          // Refresh data from server after successful sync
          fetchOrders();
        })}
      />

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

      {/* Modal xem thay đổi pending */}
      <Modal
        visible={pendingChangesModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPendingChangesModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '95%', backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Thay đổi chờ đồng bộ</Text>
              <TouchableOpacity onPress={() => setPendingChangesModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {pendingChanges.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>Không có thay đổi nào</Text>
              ) : (
                pendingChanges.map((action, index) => (
                  <View key={action.id} style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 15, 
                    borderRadius: 8, 
                    marginBottom: 10 
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', color: getActionColor(action.type) }}>
                        {getActionText(action.type)}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        {new Date(action.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    {action.type === 'UPDATE' && (
                      <View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Đơn hàng: #{action.data.id}</Text>
                        <Text>Trạng thái mới: {action.data.status}</Text>
                        <Text>Tổng tiền: {formatCurrency(action.data.total)}</Text>
                        <Text>Ngày tạo: {new Date(action.data.createdAt).toLocaleString()}</Text>
                      </View>
                    )}
                    {action.type === 'CREATE' && (
                      <View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Đơn hàng mới: #{action.data.id}</Text>
                        <Text>Trạng thái: {action.data.status}</Text>
                        <Text>Tổng tiền: {formatCurrency(action.data.total)}</Text>
                        <Text>Ngày tạo: {new Date(action.data.createdAt).toLocaleString()}</Text>
                      </View>
                    )}
                    {action.type === 'DELETE' && (
                      <View>
                        <Text style={{ fontWeight: 'bold', color: '#f44336' }}>Xóa đơn hàng ID: {action.data.id}</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
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
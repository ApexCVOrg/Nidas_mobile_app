import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.100.246:3000';

const MyOrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders?userId=${user.id}`);
      setOrders(res.data.reverse()); // Đơn mới nhất lên đầu
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  // Hàm lấy ảnh từ tên file (giống cart)
  const getImageSource = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      "samba.gif": require("../../../assets/samba.gif"),
      "sl72.gif": require("../../../assets/sl72.gif"),
      "yeezy750.gif": require("../../../assets/yeezy750.gif"),
      "handball.gif": require("../../../assets/handball.gif"),
      "banner1.gif": require("../../../assets/banner1.gif"),
      "Giay_Ultraboost_22.jpg": require("../../../assets/Giay_Ultraboost_22.jpg"),
      "Giay_Stan_Smith_x_Liberty_London.jpg": require("../../../assets/Giay_Stan_Smith_x_Liberty_London.jpg"),
      "Ao_Thun_Polo_Ba_La.jpg": require("../../../assets/Ao_Thun_Polo_Ba_La.jpg"),
      "Quan_Hiking_Terrex.jpg": require("../../../assets/Quan_Hiking_Terrex.jpg"),
      "aoadidasden.png": require("../../../assets/aoadidasden.png"),
      "aoadidastrang.png": require("../../../assets/aoadidastrang.png"),
      "aoadidasxanh.png": require("../../../assets/aoadidasxanh.png"),
      "ao1.jpg": require("../../../assets/ao1.jpg"),
      "ao3.jpg": require("../../../assets/ao3.jpg"),
      "ao4.jpg": require("../../../assets/ao4.jpg"),
      "ao5.jpg": require("../../../assets/ao5.jpg"),
      "quan1.jpg": require("../../../assets/quan1.jpg"),
      "quan2.jpg": require("../../../assets/quan2.jpg"),
      "quan3.jpg": require("../../../assets/quan3.jpg"),
      "thun_adidas.jpg": require("../../../assets/category_images/thun_adidas.jpg"),
      "HaNoiAo.jpg": require("../../../assets/category_images/HaNoiAo.jpg"),
      "Hoodie_Unisex.jpg": require("../../../assets/category_images/Hoodie_Unisex.jpg"),
      "adilette.jpg": require("../../../assets/category_images/adilette.jpg"),
      "SlimFit.jpg": require("../../../assets/category_images/SlimFit.jpg"),
      "Kid_O.jpg": require("../../../assets/category_images/Kid_O.jpg"),
      "Kid_O2.jpg": require("../../../assets/category_images/Kid_O2.jpg"),
      "Mu_2526.jpg": require("../../../assets/category_images/Mu_2526.jpg"),
    };
    return imageMap[imageName] || require("../../../assets/icon.png");
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Mã đơn: {item.vnp_TxnRef || item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}> 
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.orderDate}>Ngày tạo: {formatDate(item.createdAt)}</Text>
      <Text style={styles.orderTotal}>Tổng tiền: {formatPrice(item.total)}</Text>
      <Text style={styles.orderPayment}>Phương thức: {item.paymentMethod || 'N/A'}</Text>
      <Text style={styles.orderBank}>Ngân hàng: {item.vnp_BankCode || 'N/A'}</Text>
      <Text style={styles.orderTransNo}>Mã GD VNPAY: {item.vnp_TransactionNo || 'N/A'}</Text>
      <Text style={styles.orderInfo}>Nội dung: {item.vnp_OrderInfo || 'N/A'}</Text>
      <View style={styles.itemsList}>
        {item.items && item.items.map((prod: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={getImageSource(prod.image)}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.itemName}>{prod.name}</Text>
              <Text style={styles.itemDetails}>Màu: {prod.color} • Size: {prod.size} • SL: {prod.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>{formatPrice(prod.price * (prod.quantity || 1))}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'failed': return '#e74c3c';
      case 'cancelled': return '#95a5a6';
      default: return '#666';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Thành công';
      case 'pending': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
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
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
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
  headerRight: {
    width: 32,
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
  orderCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
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
  orderDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 2,
  },
  orderPayment: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderBank: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderTransNo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  orderInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  itemsList: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    flex: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e67e22',
    flex: 1,
    textAlign: 'right',
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eee',
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
  refreshButton: {
    padding: 4,
  },
});

export default MyOrdersScreen; 
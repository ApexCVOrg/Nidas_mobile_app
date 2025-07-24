import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import axios from 'axios';

interface PaymentResult {
  vnp_Amount: number;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

const PaymentSuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.totalAmount);
  const user = useSelector((state: RootState) => state.auth.user);
  const API_URL = 'http://192.168.100.246:3000'; // Đổi thành IP mock-api nếu cần

  // Lấy thông tin thanh toán từ route params
  const paymentResult = route.params?.paymentResult as PaymentResult;

  React.useEffect(() => {
    const handleOrderAndCart = async () => {
      if (!user || !user.id) return;
      if (!paymentResult || paymentResult.vnp_ResponseCode !== '00') return;
      try {
        // 1. Lấy cart hiện tại của user
        const res = await axios.get(`${API_URL}/carts?userId=${user.id}`);
        const cart = res.data[0];
        if (!cart) return;
        // 2. Xóa toàn bộ sản phẩm đã thanh toán khỏi cart (ở đây: clear cart)
        await axios.patch(`${API_URL}/carts/${cart.id}`, { items: [] });
        // 3. Tạo order mới
        await axios.post(`${API_URL}/orders`, {
          userId: user.id,
          items: cartItems,
          total: cartTotal,
          status: 'completed',
          createdAt: new Date().toISOString(),
          paymentMethod: 'vnpay',
          vnp_TxnRef: paymentResult.vnp_TxnRef,
          vnp_TransactionNo: paymentResult.vnp_TransactionNo,
          vnp_BankCode: paymentResult.vnp_BankCode,
          vnp_PayDate: paymentResult.vnp_PayDate,
          vnp_OrderInfo: paymentResult.vnp_OrderInfo,
        });
      } catch (e) {
        // Có thể show alert nếu muốn
      }
    };
    handleOrderAndCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getBankName = (bankCode: string) => {
    const bankNames: { [key: string]: string } = {
      'VCB': 'Vietcombank',
      'TCB': 'Techcombank',
      'MB': 'MB Bank',
      'VPB': 'VPBank',
      'ACB': 'ACB',
      'OCB': 'OCB',
      'SCB': 'SCB',
      'TPB': 'TPBank',
      'HDB': 'HDBank',
      'MSB': 'MSB',
      'VIB': 'VIB',
      'STB': 'Sacombank',
      'BIDV': 'BIDV',
      'AGB': 'Agribank',
      'SHB': 'SHB',
      'EIB': 'Eximbank',
      'CTG': 'VietinBank',
      'ABB': 'ABB',
      'TPB': 'TPBank',
      'NCB': 'NCB',
    };
    return bankNames[bankCode] || bankCode;
  };

  const handlePrintReceipt = () => {
    Alert.alert(
      'In hóa đơn',
      'Tính năng in hóa đơn sẽ được phát triển trong phiên bản tiếp theo.',
      [{ text: 'OK' }]
    );
  };

  const handleShareReceipt = () => {
    Alert.alert(
      'Chia sẻ hóa đơn',
      'Tính năng chia sẻ hóa đơn sẽ được phát triển trong phiên bản tiếp theo.',
      [{ text: 'OK' }]
    );
  };

  const handleBackToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán thành công</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successSubtitle}>
            Giao dịch của bạn đã được xử lý thành công
          </Text>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết giao dịch</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã giao dịch:</Text>
              <Text style={styles.detailValue}>{paymentResult?.vnp_TxnRef || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số tiền:</Text>
              <Text style={styles.detailValueAmount}>
                {formatPrice(paymentResult?.vnp_Amount ? paymentResult.vnp_Amount / 100 : cartTotal)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ngân hàng:</Text>
              <Text style={styles.detailValue}>
                {getBankName(paymentResult?.vnp_BankCode || '')}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã GD ngân hàng:</Text>
              <Text style={styles.detailValue}>{paymentResult?.vnp_BankTranNo || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã GD VNPAY:</Text>
              <Text style={styles.detailValue}>{paymentResult?.vnp_TransactionNo || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thời gian:</Text>
              <Text style={styles.detailValue}>
                {formatDate(paymentResult?.vnp_PayDate || '')}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nội dung:</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {paymentResult?.vnp_OrderInfo || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          
          <View style={styles.orderCard}>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.orderItemDetails}>
                    Màu: {item.color} • Size: {item.size} • SL: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  {formatPrice(item.price * (item.quantity || 1))}
                </Text>
              </View>
            ))}
            
            <View style={styles.orderTotal}>
              <Text style={styles.orderTotalLabel}>Tổng cộng:</Text>
              <Text style={styles.orderTotalValue}>
                {formatPrice(cartTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePrintReceipt}>
            <Ionicons name="print-outline" size={20} color="#0066CC" />
            <Text style={styles.actionButtonText}>In hóa đơn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareReceipt}>
            <Ionicons name="share-outline" size={20} color="#0066CC" />
            <Text style={styles.actionButtonText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.homeButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 2,
    textAlign: 'right',
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    flex: 2,
    textAlign: 'right',
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 12,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default PaymentSuccessScreen; 
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/Product';

const { height: screenHeight } = Dimensions.get('window');

interface CheckoutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  product?: Product;
  selectedColor?: string;
  selectedSize?: string | number;
  onCheckout: (orderData: any) => void;
}

const CheckoutBottomSheet: React.FC<CheckoutBottomSheetProps> = ({
  visible,
  onClose,
  product,
  selectedColor,
  selectedSize,
  onCheckout,
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      showBottomSheet();
    } else {
      hideBottomSheet();
    }
  }, [visible]);

  const showBottomSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBottomSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 150) {
        onClose();
      } else {
        showBottomSheet();
      }
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const orderData = {
      product,
      selectedColor,
      selectedSize,
      customerInfo,
      paymentMethod,
      total: product?.price || 0,
    };

    onCheckout(orderData);
  };

  const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: 'cash-outline' },
    { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: 'card-outline' },
    { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline' },
  ];

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Đặt hàng nhanh</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Product Summary */}
            {product && (
              <View style={styles.productSummary}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  Màu: {selectedColor} • Size: {selectedSize}
                </Text>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
              </View>
            )}

            {/* Customer Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ và tên"
                  value={customerInfo.name}
                  onChangeText={(text) => setCustomerInfo({...customerInfo, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  value={customerInfo.phone}
                  onChangeText={(text) => setCustomerInfo({...customerInfo, phone: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Địa chỉ giao hàng *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Nhập địa chỉ chi tiết"
                  multiline
                  numberOfLines={3}
                  value={customerInfo.address}
                  onChangeText={(text) => setCustomerInfo({...customerInfo, address: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ghi chú (tùy chọn)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ghi chú cho đơn hàng"
                  multiline
                  numberOfLines={2}
                  value={customerInfo.note}
                  onChangeText={(text) => setCustomerInfo({...customerInfo, note: text})}
                />
              </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    paymentMethod === method.id && styles.paymentMethodSelected
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Ionicons 
                    name={method.icon as any} 
                    size={24} 
                    color={paymentMethod === method.id ? '#000' : '#666'} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === method.id && styles.paymentMethodTextSelected
                  ]}>
                    {method.name}
                  </Text>
                  <View style={[
                    styles.radio,
                    paymentMethod === method.id && styles.radioSelected
                  ]}>
                    {paymentMethod === method.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalValue}>
                  {product ? formatPrice(product.price) : '0 đ'}
                </Text>
              </View>
              <Text style={styles.freeShipping}>Miễn phí vận chuyển</Text>
            </View>
          </ScrollView>

          {/* Checkout Button */}
          <View style={styles.checkoutSection}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>ĐẶT HÀNG NGAY</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.checkoutIcon} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
  },
  keyboardView: {
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  productSummary: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#000',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  paymentMethodTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#000',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  totalSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  freeShipping: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  checkoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  checkoutIcon: {
    marginLeft: 8,
  },
});

export default CheckoutBottomSheet; 
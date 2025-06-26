import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/slices/cartSlice';
import { TabNavigatorParamList } from '../navigation/TabNavigator';

const CheckoutScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.totalAmount);
  
  const { type = 'cart', orderData } = route.params || {};
  
  const [customerInfo, setCustomerInfo] = useState({
    name: orderData?.customerInfo?.name || '',
    phone: orderData?.customerInfo?.phone || '',
    address: orderData?.customerInfo?.address || '',
    note: orderData?.customerInfo?.note || '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState(orderData?.paymentMethod || 'cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getTotal = () => {
    if (type === 'quick' && orderData) {
      return orderData.total;
    }
    return cartTotal;
  };

  const getOrderItems = () => {
    if (type === 'quick' && orderData) {
      return [{
        name: orderData.product.name,
        color: orderData.selectedColor,
        size: orderData.selectedSize,
        price: orderData.product.price,
        quantity: 1,
      }];
    }
    return cartItems.map(item => ({
      name: item.name,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      Alert.alert('Notification', 'Please fill in all required information');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const order = {
        id: Date.now().toString(),
        items: getOrderItems(),
        customerInfo,
        paymentMethod,
        total: getTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Here you would normally send to your backend
      console.log('Order placed:', order);

      // Clear cart if it's a cart checkout
      if (type === 'cart') {
        dispatch(clearCart());
      }

      // Show success and navigate
      Alert.alert(
        'Order successful!',
        `Order #${order.id} has been placed successfully. We will contact you soon.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              if (type === 'cart') {
                navigation.navigate('Home' as never);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred while placing the order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery (COD)', icon: 'cash-outline' },
    { id: 'banking', name: 'Bank Transfer', icon: 'card-outline' },
    { id: 'momo', name: 'MoMo Wallet', icon: 'wallet-outline' },
  ];

  const orderItems = getOrderItems();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          {orderItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.orderItemDetails}>
                  Màu: {item.color} • Size: {item.size}
                </Text>
                {type === 'cart' && (
                  <Text style={styles.orderItemQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                )}
              </View>
              <View style={styles.orderItemPrice}>
                <Text style={styles.orderItemPriceText}>
                  {formatPrice(item.price * (item.quantity || 1))}
                </Text>
              </View>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatPrice(getTotal())}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={[styles.totalValue, styles.freeShipping]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(getTotal())}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={customerInfo.name}
              onChangeText={(text) => setCustomerInfo({...customerInfo, name: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
              value={customerInfo.phone}
              onChangeText={(text) => setCustomerInfo({...customerInfo, phone: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Shipping Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
              value={customerInfo.address}
              onChangeText={(text) => setCustomerInfo({...customerInfo, address: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your note"
              multiline
              numberOfLines={2}
              value={customerInfo.note}
              onChangeText={(text) => setCustomerInfo({...customerInfo, note: text})}
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
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
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.checkoutSection}>
        <TouchableOpacity 
          style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]} 
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.checkoutButtonText}>PROCESSING...</Text>
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>ORDER</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.checkoutIcon} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderItemPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  freeShipping: {
    color: '#27ae60',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
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
  checkoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#999',
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

export default CheckoutScreen; 
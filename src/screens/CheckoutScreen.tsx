import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SimplePaymentButton from '../components/SimplePaymentButton';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.totalAmount);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getImageSource = (item: any) => {
    if (!item.image) return require('../../assets/icon.png');
    if (item.image.startsWith('http')) return { uri: item.image };
    
    const imageMap: { [key: string]: any } = {
      'samba.gif': require('../../assets/samba.gif'),
      'sl72.gif': require('../../assets/sl72.gif'),
      'yeezy750.gif': require('../../assets/yeezy750.gif'),
      'handball.gif': require('../../assets/handball.gif'),
      'banner1.gif': require('../../assets/banner1.gif'),
      'Giay_Ultraboost_22.jpg': require('../../assets/Giay_Ultraboost_22.jpg'),
      'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
      'Ao_Thun_Polo_Ba_La.jpg': require('../../assets/Ao_Thun_Polo_Ba_La.jpg'),
      'Quan_Hiking_Terrex.jpg': require('../../assets/Quan_Hiking_Terrex.jpg'),
      'aoadidasden.png': require('../../assets/aoadidasden.png'),
      'aoadidastrang.png': require('../../assets/aoadidastrang.png'),
      'aoadidasxanh.png': require('../../assets/aoadidasxanh.png'),
      'ao1.jpg': require('../../assets/ao1.jpg'),
      'ao3.jpg': require('../../assets/ao3.jpg'),
      'ao4.jpg': require('../../assets/ao4.jpg'),
      'ao5.jpg': require('../../assets/ao5.jpg'),
      'quan1.jpg': require('../../assets/quan1.jpg'),
      'quan2.jpg': require('../../assets/quan2.jpg'),
      'quan3.jpg': require('../../assets/quan3.jpg'),
      'thun_adidas.jpg': require('../../assets/category_images/thun_adidas.jpg'),
      'HaNoiAo.jpg': require('../../assets/category_images/HaNoiAo.jpg'),
      'Hoodie_Unisex.jpg': require('../../assets/category_images/Hoodie_Unisex.jpg'),
      'adilette.jpg': require('../../assets/category_images/adilette.jpg'),
      'SlimFit.jpg': require('../../assets/category_images/SlimFit.jpg'),
      'Kid_O.jpg': require('../../assets/category_images/Kid_O.jpg'),
      'Kid_O2.jpg': require('../../assets/category_images/Kid_O2.jpg'),
      'Mu_2526.jpg': require('../../assets/category_images/Mu_2526.jpg'),
    };
    return imageMap[item.image] || require('../../assets/icon.png');
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image
                source={getImageSource(item)}
                style={styles.orderItemImage}
                resizeMode="cover"
              />
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.orderItemDetails}>
                  Màu: {item.color} • Size: {item.size}
                </Text>
                <Text style={styles.orderItemQuantity}>
                  Số lượng: {item.quantity}
                </Text>
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
              <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={[styles.totalValue, styles.freeShipping]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(cartTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <SimplePaymentButton
            amount={cartTotal}
            orderInfo={`Thanh toán đơn hàng #${Date.now()}`}
            onPaymentSuccess={(result) => {
              console.log('Payment successful:', result);
            }}
            onPaymentError={(error) => {
              console.log('Payment error:', error);
            }}
          />
          
          {/* Link to Transaction History */}
          <TouchableOpacity
            style={styles.transactionHistoryButton}
            onPress={() => navigation.navigate('TransactionHistory' as never)}
          >
            <Ionicons name="receipt-outline" size={20} color="#0066CC" />
            <Text style={styles.transactionHistoryText}>Xem lịch sử giao dịch</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
        </View>
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
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  transactionHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FF',
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  transactionHistoryText: {
    flex: 1,
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
  },
});

export default CheckoutScreen; 
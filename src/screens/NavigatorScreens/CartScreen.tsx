import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { removeFromCart, updateQuantity, clearCart, CartItem } from '../../redux/slices/cartSlice';
import { cartStyles as styles } from '../../styles/cart/cart.styles';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);

  const delivery = 0; // Free delivery
  const total = totalAmount + delivery;

  const getImageSource = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'samba.gif': require('../../../assets/samba.gif'),
      'sl72.gif': require('../../../assets/sl72.gif'),
      'yeezy750.gif': require('../../../assets/yeezy750.gif'),
      'handball.gif': require('../../../assets/handball.gif'),
      'banner1.gif': require('../../../assets/banner1.gif'),
      'Giay_Ultraboost_22.jpg': require('../../../assets/Giay_Ultraboost_22.jpg'),
      'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
      'Ao_Thun_Polo_Ba_La.jpg': require('../../../assets/Ao_Thun_Polo_Ba_La.jpg'),
      'Quan_Hiking_Terrex.jpg': require('../../../assets/Quan_Hiking_Terrex.jpg'),
      'aoadidasden.png': require('../../../assets/aoadidasden.png'),
      'aoadidastrang.png': require('../../../assets/aoadidastrang.png'),
      'aoadidasxanh.png': require('../../../assets/aoadidasxanh.png'),
      'ao1.jpg': require('../../../assets/ao1.jpg'),
      'ao3.jpg': require('../../../assets/ao3.jpg'),
      'ao4.jpg': require('../../../assets/ao4.jpg'),
      'ao5.jpg': require('../../../assets/ao5.jpg'),
      'quan1.jpg': require('../../../assets/quan1.jpg'),
      'quan2.jpg': require('../../../assets/quan2.jpg'),
      'quan3.jpg': require('../../../assets/quan3.jpg'),
    };
    
    return imageMap[imageName] || require('../../../assets/icon.png');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image 
          source={getImageSource(item.image)}
          style={styles.itemImage}
          defaultSource={require('../../../assets/icon.png')}
        />
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.itemAttributes}>
          <Text style={styles.attributeText}>Color: {item.color}</Text>
          <Text style={styles.attributeText}>Size: {item.size}</Text>
        </View>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4757" />
        </TouchableOpacity>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <Ionicons name="remove" size={16} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Ionicons name="add" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemTotal}>
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CART</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items Count */}
      {items.length > 0 && (
        <View style={styles.itemsCountContainer}>
          <Text style={styles.itemsCountText}>
            {totalItems} items in cart
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={120} color="#e0e0e0" />
            <Text style={styles.emptyCartTitle}>CART IS EMPTY</Text>
            <Text style={styles.emptyCartSubtitle}>
              Add your favorite products to the cart to continue shopping
            </Text>
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('Home' as never)}
            >
              <Text style={styles.shopNowButtonText}>EXPLORE PRODUCTS</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.shopNowIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartItemsContainer}>
            {items.map(renderCartItem)}
          </View>
        )}
      </ScrollView>

      {/* Order Summary */}
      {items.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryHeaderText}>ORDER SUMMARY</Text>
          </View>
          
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping fee</Text>
              <Text style={[styles.summaryValue, styles.freeShipping]}>
                {delivery === 0 ? 'FREE' : formatPrice(delivery)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
          
                      <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => (navigation as any).navigate('Checkout', { type: 'cart' })}
            >
              <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.checkoutIcon} />
            </TouchableOpacity>
          
          <TouchableOpacity style={styles.continueShoppingButton}>
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen; 
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../redux/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
  toggleCheckItem,
  toggleCheckAll,
  removeCheckedItems,
} from "../../redux/slices/cartSlice";
import { cartStyles as styles } from "../../styles/cart/cart.styles";
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { items, totalItems, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  const delivery = 0; // Free delivery
  const total = totalAmount + delivery;

  const allChecked = items.length > 0 && items.every(item => item.checked);
  const anyChecked = items.some(item => item.checked);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
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
      {/* Checkbox chọn sản phẩm */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => dispatch(toggleCheckItem(item.id))}
      >
        {item.checked ? (
          <MaterialIcons name="check-box" size={24} color="#007bff" />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color="#ccc" />
        )}
      </TouchableOpacity>

      <View style={styles.itemImageContainer}>
        <Image
          source={getImageSource(item.image)}
          style={styles.itemImage}
          defaultSource={require("../../../assets/icon.png")}
        />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
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

      {showPopup && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
          <View style={{backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', width: 300}}>
            <Text style={{color: '#d32f2f', fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Bạn chưa đăng nhập</Text>
            <Text style={{color: '#222', fontSize: 15, marginBottom: 24, textAlign: 'center'}}>Vui lòng đăng nhập để sử dụng tính năng này!</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity style={{flex: 1, marginRight: 8, backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowPopup(false); navigation.navigate('HomeMain' as never); }}>
                <Text style={{color: '#222', fontWeight: 'bold'}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginLeft: 8, backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowPopup(false); navigation.navigate('Auth' as never); }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CART</Text>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chọn tất cả và xóa các sản phẩm đã chọn */}
      {items.length > 0 && (
        <View style={styles.selectAllRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => dispatch(toggleCheckAll(!allChecked))}
          >
            {allChecked ? (
              <MaterialIcons name="check-box" size={24} color="#007bff" />
            ) : (
              <MaterialIcons name="check-box-outline-blank" size={24} color="#ccc" />
            )}
          </TouchableOpacity>
          <Text style={styles.selectAllText}>Chọn tất cả</Text>
          <TouchableOpacity
            style={[styles.removeCheckedButton, { opacity: anyChecked ? 1 : 0.5 }]}
            onPress={() => anyChecked && dispatch(removeCheckedItems())}
            disabled={!anyChecked}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.removeCheckedButtonText}>Xóa đã chọn</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart Items Count */}
      {items.length > 0 && (
        <View style={styles.itemsCountContainer}>
          <Text style={styles.itemsCountText}>{totalItems} items in cart</Text>
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
              onPress={() => navigation.navigate("Home" as never)}
            >
              <Text style={styles.shopNowButtonText}>EXPLORE PRODUCTS</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#fff"
                style={styles.shopNowIcon}
              />
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
              <Text style={styles.summaryLabel}>
                Subtotal ({totalItems} items)
              </Text>
              <Text style={styles.summaryValue}>
                {formatPrice(totalAmount)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping fee</Text>
              <Text style={[styles.summaryValue, styles.freeShipping]}>
                {delivery === 0 ? "FREE" : formatPrice(delivery)}
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
            onPress={() =>
              (navigation as any).navigate("Checkout", { type: "cart" })
            }
          >
            <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={styles.checkoutIcon}
            />
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

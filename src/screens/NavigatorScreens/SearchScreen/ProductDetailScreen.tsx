import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';
import { Product } from '../../../types/Product';
import Toast from '../../../components/Toast';
import CheckoutBottomSheet from '../../../components/CheckoutBottomSheet';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = {
  params: {
    product: Product;
  };
};

type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { searchQuery: string };
  ProductDetail: { product: Product };
  Product: undefined;
  Introduction: {
    bannerId: number;
    title: string;
    subtitle: string;
  };
};

type NavigationProp = StackNavigationProp<SearchStackParamList>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { product } = route.params;
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getImageSource = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'samba.gif': require('../../../../assets/samba.gif'),
      'sl72.gif': require('../../../../assets/sl72.gif'),
      'yeezy750.gif': require('../../../../assets/yeezy750.gif'),
      'handball.gif': require('../../../../assets/handball.gif'),
      'banner1.gif': require('../../../../assets/banner1.gif'),
      'Giay_Ultraboost_22.jpg': require('../../../../assets/Giay_Ultraboost_22.jpg'),
      'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
      'Ao_Thun_Polo_Ba_La.jpg': require('../../../../assets/Ao_Thun_Polo_Ba_La.jpg'),
      'Quan_Hiking_Terrex.jpg': require('../../../../assets/Quan_Hiking_Terrex.jpg'),
      'aoadidasden.png': require('../../../../assets/aoadidasden.png'),
      'aoadidastrang.png': require('../../../../assets/aoadidastrang.png'),
      'aoadidasxanh.png': require('../../../../assets/aoadidasxanh.png'),
      'ao1.jpg': require('../../../../assets/ao1.jpg'),
      'ao3.jpg': require('../../../../assets/ao3.jpg'),
      'ao4.jpg': require('../../../../assets/ao4.jpg'),
      'ao5.jpg': require('../../../../assets/ao5.jpg'),
      'quan1.jpg': require('../../../../assets/quan1.jpg'),
      'quan2.jpg': require('../../../../assets/quan2.jpg'),
      'quan3.jpg': require('../../../../assets/quan3.jpg'),
    };
    
    return imageMap[imageName] || require('../../../../assets/icon.png');
  };

  const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'blue': '#0066CC',
      'red': '#FF0000',
      'green': '#00CC00',
      'yellow': '#FFCC00',
      'pink': '#FF69B4',
      'purple': '#800080',
      'grey': '#808080',
      'gray': '#808080',
      'brown': '#8B4513',
      'navy': '#000080',
      'khaki': '#F0E68C',
      'floral': '#FFB6C1',
    };
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToastMessage('Vui lòng chọn size');
      setShowToast(true);
      return;
    }
    
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    
    dispatch(addToCart(cartItem));
    
    setToastMessage(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    setShowToast(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setToastMessage('Vui lòng chọn size');
      setShowToast(true);
      return;
    }
    setShowQuickCheckout(true);
  };

  const handleQuickCheckout = (orderData: any) => {
    setShowQuickCheckout(false);
    (navigation as any).navigate('Checkout', { 
      type: 'quick', 
      orderData 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={getImageSource(product.image)}
            style={styles.productImage}
            defaultSource={require('../../../../assets/icon.png')}
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {product.category === 'giay' ? 'Giày' : 'Quần áo'} • {product.gender} • {product.type}
            </Text>
          </View>
        </View>

        {/* Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <View style={styles.colorsContainer}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { 
                    backgroundColor: getColorCode(color),
                    borderWidth: selectedColor === color ? 3 : 1,
                    borderColor: selectedColor === color ? '#333' : '#ddd'
                  }
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={16} color={color === 'white' ? '#000' : '#fff'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedColorText}>Đã chọn: {selectedColor}</Text>
        </View>

        {/* Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kích thước</Text>
          <View style={styles.sizesContainer}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  { 
                    backgroundColor: selectedSize === size ? '#000' : '#fff',
                    borderColor: selectedSize === size ? '#000' : '#ddd'
                  }
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  { color: selectedSize === size ? '#fff' : '#000' }
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Từ khóa</Text>
          <View style={styles.tagsContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color="#fff" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastMessage.includes('Vui lòng') ? 'error' : 'success'}
        onHide={() => setShowToast(false)}
      />

      {/* Quick Checkout Bottom Sheet */}
      <CheckoutBottomSheet
        visible={showQuickCheckout}
        onClose={() => setShowQuickCheckout(false)}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onCheckout={handleQuickCheckout}
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
  favoriteButton: {
    padding: 4,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 12,
  },
  categoryContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen; 
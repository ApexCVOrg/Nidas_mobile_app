import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../../../redux/slices/cartSlice';
import Toast from '../../../components/Toast';
import CheckoutBottomSheet from '../../../components/CheckoutBottomSheet';
import categoryProducts from '../../../api/categoryProducts.json';

const { width } = Dimensions.get('window');

// Lấy sản phẩm đầu tiên từ categoryProducts làm ví dụ
const product = categoryProducts[0];
const rawSizes = Object.entries(product.quantityBySize as unknown as Record<string, number>);
const sizes: string[] = rawSizes.filter(([_, v]) => typeof v === 'number').map(([k]) => k);

// Type for color map
const colorMap: Record<string, string> = {
  white: '#FFFFFF', black: '#000000', blue: '#0066CC', red: '#FF0000', yellow: '#FFCC00', pink: '#FF69B4', green: '#00CC00', gray: '#808080', grey: '#808080', brown: '#8B4513', teal: '#008080', beige: '#F5F5DC', silver: '#C0C0C0', navy: '#000080', floral: '#FFB6C1', orange: '#FFA500', purple: '#800080', pink2: '#FFC0CB', green2: '#228B22', gold: '#FFD700'
};
const availableColors = product.colors.map((c: string) => ({ name: c, code: colorMap[c] || '#ccc', label: c.charAt(0).toUpperCase() + c.slice(1) }));

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseInt((price as string).replace(/[^\d]/g, '')) : price;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

// Lấy tồn kho theo size (không phân biệt màu)
const getStock = (size: string) => {
  const stock = (product.quantityBySize as unknown as Record<string, number>)[size];
  return typeof stock === 'number' ? stock : 0;
};

const ProductScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);

  React.useEffect(() => {
    if (selectedSize) {
      const stock = getStock(selectedSize);
      if (quantity > stock) setQuantity(stock > 0 ? 1 : 0);
    }
  }, [selectedColor, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToastMessage('Vui lòng chọn size');
      setShowToast(true);
      return;
    }
    if (!selectedColor) {
      setToastMessage('Vui lòng chọn màu');
      setShowToast(true);
      return;
    }
    const stock = getStock(selectedSize);
    if (stock === 0) {
      setToastMessage('Hết hàng cho lựa chọn này!');
      setShowToast(true);
      return;
    }
    if (quantity > stock) {
      setToastMessage('Vượt quá số lượng tồn kho!');
      setShowToast(true);
      return;
    }
    const numericPrice = typeof product.price === 'string' ? parseInt((product.price as string).replace(/[^\d]/g, '')) : product.price;
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: numericPrice,
      image: ((product.imageByColor as unknown) as Record<string, string>)[selectedColor] || product.imageDefault,
      color: selectedColor,
      size: selectedSize,
      quantity,
    };
    dispatch(addToCart(cartItem));
    setToastMessage(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    setShowToast(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setToastMessage('Please select a size');
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
      
      {/* Favorite Button (Fixed Position) */}
      <View style={styles.favoriteButtonContainer}>
        <TouchableOpacity 
          onPress={() => setIsFavorite(!isFavorite)}
          style={styles.favoriteButton}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#e74c3c" : "#000"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* First Banner */}
      <View style={styles.bannerContainer}>
        <Image 
          source={require('../../../../assets/TOP.gif')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>ADIDAS ORIGINALS</Text>
            <Text style={styles.heroTitle}>PHARRELL WILLIAMS{'\n'}x{'\n'}TENNIS HU</Text>
            <Text style={styles.heroTagline}>Step into creative design</Text>
          </View>
        </View>

        {/* Second Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={require('../../../../assets/banner1.gif')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfoSection}>
          <View style={styles.productHeader}>
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCode}>BD7530</Text>
            </View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>
          
          <View style={styles.ratingSection}>
            <View style={styles.stars}>
              {[1,2,3,4,5].map((star) => (
                <Ionicons key={star} name="star" size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={styles.ratingText}>4.8 (2,340 reviews)</Text>
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Color</Text>
          <View style={styles.colorOptions}>
            {availableColors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.code },
                  selectedColor === color.name && styles.selectedColorOption
                ]}
                onPress={() => setSelectedColor(color.name)}
              >
                {selectedColor === color.name && (
                  <Ionicons 
                    name="checkmark" 
                    size={16} 
                    color={color.code === '#FFFFFF' ? '#000' : '#fff'} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedText}>
            Đã chọn: {selectedColor}
          </Text>
        </View>

        {/* Size Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Size</Text>
          <View style={styles.sizeOptions}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  selectedSize === size && styles.selectedSizeOption
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Hiển thị tồn kho cho size */}
          {selectedSize && (
            <Text style={{ marginTop: 8, color: '#666' }}>
              Số lượng còn: {getStock(selectedSize)}
            </Text>
          )}
          {/* Chọn số lượng */}
          {selectedSize && getStock(selectedSize) > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                style={{ padding: 8, opacity: quantity <= 1 ? 0.5 : 1 }}
              >
                <Text style={{ fontSize: 20 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 16, fontSize: 16 }}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(q => Math.min(getStock(selectedSize), q + 1))}
                disabled={quantity >= getStock(selectedSize)}
                style={{ padding: 8, opacity: quantity >= getStock(selectedSize) ? 0.5 : 1 }}
              >
                <Text style={{ fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Product Story */}
        <View style={styles.storySection}>
          <View style={styles.storyHeader}>
            <Text style={styles.storyTitle}>THE STORY</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.storyText}>
            {product.description}
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <Text style={styles.gridTitle}>CRAFTSMANSHIP</Text>
          <View style={styles.gridContainer}>
            {[
              'Primeknit upper for maximum comfort',
              'High-elastic boost™ sole',
              'Exclusive design by Pharrell Williams',
              'Suitable for both men and women'
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureNumber}>
                  <Text style={styles.featureNumberText}>{String(index + 1).padStart(2, '0')}</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryItem}>
            <Ionicons name="car-outline" size={24} color="#666" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Free shipping</Text>
              <Text style={styles.deliveryDesc}>Orders from 500,000₫</Text>
            </View>
          </View>
          <View style={styles.deliveryItem}>
            <Ionicons name="refresh-outline" size={24} color="#666" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Easy returns</Text>
              <Text style={styles.deliveryDesc}>Within 30 days</Text>
            </View>
          </View>
          <View style={styles.deliveryItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Official warranty</Text>
              <Text style={styles.deliveryDesc}>12 months nationwide</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastMessage.includes('Please') ? 'error' : 'success'}
        onHide={() => setShowToast(false)}
      />

      {/* Quick Checkout Bottom Sheet */}
      <CheckoutBottomSheet
        visible={showQuickCheckout}
        onClose={() => setShowQuickCheckout(false)}
        product={product as any}
        selectedColor={selectedColor}
        selectedSize={selectedSize || undefined}
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
  favoriteButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    height: 400,
    width: width,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  heroSection: {
    backgroundColor: '#000',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    marginBottom: 10,
    opacity: 0.8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 32,
    marginBottom: 15,
  },
  heroTagline: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  productInfoSection: {
    padding: 25,
    backgroundColor: '#fff',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
    maxWidth: '70%',
  },
  productCode: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  selectionSection: {
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  selectedColorOption: {
    borderColor: '#000',
    borderWidth: 3,
  },
  selectedText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  sizeOption: {
    minWidth: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedSizeOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  selectedSizeText: {
    color: '#fff',
  },
  storySection: {
    padding: 25,
    backgroundColor: '#f8f8f8',
  },
  storyHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 10,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: '#000',
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresGrid: {
    padding: 25,
    backgroundColor: '#fff',
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 25,
  },
  gridContainer: {
    gap: 15,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
  },
  featureNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  deliverySection: {
    padding: 25,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryText: {
    marginLeft: 15,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  deliveryDesc: {
    fontSize: 14,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buyNowText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductScreen; 
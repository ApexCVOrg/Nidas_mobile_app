import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../../../redux/slices/cartSlice';
import Toast from '../../../components/Toast';
import CheckoutBottomSheet from '../../../components/CheckoutBottomSheet';

const { width } = Dimensions.get('window');

// Mock product data for Pharrell Williams x Tennis Hu
const product = {
  id: 'pw-tennis-hu',
  name: 'Pharrell Williams x Tennis Hu',
  category: 'giay',
  gender: 'unisex',
  type: 'collaboration',
  price: 3200000,
  description: 'Pharrell Williams x Tennis Hu represents the perfect fusion of street style and modern innovation. With breakthrough design from Pharrell Williams, these shoes deliver maximum comfort and unique style.',
  image: 'banner1.gif',
  colors: ['red', 'teal', 'beige', 'white'],
  sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  tags: ['pharrell', 'tennis hu', 'collaboration', 'unique', 'colorful'],
  quantityBySize: {
    "36": 10,
    "37": 10,
    "38": 10,
    "39": 10,
    "40": 10,
    "41": 10,
    "42": 10,
    "43": 10,
    "44": 10,
    "45": 10
  }
};

const ProductScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('red');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);

  const availableColors = [
    { name: 'red', code: '#DC143C', label: 'Red' },
    { name: 'teal', code: '#006699', label: 'Teal' },
    { name: 'beige', code: '#F5F5DC', label: 'Beige' },
    { name: 'white', code: '#FFFFFF', label: 'White' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToastMessage('Please select a size');
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
    setToastMessage(`✅ ${product.name} added to cart!`);
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
            Selected: {availableColors.find(c => c.name === selectedColor)?.label}
          </Text>
        </View>

        {/* Size Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Size (EU)</Text>
          <View style={styles.sizeOptions}>
            {product.sizes.map((size) => (
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
          <Ionicons name="cart" size={20} color="#fff" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
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
        product={product}
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
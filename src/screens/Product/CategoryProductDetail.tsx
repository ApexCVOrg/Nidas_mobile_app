import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  Modal,
  PanResponder,
  Animated as RNAnimated,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { TabNavigatorParamList } from '../../navigation/TabNavigator';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  FadeOut,
  SlideInRight,
  SlideInLeft,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SizeGuideModal from '../../components/SizeGuideModal';
import RecommendedProducts from '../../components/RecommendedProducts';
import categoryProducts from '../../api/categoryProducts.json';
import { getImageRequire } from '../../utils/imageRequire';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Toast from '../../components/Toast';
import ProductCard from '../../components/ProductCard';
import { useFavorites } from '../../hooks/useFavorites';
import * as FileSystem from 'expo-file-system';

// type ProductDetailRouteProp = RouteProp<TabNavigatorParamList, 'CategoryProductDetail'>;

const { width, height } = Dimensions.get('window');

const FAVORITES_FILE = FileSystem.documentDirectory + 'favorites.json';

const CategoryProductDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const product = (categoryProducts as any[]).find((p: any) => p.id === productId);
  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Product not found!</Text>
      </View>
    );
  }
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedZoomImage, setSelectedZoomImage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const scale = useRef(new RNAnimated.Value(1)).current;
  const translateX = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(0)).current;
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const { favorites, reloadFavorites } = useFavorites();
  const isFavorite = favorites.includes(product.id);
  const favoriteScale = useRef(new RNAnimated.Value(1)).current;
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: RNAnimated.event(
        [
          null,
          { dx: translateX, dy: translateY }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        RNAnimated.parallel([
          RNAnimated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }),
          RNAnimated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }),
          RNAnimated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      },
    })
  ).current;

  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollInterval.current = setInterval(() => {
        if (currentIndex < productImages.length - 1) {
          handleNext();
        } else {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }
      }, 2000); // Switch image every 2 seconds
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, isAutoScrolling]);

  // Determine product type based on product category
  const getProductType = () => {
    const category = product.category;
    if (category === 'giay') {
      return 'shoes';
    } else if (category === 'quan_ao' && product.name.toLowerCase().includes('quần')) {
      return 'pants';
    } else {
      return 'clothing';
    }
  };

  const sizes = getProductType() === 'shoes' 
    ? ['38', '39', '40', '41', '42', '43', '44']
    : getProductType() === 'pants'
    ? ['28', '30', '32', '34', '36']
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const productImages = [
    getImageRequire(product.imageDefault || product.image),
    getImageRequire(product.imageDefault || product.image),
    getImageRequire(product.imageDefault || product.image),
  ];

  const handleZoom = (image: string) => {
    setSelectedZoomImage(image);
    setShowZoomModal(true);
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < productImages.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleScroll = () => {
    setIsAutoScrolling(false);
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  const handleFavorite = async () => {
    let favoritesArr = [];
    const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
      favoritesArr = JSON.parse(content);
    }
    if (!isFavorite) {
      if (!favoritesArr.find((item: any) => item.id === product.id)) {
        favoritesArr.push(product);
      }
    } else {
      favoritesArr = favoritesArr.filter((item: any) => item.id !== product.id);
    }
    await FileSystem.writeAsStringAsync(FAVORITES_FILE, JSON.stringify(favoritesArr));
    reloadFavorites();
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToastMessage('Vui lòng chọn size');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!selectedColor) {
      setToastMessage('Vui lòng chọn màu');
      setToastType('error');
      setShowToast(true);
      return;
    }
    // Parse price if string
    const numericPrice = typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, '')) : product.price;
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: numericPrice,
      image: product.imageDefault || product.image || '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
    setToastMessage(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    setToastType('success');
    setShowToast(true);
  };

  const renderCarouselItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <Animated.View
        entering={SlideInRight.delay(index * 100)}
        style={styles.carouselItem}
      >
        <TouchableOpacity 
          style={styles.carouselItem}
          onPress={() => handleZoom(item)}
          activeOpacity={0.9}
        >
          <Image
            source={typeof item === 'string' ? { uri: item } : item}
            style={styles.productImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // SUGGESTED PRODUCTS: lấy các sản phẩm thuộc 'New Arrivals' hoặc 'Best Sellers'
  const suggestedProducts = (categoryProducts as any[])
    .filter(
      (item) =>
        item.collections &&
        (item.collections.includes('New Arrivals') || item.collections.includes('Best Sellers'))
    )
    .slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(500)}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.iconButton}
            onPress={handleFavorite}
          >
            <RNAnimated.View style={{ transform: [{ scale: favoriteScale }] }}>
              <Icon 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={24} 
                color={isFavorite ? "#ff3b30" : "#000"} 
              />
            </RNAnimated.View>
          </Pressable>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={productImages}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={[styles.navButton, styles.navButtonLeft]}
          >
            <TouchableOpacity onPress={handlePrev}>
              <Icon name="chevron-left" size={30} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={[styles.navButton, styles.navButtonRight]}
          >
            <TouchableOpacity onPress={handleNext}>
              <Icon name="chevron-right" size={30} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.imagePagination}>
            {productImages.map((_, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.delay(index * 100)}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
        {/* Color Picker dưới ảnh, trên tên sản phẩm */}
        {product.colors && product.colors.length > 0 && (
          <View style={styles.colorPickerRow}>
            {product.colors.map((color: string) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDotDetail,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 1,
                    borderColor: selectedColor === color ? '#222' : '#ccc',
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        )}

        <Modal
          visible={showZoomModal}
          transparent={true}
          onRequestClose={() => setShowZoomModal(false)}
        >
          <View style={styles.zoomModalContainer}>
            <TouchableOpacity 
              style={styles.zoomCloseButton}
              onPress={() => setShowZoomModal(false)}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <RNAnimated.View
              style={[
                styles.zoomImageContainer,
                {
                  transform: [
                    { scale },
                    { translateX },
                    { translateY },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Image
                source={typeof selectedZoomImage === 'string' ? { uri: selectedZoomImage } : selectedZoomImage}
                style={styles.zoomImage}
                resizeMode="contain"
              />
            </RNAnimated.View>
          </View>
        </Modal>

        {/* Product Info */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.productInfo}
        >
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.price}>
            {`${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`}
          </Text>

          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <View style={styles.sizeHeader}>
              <Text style={styles.sectionTitle}>Size</Text>
              <TouchableOpacity 
                onPress={() => setShowSizeGuide(true)}
                style={styles.sizeGuideButton}
              >
                <Text style={styles.sizeGuide}>Size Guide</Text>
                <Icon name="info-outline" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.sizeContainer}>
              {sizes.map((size, index) => (
                <Animated.View
                  key={size}
                  entering={SlideInRight.delay(index * 100)}
                >
                  <TouchableOpacity
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.selectedSize,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.selectedSizeText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
            {selectedSize ? (
              <Text style={{ marginTop: 8, fontSize: 16, color: '#222', fontWeight: 'bold' }}>
                {product.quantityBySize && typeof product.quantityBySize[selectedSize] === 'number'
                  ? product.quantityBySize[selectedSize] > 0
                    ? `Còn lại: ${product.quantityBySize[selectedSize]}`
                    : 'Hết hàng'
                  : 'Không có dữ liệu'}
              </Text>
            ) : null}
          </View>

          {/* Product Details */}
          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.detailsSection}
          >
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailsList}>
              {[
                { icon: 'check-circle', text: 'Premium material' },
                { icon: 'check-circle', text: 'Modern design' },
                { icon: 'check-circle', text: '12-month warranty' },
              ].map((detail, index) => (
                <Animated.View
                  key={index}
                  entering={SlideInRight.delay(500 + index * 100)}
                  style={styles.detailItem}
                >
                  <Icon name={detail.icon} size={20} color="#000" />
                  <Text style={styles.detailText}>{detail.text}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.description}>
            {product.description}
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>SUGGESTED PRODUCTS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
            {suggestedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.delay(700)}
        style={styles.bottomBar}
      >
        <TouchableOpacity 
          style={styles.addToCartButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Size Guide Modal */}
      <SizeGuideModal
        visible={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productType={getProductType()}
      />

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  carouselItem: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sizeGuide: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedSize: {
    backgroundColor: '#000',
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  sizeText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsList: {
    marginTop: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    lineHeight: 24,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
  zoomModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  zoomImageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: '100%',
    height: '100%',
  },
  sizeGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 12,
  },
  colorDotDetail: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 4,
  },
});

export default CategoryProductDetail; 
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
import { getAllProducts } from '../../api/mockApi';
import { getImageRequire } from '../../utils/imageRequire';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ProductDetailRouteProp = RouteProp<TabNavigatorParamList, 'ProductDetail'>;

const { width, height } = Dimensions.get('window');

const ProductDetail = () => {
  // --- TẤT CẢ HOOK ở đây ---
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
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
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteScale = useRef(new RNAnimated.Value(1)).current;
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [addCartSuccess, setAddCartSuccess] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Các hàm callback không khai báo hook bên trong ---
  const getProductType = React.useCallback(() => {
    if (!product) return 'clothing';
    const category = product.category;
    if (category === 'giay') {
      return 'shoes';
    } else if (category === 'quan_ao' && product.name.toLowerCase().includes('quần')) {
      return 'pants';
    } else {
      return 'clothing';
    }
  }, [product]);

  const getStock = React.useCallback((color: string, size: string | number) => {
    return product?.stockByColorSize?.[`${color}-${size}`] ?? 0;
  }, [product]);

  const handlePrev = React.useCallback(() => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleNext = React.useCallback(() => {
    if (product && currentIndex < (finalProductImages?.length || 1) - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex, product]);

  const renderCarouselItem = React.useCallback(({ item, index }: { item: string; index: number }) => {
    return (
      <Animated.View
        entering={SlideInRight.delay(index * 100)}
        style={styles.carouselItem}
      >
        <TouchableOpacity 
          style={styles.carouselItem}
          onPress={() => {
            setSelectedZoomImage(item);
            setShowZoomModal(true);
            scale.setValue(1);
            translateX.setValue(0);
            translateY.setValue(0);
          }}
          activeOpacity={0.9}
        >
          <Image
            source={typeof item === 'string' 
              ? (item.startsWith('http') ? { uri: item } : getImageRequire(item))
              : item}
            style={styles.productImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // --- useEffect và các hook ở đầu function ---
  useEffect(() => {
    getAllProducts().then(products => {
      console.log('Products loaded:', products.length);
      console.log('Looking for productId:', productId);
      const found = products.find((p: any) => p.id === productId);
      console.log('Found product:', found);
      setProduct(found || null);
    }).catch(error => {
      console.error('Error loading products:', error);
    });
  }, [productId]);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const stock = getStock(selectedColor, selectedSize);
      if (quantity > stock) setQuantity(stock > 0 ? 1 : 0);
    }
  }, [selectedColor, selectedSize, getStock]);

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
    if (isAutoScrolling && product) {
      autoScrollInterval.current = setInterval(() => {
        if (product && currentIndex < (finalProductImages?.length || 1) - 1) {
          handleNext();
        } else {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }
      }, 2000);
    }
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, isAutoScrolling, product, handleNext]);

  // Toast tự động ẩn sau 2 giây
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // --- KHÔNG có hook phía sau đoạn này ---
  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Các biến phụ thuộc vào product
  const sizes = getProductType() === 'shoes'
    ? ['38', '39', '40', '41', '42', '43', '44']
    : getProductType() === 'pants'
    ? ['28', '30', '32', '34', '36']
    : ['S', 'M', 'L', 'XL', 'XXL'];

  // Debug product data
  console.log('Product data:', {
    id: product.id,
    name: product.name,
    image: product.image,
    images: product.images,
    imageDefault: product.imageDefault
  });

  const productImages = product.image 
    ? (product.image.startsWith('http') ? { uri: product.image } : getImageRequire(product.image))
    : product.images && product.images.length > 0
    ? product.images.map((img: string) => {
        // Nếu là URL (bắt đầu bằng http), sử dụng trực tiếp
        if (img.startsWith('http')) {
          return { uri: img };
        }
        // Nếu là local asset, sử dụng getImageRequire
        return getImageRequire(img);
      })
    : product.imageDefault
      ? (product.imageDefault.startsWith('http') ? { uri: product.imageDefault } : getImageRequire(product.imageDefault))
      : [getImageRequire('icon.png')];

  // Ensure productImages is always an array
  const finalProductImages = Array.isArray(productImages) ? productImages : [productImages];
  console.log('Final product images:', finalProductImages);

  const handleZoom = (image: string) => {
    setSelectedZoomImage(image);
    setShowZoomModal(true);
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
  };

  const handleScroll = () => {
    // Pause auto scroll when user interacts
    setIsAutoScrolling(false);
    // Resume auto scroll after 5 seconds of no interaction
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    RNAnimated.sequence([
      RNAnimated.spring(favoriteScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      RNAnimated.spring(favoriteScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
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
    const stock = getStock(selectedColor, selectedSize);
    if (stock === 0) {
      setToastMessage('Hết hàng cho lựa chọn này!');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (quantity > stock) {
      setToastMessage('Vượt quá số lượng tồn kho!');
      setToastType('error');
      setShowToast(true);
      return;
    }
    const numericPrice = typeof product.price === 'string' ? parseInt(product.price.replace(/[^ -9]/g, '')) : product.price;
    // Kiểm tra nếu đã có sản phẩm cùng id, size, color thì chỉ tăng số lượng
    const existing = cartItems.find(
      (item) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
    );
    let addQuantity = quantity;
    if (existing) {
      addQuantity = existing.quantity + quantity;
      if (addQuantity > stock) {
        setToastMessage('Vượt quá số lượng tồn kho!');
        setToastType('error');
        setShowToast(true);
        return;
      }
    }
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: numericPrice,
      image: product.image || product.imageDefault || '',
      color: selectedColor,
      size: selectedSize,
      quantity,
    };
    dispatch(addToCart(cartItem));
    setToastMessage(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    setToastType('success');
    setShowToast(true);
  };


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
          {/* Badge số lượng cart */}
          <View style={{ marginLeft: 8 }}>
            <TouchableOpacity onPress={() => (navigation as any).navigate('CartScreen')}>
              <MaterialCommunityIcons name="cart-outline" size={28} color="#000" />
              {cartCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#ff3b30',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
            data={finalProductImages}
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
            {finalProductImages.map((_: any, index: number) => (
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
                source={typeof selectedZoomImage === 'string' 
                  ? (selectedZoomImage.startsWith('http') ? { uri: selectedZoomImage } : getImageRequire(selectedZoomImage))
                  : selectedZoomImage}
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

          {/* Color Picker dưới tên sản phẩm */}
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            {product.colors.map((color: string) => (
              <TouchableOpacity
                key={color}
                style={{
                  width: 32, height: 32, borderRadius: 16, marginRight: 12,
                  backgroundColor: color,
                  borderWidth: selectedColor === color ? 2 : 1,
                  borderColor: selectedColor === color ? '#000' : '#ccc',
                  justifyContent: 'center', alignItems: 'center'
                }}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Icon name="check" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Hiển thị tồn kho cho tổ hợp màu + size */}
          {selectedColor && selectedSize && (
            <Text style={{ marginTop: 8, color: '#666' }}>
              Số lượng còn: {getStock(selectedColor, selectedSize)}
            </Text>
          )}

          {/* Chọn số lượng */}
          {selectedColor && selectedSize && getStock(selectedColor, selectedSize) > 0 && (
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
                onPress={() => setQuantity(q => Math.min(getStock(selectedColor, selectedSize), q + 1))}
                disabled={quantity >= getStock(selectedColor, selectedSize)}
                style={{ padding: 8, opacity: quantity >= getStock(selectedColor, selectedSize) ? 0.5 : 1 }}
              >
                <Text style={{ fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
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

        <RecommendedProducts currentProductType={getProductType()} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View 
        entering={FadeIn.delay(700)}
        style={styles.bottomBar}
      >
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </Animated.View>

      {addCartSuccess && (
        <View style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 100,
        }}>
          <View style={{backgroundColor: '#222', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24}}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Đã thêm vào giỏ hàng!</Text>
          </View>
        </View>
      )}

      {sizeError && (
        <View style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 100,
        }}>
          <View style={{backgroundColor: '#d32f2f', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24}}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Vui lòng chọn size!</Text>
          </View>
        </View>
      )}

      {/* Toast thông báo */}
      {showToast && (
        <View style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 100,
        }}>
          <View style={{
            backgroundColor: toastType === 'success' ? '#222' : '#d32f2f',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{toastMessage}</Text>
          </View>
        </View>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        visible={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productType={getProductType()}
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
});

export default ProductDetail; 
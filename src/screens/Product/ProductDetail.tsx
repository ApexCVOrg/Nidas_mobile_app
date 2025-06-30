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
import searchProducts from '../../api/searchProducts.json';
import { getImageRequire } from '../../utils/imageRequire';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

type ProductDetailRouteProp = RouteProp<TabNavigatorParamList, 'ProductDetail'>;

const { width, height } = Dimensions.get('window');

const ProductDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const product = (searchProducts as any[]).find((p: any) => p.id === productId);
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
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteScale = useRef(new RNAnimated.Value(1)).current;
  const dispatch = useDispatch();
  const [addCartSuccess, setAddCartSuccess] = useState(false);
  const [sizeError, setSizeError] = useState(false);

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
    getImageRequire(product.image),
    getImageRequire(product.image),
    getImageRequire(product.image),
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
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1000);
      return;
    }
    const size = selectedSize;
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'default';
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseInt(product.price) : product.price,
      image: product.image || product.imageDefault || 'icon.png',
      color,
      size,
      quantity: 1,
    }));
    setAddCartSuccess(true);
    setTimeout(() => {
      setAddCartSuccess(false);
      navigation.goBack();
    }, 1000);
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

        <RecommendedProducts currentProductType={getProductType()} />
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
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabNavigatorParamList } from '../../navigation/TabNavigator';
import { homeStyles } from '../../styles/home/home.styles';
import { getAllProducts } from '../../api/mockApi';
import axios from 'axios';
import { getImageRequire } from '../../utils/imageRequire';
import ProductCard from '../../components/ProductCard';
import { useFavoritesContext } from '../../hooks/FavoritesContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import type { Product } from '../../types/Product';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setOnboardingComplete } from '../../store/slices/onboardingSlice';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<TabNavigatorParamList, 'MainTabs'>;

interface HomeScreenWithPopupProps {
  showTabPopup?: boolean;
  tabPopupType?: 'favorites' | 'cart' | null;
  setShowTabPopup?: (v: boolean) => void;
  setTabPopupType?: (v: 'favorites' | 'cart' | null) => void;
}

const HomeScreen: React.FC<HomeScreenWithPopupProps> = ({ showTabPopup, tabPopupType, setShowTabPopup, setTabPopupType }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  
  
  const [showBanner, setShowBanner] = useState(!isLoggedIn);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerFlatListRef = useRef<FlatList>(null);

  // State for mock data
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);

  const { favorites, addFavorite, removeFavorite } = useFavoritesContext();
  const dispatch = useDispatch();

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Update banner visibility when login status changes
  useEffect(() => {
    setShowBanner(!isLoggedIn);
  }, [isLoggedIn]);

  // Auto-scroll banner
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % bannerImages.length;
        bannerFlatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setBannerIndex(viewableItems[0].index);
    }
  }).current;
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // useEffect lấy dữ liệu từ mock API
  useEffect(() => {
    // Lấy tất cả products
    getAllProducts().then(products => {
      // Lấy 8 sản phẩm đầu tiên làm featuredProducts (hoặc lọc theo tiêu chí khác nếu muốn)
      setFeaturedProducts(products.slice(0, 8));
    });

    // Lấy categories
    axios.get('http://192.168.100.233:3000/categories').then(res => setCategories(res.data));

    // Lấy collections
    axios.get('http://192.168.100.233:3000/collections').then(res => setCollections(res.data));

    // Lấy bannerImages (chỉ lấy trường image)
    axios.get('http://192.168.100.233:3000/bannerImages').then(res => setBannerImages(res.data.map((b: any) => b.image)));
  }, []);

  const handleCategoryPress = (category: { id: string; name: string; icon?: string }) => {
    navigation.navigate('Category', {
      categoryId: category.id,
      title: category.name,
    });
  };

  const handleProductPress = (product: typeof featuredProducts[0]) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
    });
  };

  const renderHomeProduct = (product: Product) => {
    const isFavorite = favorites.includes(product.id);
    const handleToggleFavorite = async () => {
      if (isFavorite) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product);
      }
    };
    return (
      <ProductCard
        product={product}
        onPress={() => handleProductPress(product)}
        onRequireLogin={() => setShowLoginPopup(true)}
      />
    );
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={homeStyles.headerV2}>
        <View style={homeStyles.headerTopRow}>
          <Text style={homeStyles.greetingText}>NIDAS</Text>
          <View style={homeStyles.headerIconsRight}>
            <TouchableOpacity 
              style={homeStyles.iconButton}
              onPress={() => {
                if (!token) {
                  navigation.navigate('Auth' as never);
                } else {
                  navigation.navigate('UserProfile' as never);
                }
              }}
            >
              <Icon name="person-outline" size={26} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Banner thông báo */}
      {showBanner && (
        <View style={homeStyles.loginBanner}>
          <Icon name="person-outline" size={32} color="#fff" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={homeStyles.bannerTitle}>Buy the way you want</Text>
            <Text style={homeStyles.bannerDesc}>
              Your personalized store is waiting for you. Receive new suggestions and exclusive access only for members.
            </Text>
          </View>
          <TouchableOpacity style={homeStyles.loginBannerButton} onPress={() => navigation.navigate('Auth')}>
            <Text style={homeStyles.loginBannerButtonText}>LOGIN NOW</Text>
            <Icon name="arrow-forward-ios" size={16} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.closeBannerButton} onPress={() => setShowBanner(false)}>
            <Icon name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Popup khi chưa login và bấm tab */}
      {showTabPopup && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
          <View style={{backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', width: 300}}>
            <Text style={{color: '#d32f2f', fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Bạn chưa đăng nhập</Text>
            <Text style={{color: '#222', fontSize: 15, marginBottom: 24, textAlign: 'center'}}>
              {tabPopupType === 'favorites' ? 'Vui lòng đăng nhập để xem yêu thích!' : 'Vui lòng đăng nhập để xem giỏ hàng!'}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity style={{flex: 1, marginRight: 8, backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowTabPopup && setShowTabPopup(false); setTabPopupType && setTabPopupType(null); }}>
                <Text style={{color: '#222', fontWeight: 'bold'}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginLeft: 8, backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowTabPopup && setShowTabPopup(false); setTabPopupType && setTabPopupType(null); navigation.navigate('Auth' as never); }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Pop-up đăng nhập toàn màn hình */}
      {showLoginPopup && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
          <View style={{backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', width: 300}}>
            <Text style={{color: '#d32f2f', fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Bạn chưa đăng nhập</Text>
            <Text style={{color: '#222', fontSize: 15, marginBottom: 24, textAlign: 'center'}}>Vui lòng đăng nhập để sử dụng tính năng yêu thích!</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity style={{flex: 1, marginRight: 8, backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => setShowLoginPopup(false)}>
                <Text style={{color: '#222', fontWeight: 'bold'}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginLeft: 8, backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowLoginPopup(false); navigation.navigate('Auth' as never); }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner Carousel */}
        <View style={homeStyles.heroBanner}>
          <FlatList
            ref={bannerFlatListRef}
            data={bannerImages}
            keyExtractor={(_, idx) => idx.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={getImageRequire(item)} style={homeStyles.heroBannerCarousel} resizeMode="cover" />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewConfigRef.current}
          />
          <View style={homeStyles.heroBannerDotsContainer}>
            {bannerImages.map((_, idx) => (
              <View
                key={idx}
                style={[homeStyles.heroBannerDot, bannerIndex === idx && homeStyles.heroBannerDotActive]}
              />
            ))}
          </View>
          <View style={homeStyles.heroContent} pointerEvents="box-none">
            <Text style={homeStyles.heroTitle}>NEW COLLECTION</Text>
            <Text style={homeStyles.heroSubtitle}>Discover now</Text>
            <TouchableOpacity style={homeStyles.heroButton}>
              <Text style={homeStyles.heroButtonText}>BUY NOW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={homeStyles.categoriesContainer}>
          <Text style={homeStyles.sectionTitle}>CATEGORIES</Text>
          <View style={homeStyles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={homeStyles.categoryItem} onPress={() => handleCategoryPress(category)}>
                <View style={homeStyles.categoryIcon}>
                  <Icon name={category.icon} size={24} color="#000" />
                </View>
                <Text style={homeStyles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={homeStyles.productsContainer}>
          <Text style={homeStyles.sectionTitle}>FEATURED PRODUCTS</Text>
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderHomeProduct(item)}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Collections */}
        <View style={homeStyles.collectionsContainer}>
          {collections.map((collection) => (
            <TouchableOpacity key={collection.id} style={homeStyles.collectionCard}>
              <Image
                source={getImageRequire(collection.image)}
                style={homeStyles.collectionImage}
                resizeMode="cover"
              />
              <View style={homeStyles.collectionOverlay}>
                <Text style={homeStyles.collectionTitle}>{collection.name}</Text>
                <TouchableOpacity style={homeStyles.collectionButton}>
                  <Text style={homeStyles.collectionButtonText}>VIEW MORE</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 
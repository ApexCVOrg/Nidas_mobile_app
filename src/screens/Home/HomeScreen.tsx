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
import homeData from '../../api/homeData.json';
import { getImageRequire } from '../../utils/imageRequire';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<TabNavigatorParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showBanner, setShowBanner] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerFlatListRef = useRef<FlatList>(null);

  // State for mock data
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);

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

  // Load mock data from JSON
  useEffect(() => {
    setCategories(homeData.categories);
    setFeaturedProducts(homeData.featuredProducts);
    setCollections(homeData.collections);
    setBannerImages(homeData.bannerImages);
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

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={homeStyles.headerV2}>
        <View style={homeStyles.headerTopRow}>
          <Text style={homeStyles.greetingText}>NIDAS</Text>
          <View style={homeStyles.headerIconsRight}>
            <TouchableOpacity style={homeStyles.iconButton}>
              <Icon name="search" size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={homeStyles.iconButton}
              onPress={() => navigation.navigate('UserProfile' as never)}
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
          <TouchableOpacity style={homeStyles.loginBannerButton} onPress={() => navigation.navigate('Login')}>
            <Text style={homeStyles.loginBannerButtonText}>LOGIN NOW</Text>
            <Icon name="arrow-forward-ios" size={16} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.closeBannerButton} onPress={() => setShowBanner(false)}>
            <Icon name="close" size={18} color="#fff" />
          </TouchableOpacity>
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
          <View style={homeStyles.productsList}>
            {featuredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={homeStyles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <Image
                  source={getImageRequire(product.image)}
                  style={homeStyles.productImage}
                  resizeMode="cover"
                />
                <View style={homeStyles.productInfo}>
                  <Text style={homeStyles.productName}>{product.name}</Text>
                  <Text style={homeStyles.productDescription}>{product.description}</Text>
                  <Text style={homeStyles.productPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
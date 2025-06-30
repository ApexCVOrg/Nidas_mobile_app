import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, NativeSyntheticEvent, LayoutChangeEvent, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/Product';
import productsData from '../api/categoryProducts.json';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import HorizontalProductCarousel from '../components/HorizontalProductCarousel';
import { useFavorites } from '../hooks/useFavorites';

const { width } = Dimensions.get('window');
const carouselHeight = 180;
const carouselWidth = width;

type RouteParams = {
  categoryId: string;
  title: string;
};

type CategoryScreenNavigationProp = NativeStackNavigationProp<TabNavigatorParamList, 'Category'>;

// New type for category layouts
type CategoryLayouts = { [key: string]: { x: number; width: number; }; };

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryId, title } = route.params as RouteParams;

  const [sortOrder, setSortOrder] = useState('newest'); // State for sorting order
  const [isSortDropdownVisible, setSortDropdownVisible] = useState(false); // State for dropdown visibility

  // For GooeyNav effect
  const translateX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const categoryRefs = useRef<Record<string, View | null>>({});
  const [categoryLayouts, setCategoryLayouts] = useState<CategoryLayouts>({});

  // Thêm state và ref cho auto scroll carousel
  const bannerScrollRef = useRef<ScrollView>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerImages = [
    require('../../assets/category_images/Alien_Predator_Football.gif'),
    require('../../assets/category_images/Shocked_Sport_adidas.gif'),
  ];

  const categories = [
    { id: 'men', name: 'Men', icon: 'person' },
    { id: 'women', name: 'Women', icon: 'person-2' },
    { id: 'kids', name: 'Kids', icon: 'child-care' },
    { id: 'sport', name: 'Sports', icon: 'sports-basketball' },
    { id: 'accessories', name: 'Accessories', icon: 'watch' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A-Z', value: 'name_asc' },
  ];

  const { favorites, reloadFavorites } = useFavorites();

  const handleCategoryPress = (category: { id: string; name: string }) => {
    navigation.navigate('Category', {
      categoryId: category.id,
      title: category.name,
    });
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setSortDropdownVisible(false); // Close dropdown after selection
  };

  const handleToggleFavorite = () => {
    reloadFavorites();
  };

  const groupedProducts = useMemo(() => {
    let filteredAndSortedProducts = (productsData as unknown as Product[]).filter(
      (item) => item.category === categoryId
    );

    switch (sortOrder) {
      case 'price_asc':
        filteredAndSortedProducts.sort(
          (a, b) =>
            parseFloat(String(a.price).replace('.', '').replace(' VNĐ', '')) -
            parseFloat(String(b.price).replace('.', '').replace(' VNĐ', ''))
        );
        break;
      case 'price_desc':
        filteredAndSortedProducts.sort(
          (a, b) =>
            parseFloat(String(b.price).replace('.', '').replace(' VNĐ', '')) -
            parseFloat(String(a.price).replace('.', '').replace(' VNĐ', ''))
        );
        break;
      case 'name_asc':
        filteredAndSortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // No specific sorting for newest, relies on original order or can add a timestamp
        break;
    }

    const collectionsMap: { [key: string]: Product[] } = {};
    filteredAndSortedProducts.forEach((product) => {
      product.collections?.forEach((collectionName) => {
        if (!collectionsMap[collectionName]) {
          collectionsMap[collectionName] = [];
        }
        collectionsMap[collectionName].push(product);
      });
    });

    return Object.entries(collectionsMap).map(([name, products]) => ({
      name,
      products,
    }));
  }, [categoryId, sortOrder]);

  const currentSortLabel = sortOptions.find(option => option.value === sortOrder)?.label || 'Newest';

  // Measure layout of each category item
  const onCategoryLayout = (event: LayoutChangeEvent, id: string) => {
    const { x, width } = event.nativeEvent.layout;
    setCategoryLayouts(prev => ({ ...prev, [id]: { x, width } }));
  };

  // Animate indicator when categoryId changes or layouts are measured
  useEffect(() => {
    if (categoryLayouts[categoryId]) {
      const { x, width } = categoryLayouts[categoryId];
      translateX.value = withSpring(x, { damping: 15, stiffness: 100 });
      indicatorWidth.value = withSpring(width, { damping: 15, stiffness: 100 });
    } else {
      // If layout not yet available, try to find the active index and measure it
      const activeIndex = categories.findIndex(cat => cat.id === categoryId);
      if (activeIndex !== -1 && categoryRefs.current[categoryId]) {
        // Use a slight delay to ensure layout is measured
        setTimeout(() => {
          categoryRefs.current[categoryId]?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            runOnJS(setCategoryLayouts)(prev => ({ ...prev, [categoryId]: { x: px, width } }));
          });
        }, 50);
      }
    }
  }, [categoryId, categoryLayouts]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: indicatorWidth.value,
    };
  });

  // Auto scroll banner carousel mỗi 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bannerScrollRef.current) {
      bannerScrollRef.current.scrollTo({
        x: bannerIndex * carouselWidth,
        animated: true,
      });
    }
  }, [bannerIndex]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.fullScreenScrollContent}>
        {/* Carousel Banner */}
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ height: carouselHeight, marginBottom: 12 }}
          scrollEventThrottle={16}
          onMomentumScrollEnd={e => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / carouselWidth);
            setBannerIndex(newIndex);
          }}
        >
          {bannerImages.map((img, idx) => (
            <View key={idx} style={{ width: carouselWidth, height: carouselHeight, paddingRight: 10 }}>
              <Image source={img} style={{ width: carouselWidth, height: carouselHeight, borderRadius: 12 }} />
            </View>
          ))}
        </ScrollView>

        {/* Categories at the top of Category Screen */}
        <View style={styles.categoriesContainerWrapper}>
          <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                ref={(el: View | null) => { categoryRefs.current[category.id] = el; }}
                onLayout={(event) => onCategoryLayout(event, category.id)}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryIcon}>
                  <Icon name={category.icon} size={24} color={category.id === categoryId ? '#868f96' : '#000'} />
                </View>
                <Text style={[styles.categoryName, category.id === categoryId && styles.activeCategoryName]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Custom Sort Dropdown */}
        <View style={styles.sortDropdownContainer}>
          <TouchableOpacity onPress={() => setSortDropdownVisible(!isSortDropdownVisible)} style={styles.sortDropdownButton}>
            <Text style={styles.currentSortLabel}>{currentSortLabel}</Text>
            <Icon name={isSortDropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#555" />
          </TouchableOpacity>
          {isSortDropdownVisible && (
            <View style={styles.dropdownOptionsContainer}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => handleSortChange(option.value)}
                >
                  <Text style={[styles.dropdownOptionText, sortOrder === option.value && styles.activeDropdownOptionText]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Horizontal Product Carousel Demo */}
        <HorizontalProductCarousel
          data={[
            {
              id: '1',
              name: 'MAN UTD 25/26 HOME KIT',
              description: 'Một lời tri ân dành cho Nhà hát của những giấc mơ',
              image: require('../../assets/category_images/ManU_home.jpg'),
              cta: 'Mua ngay',
              screen: 'BannerDetailManchester',
            },
            {
              id: '2',
              name: 'ClimaCool',
              description: 'Thiết kế mới, chất liệu cao cấp',
              image: require('../../assets/category_images/Climacool.jpg'),
              cta: 'Xem chi tiết',
              screen: 'BannerDetailClimacool',
            },
          ]}
          onPressItem={item => item.screen && navigation.navigate(item.screen as any, { item })}
        />

        {/* Sản phẩm và các collection */}
        {groupedProducts.map((collection, index) => (
          <View key={index} style={styles.collectionSection}>
            <View style={styles.collectionHeader}>
              <Text style={styles.collectionTitle}>{collection.name}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllButtonText}>XEM TẤT CẢ <Icon name="arrow-forward" size={12} color="#000" /></Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScrollContainer}>
              {collection.products.map(product => (
                <View key={product.id} style={{ position: 'relative' }}>
                  <ProductCard
                    product={product}
                    onPress={() => navigation.navigate('CategoryProductDetail', { productId: product.id })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  fullScreenScrollContent: {
    paddingBottom: 32,
  },
  productsScrollContainer: {
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  categoriesContainerWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryItem: {
    width: '18%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  activeCategoryName: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  sortDropdownContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 1,
    position: 'relative',
  },
  sortDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sortByText: {
    fontSize: 14,
    color: '#555',
    marginRight: 10,
  },
  currentSortLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  dropdownOptionsContainer: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  activeDropdownOptionText: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  activeIndicator: {
    position: 'absolute',
    height: 100,
    backgroundColor: '#596164',
    borderRadius: 30,
    opacity: 0.155,
  },
  collectionSection: {
    marginBottom: 20,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  viewAllButtonText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default CategoryScreen; 
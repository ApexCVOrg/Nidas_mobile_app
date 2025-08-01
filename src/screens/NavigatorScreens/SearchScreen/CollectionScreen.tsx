import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import searchProducts from '../../../api/searchProducts.json';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../types/Product';
import { getImageRequire } from '../../../utils/imageRequire';
import styles from '../../../styles/search/collection.styles';
import { useFavorites } from '../../../hooks/useFavorites';

type SearchStackParamList = {
  SearchMain: undefined;
  Collection: { collectionId: number; title: string; subtitle: string };
  ProductDetail: { productId: string };
};

type CollectionRouteProp = RouteProp<SearchStackParamList, 'Collection'>;
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

const CollectionScreen = () => {
  const route = useRoute<CollectionRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { collectionId, title, subtitle } = route.params;
  const { favorites, reloadFavorites } = useFavorites();

  // Filter products based on collection
  const collectionProducts = useMemo(() => {
    let filteredProducts: Product[] = [];
    
    switch (collectionId) {
      case 1: // SL 72
        filteredProducts = (searchProducts as any[]).filter(product => 
          (product.collections && product.collections.includes('SL')) ||
          (product.tags && product.tags.includes('sl72')) ||
          product.name.toLowerCase().includes('sl 72')
        );
        break;
      case 2: // Handball Spezial
        filteredProducts = (searchProducts as any[]).filter(product => 
          product.collections && product.collections.includes('Handball')
        );
        break;
      case 3: // Ultraboost (bao gồm cả Pureboost)
        filteredProducts = (searchProducts as any[]).filter(product => 
          (product.collections && (product.collections.includes('Ultraboost') || product.collections.includes('Pureboost')))
        );
        break;
      case 4: // Sport Essentials
        filteredProducts = (searchProducts as any[]).filter(product => 
          (product.collections && product.collections.includes('Sport')) ||
          (product.tags && (product.tags.includes('sport') ||
          product.tags.includes('training') ||
          product.tags.includes('essentials'))) ||
          (product.type && product.type === 'sport')
        );
        break;
      default:
        filteredProducts = (searchProducts as any[]).slice(0, 8);
    }
    
    return filteredProducts;
  }, [collectionId]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleToggleFavorite = () => {
    reloadFavorites();
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard 
      product={{
        ...item,
        image: typeof item.image === 'string' ? getImageRequire(item.image) : item.image
      }}
      onPress={() => handleProductPress(item)}
    />
  );

  const getCollectionDescription = () => {
    switch (collectionId) {
      case 1:
        return 'Discover the exclusive collection from the collaboration between Pharrell Williams and adidas. Creative designs combining streetwear style and athletic performance.';
      case 2:
        return 'The Handball Spezial collection recreates the classic beauty of the 70s-80s with distinctive retro design and timeless quality.';
      case 3:
        return 'Nike Collection brings premium sports products with advanced technology and iconic design from the Just Do It brand.';
      case 4:
        return 'Arsenal Collection - Essential sports products for every activity from daily training to professional competition.';
      default:
        return 'Discover the curated product collection with top quality and design.';
    }
  };

  const getCollectionStats = () => {
    return {
      products: collectionProducts.length,
      categories: new Set(collectionProducts.map(p => p.category)).size,
      avgPrice: Math.round(collectionProducts.reduce((sum, p) => {
        const price = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : p.price;
        return sum + price;
      }, 0) / collectionProducts.length)
    };
  };

  const stats = getCollectionStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Collection Info */}
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionDescription}>
          {getCollectionDescription()}
        </Text>
        <View style={styles.collectionStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.categories}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(stats.avgPrice)}
            </Text>
            <Text style={styles.statLabel}>Avg Price</Text>
          </View>
        </View>
      </View>

      {/* Products Grid */}
      {collectionId === 2 ? (
        <>
          {/* ScrollView ngang cho 3 sản phẩm Handball Spezial */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
            style={{ minHeight: 340 }}
          >
            {collectionProducts.map((item) => (
              <View key={item.id} style={styles.horizontalProductCard}>
                <ProductCard 
                  product={item}
                  onPress={() => handleProductPress(item)}
                />
              </View>
            ))}
          </ScrollView>
          {/* Section mô tả/banner phía dưới */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Về Handball Spezial</Text>
            <Text style={styles.sectionSubtitle}>
              Dòng giày retro nổi tiếng từ thập niên 70-80, mang lại phong cách cổ điển và chất lượng vượt thời gian. Chất liệu cao cấp, thiết kế tối giản, phù hợp cả thể thao lẫn thời trang hàng ngày.
            </Text>
            <Image
              source={require('../../../../assets/SearchPage/Banner/Handball_banner.jpg')}
              style={{ width: '100%', height: 120, borderRadius: 12, marginTop: 12 }}
              resizeMode="cover"
            />
          </View>
        </>
      ) : collectionId === 3 ? (
        <>
          {/* ScrollView ngang cho sản phẩm Ultraboost/Pureboost */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
            style={{ minHeight: 340 }}
          >
            {collectionProducts.map((item) => (
              <View key={item.id} style={styles.horizontalProductCard}>
                <ProductCard 
                  product={item}
                  onPress={() => handleProductPress(item)}
                />
              </View>
            ))}
          </ScrollView>
          {/* Banner Ultraboost phía dưới */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Về Ultraboost & Pureboost</Text>
            <Text style={styles.sectionSubtitle}>
              Công nghệ Boost độc quyền, thiết kế tối ưu cho chạy bộ và thời trang. Đệm siêu êm, hoàn trả năng lượng vượt trội, phù hợp cả luyện tập lẫn lifestyle.
            </Text>
            <Image
              source={require('../../../../assets/SearchPage/Banner/Ultraboost_banner.png')}
              style={{ width: '100%', height: 120, borderRadius: 12, marginTop: 12 }}
              resizeMode="cover"
            />
          </View>
        </>
      ) : collectionId === 4 ? (
        // Arsenal Collection - Horizontal Scroll
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arsenal Collection</Text>
            <Text style={styles.sectionSubtitle}>Essential sports products for every activity</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {collectionProducts.map((item) => (
              <View key={item.id} style={styles.horizontalProductCard}>
                <ProductCard 
                  product={item}
                  onPress={() => handleProductPress(item)}
                />
              </View>
            ))}
          </ScrollView>

          {/* Additional Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Arsenal?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>Premium quality materials</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>Professional performance</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>Comfortable fit</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>Durable construction</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <View style={styles.newsCard}>
              <Image 
                source={require('../../../../assets/arsenal_banner.jpg')} 
                style={styles.newsImage}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>New Arsenal Kit Launch</Text>
                <Text style={styles.newsDescription}>
                  Discover the latest Arsenal collection featuring innovative technology and classic design.
                </Text>
                <TouchableOpacity style={styles.newsButton}>
                  <Text style={styles.newsButtonText}>Read More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : collectionProducts.length > 0 ? (
        <FlatList
          data={collectionProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Products Yet</Text>
          <Text style={styles.emptyText}>
            This collection is being updated. Please check back later.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CollectionScreen; 
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import searchProducts from '../../../api/searchProducts.json';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../types/Product';
import styles from '../../../styles/search/collection.styles';

type SearchStackParamList = {
  SearchMain: undefined;
  Collection: { collectionId: number; title: string; subtitle: string };
  ProductDetail: { product: Product };
};

type CollectionRouteProp = RouteProp<SearchStackParamList, 'Collection'>;
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

const CollectionScreen = () => {
  const route = useRoute<CollectionRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { collectionId, title, subtitle } = route.params;

  // Filter products based on collection
  const collectionProducts = useMemo(() => {
    let filteredProducts: Product[] = [];
    
    switch (collectionId) {
      case 1: // Pharrell Williams
        filteredProducts = (searchProducts as Product[]).filter(product => 
          (product.tags && product.tags.includes('pharrell')) || 
          product.name.toLowerCase().includes('pharrell') ||
          (product.type && product.type === 'collaboration')
        );
        break;
      case 2: // Handball Spezial
        filteredProducts = (searchProducts as Product[]).filter(product => 
          (product.tags && (product.tags.includes('handball') ||
          product.tags.includes('spezial') ||
          product.tags.includes('retro'))) ||
          (product.type && product.type === 'originals')
        );
        break;
      case 3: // Nike Collection (mock Nike products from available data)
        filteredProducts = (searchProducts as Product[]).filter(product => 
          (product.tags && (product.tags.includes('boost') ||
          product.tags.includes('running') ||
          product.tags.includes('performance'))) ||
          product.category === 'giay'
        ).slice(0, 6);
        break;
      case 4: // Sport Essentials
        filteredProducts = (searchProducts as Product[]).filter(product => 
          (product.tags && (product.tags.includes('sport') ||
          product.tags.includes('training') ||
          product.tags.includes('essentials'))) ||
          (product.type && product.type === 'sport')
        );
        break;
      default:
        filteredProducts = (searchProducts as Product[]).slice(0, 8);
    }
    
    return filteredProducts;
  }, [collectionId]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item}
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
      {collectionProducts.length > 0 ? (
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
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../../../styles/search/search.styles';
import searchProducts from '../../../api/searchProducts.json';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../types/Product';
import { useFavorites } from '../../../hooks/useFavorites';

type SearchResultsRouteProp = {
  params: {
    searchQuery: string;
  };
};

type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { searchQuery: string };
  ProductDetail: { productId: string };
  Product: undefined;
  Introduction: {
    bannerId: number;
    title: string;
    subtitle: string;
  };
};

type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

const SearchResultsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { searchQuery } = route.params;
  const { favorites, reloadFavorites } = useFavorites();

  // Fuzzy search function (same as in SearchScreen)
  const fuzzySearch = (text: string, target: string): boolean => {
    if (!text || !target) return false;
    
    const searchLower = text.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Exact match
    if (targetLower.includes(searchLower)) return true;
    
    // Fuzzy matching - check if characters appear in order
    let searchIndex = 0;
    for (let i = 0; i < targetLower.length && searchIndex < searchLower.length; i++) {
      if (targetLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Get search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return (searchProducts as Product[]).filter(product => {
      return (
        fuzzySearch(searchQuery, product.name) ||
        (product.tags && product.tags.some(tag => fuzzySearch(searchQuery, tag))) ||
        fuzzySearch(searchQuery, product.category) ||
        (product.type && fuzzySearch(searchQuery, product.type)) ||
        (product.colors && product.colors.some(color => fuzzySearch(searchQuery, color)))
      );
    });
  }, [searchQuery]);

  const handleToggleFavorite = () => {
    reloadFavorites();
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item}
      onPress={() => handleProductPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.searchResultsHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchResultsHeaderContent}>
          <Text style={styles.searchResultsTitle}>Search Results</Text>
          <Text style={styles.searchResultsQuery}>"{searchQuery}"</Text>
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsCountContainer}>
        <Text style={styles.resultsCountText}>
          {searchResults.length > 0 
            ? `Found ${searchResults.length} products`
            : 'No products found'
          }
        </Text>
      </View>

      {/* Results List */}
      {searchResults.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
          style={{ paddingHorizontal: 10 }}
        >
          {searchResults.map((item) => (
            <View key={item.id} style={{ marginRight: 16 }}>
              <ProductCard 
                product={item}
                onPress={() => handleProductPress(item)}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noResultsFullContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.noResultsFullTitle}>No products found</Text>
          <Text style={styles.noResultsFullText}>
            Try searching with a different keyword or check your spelling
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchResultsScreen; 
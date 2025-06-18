import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from '../../../styles/search/search.styles';
import searchProducts from '../../../api/searchProducts.json';
import { Product } from '../../../types/Product';

const { width } = Dimensions.get('window');

type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { searchQuery: string };
  ProductDetail: { product: Product };
  Product: undefined;
  Introduction: {
    bannerId: number;
    title: string;
    subtitle: string;
  };
};

type NavigationProp = StackNavigationProp<SearchStackParamList>;

type Banner = {
  id: number;
  image: any;
  title: string;
  subtitle: string;
};

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('nam'); // 'nam', 'nu', 'tre_em'
  const [searchText, setSearchText] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const bannerScrollRef = useRef(null);

  // Fuzzy search function
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

  // Suggested products (popular/featured items)
  const suggestedProducts = useMemo(() => {
    const productIds = ['p001', 'p003', 'p004', 'p005', 'p006', 'p008'];
    return productIds
      .map(id => (searchProducts as Product[]).find(p => p.id === id))
      .filter((product): product is NonNullable<typeof product> => product !== undefined)
      .slice(0, 6);
  }, []);

  // Search results with fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchText.trim()) {
      // Show suggested products when no search text
      return isSearchFocused ? suggestedProducts : [];
    }
    
    return (searchProducts as Product[]).filter(product => {
      return (
        fuzzySearch(searchText, product.name) ||
        product.tags.some(tag => fuzzySearch(searchText, tag)) ||
        fuzzySearch(searchText, product.category) ||
        fuzzySearch(searchText, product.type) ||
        product.colors.some(color => fuzzySearch(searchText, color))
      );
    }).slice(0, 8); // Limit to 8 results
  }, [searchText, isSearchFocused, suggestedProducts]);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    setShowSearchResults(text.trim().length > 0 || isSearchFocused);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow for product selection
    setTimeout(() => {
      setIsSearchFocused(false);
      if (!searchText.trim()) {
        setShowSearchResults(false);
      }
    }, 200);
  };

  const handleProductSelect = (product: Product) => {
    setSearchText('');
    setShowSearchResults(false);
    setIsSearchFocused(false);
    
    // Navigate to ProductScreen for Pharrell Williams x Tennis Hu specifically
    if (product.id === 'p005' || product.name === 'Pharrell Williams x Tennis Hu') {
      navigation.navigate('Product');
    } else {
      // Navigate to product detail screen for other products
      navigation.navigate('ProductDetail', { product });
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      setShowSearchResults(false);
      navigation.navigate('SearchResults', { searchQuery: searchText.trim() });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getImageSource = (imageName: string) => {
    // Map image names to require statements
    const imageMap: { [key: string]: any } = {
      'samba.gif': require('../../../../assets/samba.gif'),
      'sl72.gif': require('../../../../assets/sl72.gif'),
      'yeezy750.gif': require('../../../../assets/yeezy750.gif'),
      'handball.gif': require('../../../../assets/handball.gif'),
      'banner1.gif': require('../../../../assets/banner1.gif'),
      'nike.gif': require('../../../../assets/nike.gif'),
      'Giay_Ultraboost_22.jpg': require('../../../../assets/Giay_Ultraboost_22.jpg'),
      'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
      'Ao_Thun_Polo_Ba_La.jpg': require('../../../../assets/Ao_Thun_Polo_Ba_La.jpg'),
      'Quan_Hiking_Terrex.jpg': require('../../../../assets/Quan_Hiking_Terrex.jpg'),
      'aoadidasden.png': require('../../../../assets/aoadidasden.png'),
      'aoadidastrang.png': require('../../../../assets/aoadidastrang.png'),
      'aoadidasxanh.png': require('../../../../assets/aoadidasxanh.png'),
      'ao1.jpg': require('../../../../assets/ao1.jpg'),
      'ao3.jpg': require('../../../../assets/ao3.jpg'),
      'ao4.jpg': require('../../../../assets/ao4.jpg'),
      'ao5.jpg': require('../../../../assets/ao5.jpg'),
      'quan1.jpg': require('../../../../assets/quan1.jpg'),
      'quan2.jpg': require('../../../../assets/quan2.jpg'),
      'quan3.jpg': require('../../../../assets/quan3.jpg'),
    };
    
    return imageMap[imageName] || require('../../../../assets/icon.png');
  };

  const originalsClassics = [
    { id: 1, name: 'SAMBA', image: require('../../../../assets/samba.gif') },
    { id: 2, name: 'SL 72', image: require('../../../../assets/sl72.gif') },
    { id: 3, name: 'YEEZY', image: require('../../../../assets/yeezy750.gif') },
  ];

  // Sample data for each category
  const giayCategories = [
    { id: 'all', name: 'ALL SHOES', image: require('../../../../assets/samba.gif') },
    { id: 'new', name: 'NEW ARRIVALS', image: require('../../../../assets/sl72.gif') },
    { id: 'run', name: 'RUNNING', image: require('../../../../assets/yeezy750.gif') },
  ];
  const quanAoCategories = [
    { id: 'all', name: 'ALL CLOTHING', image: require('../../../../assets/ao1.jpg') },
    { id: 'new', name: 'NEW ARRIVALS', image: require('../../../../assets/ao1.jpg') },
    { id: 'tshirt', name: 'T-SHIRTS & TOPS', image: require('../../../../assets/ao3.jpg') },
    { id: 'jersey', name: 'JERSEYS', image: require('../../../../assets/ao4.jpg') },
    { id: 'short', name: 'SHORTS', image: require('../../../../assets/quan1.jpg') },
    { id: 'pants', name: 'PANTS', image: require('../../../../assets/quan2.jpg') },
    { id: 'tight', name: 'TIGHTS', image: require('../../../../assets/quan3.jpg') },
    { id: 'hoodie', name: 'HOODIES & SWEATSHIRTS', image: require('../../../../assets/ao5.jpg') },
  ];
  const phuKienCategories = [
    { id: 'all', name: 'ALL ACCESSORIES', image: require('../../../../assets/yeezy750.gif') },
    { id: 'bag', name: 'BAGS', image: require('../../../../assets/sl72.gif') },
    { id: 'cap', name: 'CAPS', image: require('../../../../assets/samba.gif') },
  ];

  const banners: Banner[] = [
    { id: 1, image: require('../../../../assets/banner1.gif'), title: 'BD7530', subtitle: 'Pharrell Williams x Tennis Hu.' },
    { id: 2, image: require('../../../../assets/banner2.gif'), title: 'HANDBALL SPEZIAL', subtitle: 'Step into retro-inspired design.' },
    { id: 3, image: require('../../../../assets/nike.gif'), title: 'NIKE COLLECTION', subtitle: 'Just Do It - Nike Collection.' },
    { id: 4, image: require('../../../../assets/arsenal_banner.jpg'), title: 'ARSENAL', subtitle: 'North London Forever.' },
  ];

  const handleBannerPress = (banner: Banner) => {
    if (banner.id === 1) {
      navigation.navigate('Product');
    } else {
      navigation.navigate('Introduction', {
        bannerId: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>STORE</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Section */}
      <View style={styles.searchSection}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchInputIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#666"
          value={searchText}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearchSubmit}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchText('');
                setShowSearchResults(false);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {/* Header for suggestions */}
            {!searchText.trim() && isSearchFocused && (
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsHeaderText}>Suggested Products</Text>
              </View>
            )}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.searchResultItem}
                  onPress={() => handleProductSelect(item)}
                >
                  <Image 
                    source={getImageSource(item.image)}
                    style={styles.searchResultImage}
                    defaultSource={require('../../../../assets/icon.png')}
                  />
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.searchResultPrice}>
                      {formatPrice(item.price)}
                    </Text>
                    <Text style={styles.searchResultCategory}>
                      {item.category === 'giay' ? 'Shoes' : 'Clothing'} • {item.gender}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
              )}
              style={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* No Results */}
        {showSearchResults && searchText.length > 0 && searchResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No products found</Text>
          </View>
        )}
      </View>

      {/* Gender Tabs */}
      {/* <View style={styles.genderTabsContainer}>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'nam' && styles.activeGenderTab]}
          onPress={() => setActiveTab('nam')}
        >
          <Text style={[styles.genderTabText, activeTab === 'nam' && { color: '#000' }]}>NAM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'nu' && styles.activeGenderTab]}
          onPress={() => setActiveTab('nu')}
        >
          <Text style={[styles.genderTabText, activeTab === 'nu' && { color: '#000' }]}>NỮ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'tre_em' && styles.activeGenderTab]}
          onPress={() => setActiveTab('tre_em')}
        >
          <Text style={[styles.genderTabText, activeTab === 'tre_em' && { color: '#000' }]}>TRẺ EM</Text>
        </TouchableOpacity>
      </View> */}

      <Text style={styles.swipeText}>SWIPE RIGHT TO EXPLORE MORE {'>'}{'>'}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Product Banner - đổi thành slider */}
        <View style={styles.mainBannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: width }}
            ref={bannerScrollRef}
            onScroll={e => {
              const page = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentBanner(page);
            }}
            scrollEventThrottle={16}
          >
            {banners.map((banner, idx) => (
              <TouchableOpacity
                key={banner.id}
                style={{ width: width, height: 380 }}
                activeOpacity={0.85}
                onPress={() => handleBannerPress(banner)}
              >
                <Image
                  source={banner.image}
                  style={styles.mainBannerImage}
                  resizeMode="cover"
                />
                <View style={[styles.mainBannerOverlay, banner.id === 3 && styles.mainBannerOverlayRight]}>
                    {idx >= 1 && (
                      <View style={[styles.bannerTextBox, banner.id === 3 && styles.bannerTextBoxRight]}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    )}
                    <View style={[styles.bannerTextBox, banner.id === 3 && styles.bannerTextBoxRight]}>
                      <Text style={[styles.bannerTitle, banner.id === 3 && styles.bannerTitleRight]}>{banner.title}</Text>
                    
                  </View>
                  <View style={[styles.bannerTextBox, banner.id === 3 && styles.bannerTextBoxRight]}>
                    <Text style={[styles.bannerSubtitle, banner.id === 3 && styles.bannerSubtitleRight]}>{banner.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Indicator dưới banner, không nằm trong mainBannerContainer nữa */}
        <View style={styles.bannerIndicatorContainer}>
          {banners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.bannerIndicatorSegment,
                idx === currentBanner
                  ? styles.bannerIndicatorActive
                  : styles.bannerIndicatorInactive,
              ]}
            />
          ))}
        </View>

        {/* Originals Classics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORIGINALS CLASSICS</Text>
          <View style={[styles.originalsScroll, { flexDirection: 'row', justifyContent: 'center' }]}> 
            {originalsClassics.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image source={typeof product.image === 'number' ? product.image : { uri: product.image }} style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Links */}
        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'SHOES', categories: giayCategories })}>
          <Ionicons name="tennisball-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>SHOES</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'CLOTHING', categories: quanAoCategories })}>
          <Ionicons name="shirt-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>CLOTHING</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'ALL ACCESSORIES', categories: phuKienCategories })}>
          <Ionicons name="watch-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>ALL ACCESSORIES</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

        {/* Collections Section */}
        <View style={styles.collectionsSection}>
          <Text style={styles.collectionsSectionTitle}>SPECIAL COLLECTIONS</Text>
          <View style={styles.collectionsGrid}>
            {[
              {
                id: 1,
                title: 'PHARRELL WILLIAMS',
                subtitle: 'Tennis Hu Collection',
                image: require('../../../../assets/pharrelwilliamsxtennishu.png'),
                color: '#000000'
              },
              {
                id: 2,
                title: 'HANDBALL SPEZIAL',
                subtitle: 'Retro Heritage',
                image: require('../../../../assets/Giay_Handball_Spezial.jpg'),
                color: '#000000'
              },
              {
                id: 3,
                title: 'NIKE COLLECTION',
                subtitle: 'Just Do It',
                image: require('../../../../assets/nike_collection.jpg'),
                color: '#45B7D1'
              },
              {
                id: 4,
                title: 'ARSENAL COLLECTION',
                subtitle: 'North London Forever',
                image: require('../../../../assets/ao1.jpg'),
                color: '#DC143C'
              }
            ].map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={[styles.collectionCard, { borderLeftColor: collection.color }]}
                onPress={() => (navigation as any).navigate('Collection', {
                  collectionId: collection.id,
                  title: collection.title,
                  subtitle: collection.subtitle,
                })}
              >
                <View style={styles.collectionImageContainer}>
                  <Image 
                    source={collection.image}
                    style={styles.collectionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.collectionOverlay}>
                    <View style={[styles.collectionColorDot, { backgroundColor: collection.color }]} />
                  </View>
                </View>
                <View style={styles.collectionInfo}>
                  <Text style={styles.collectionTitle}>{collection.title}</Text>
                  <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
                  <View style={styles.collectionAction}>
                    <Text style={styles.collectionActionText}>EXPLORE</Text>
                    <Ionicons name="arrow-forward" size={16} color="#666" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen; 
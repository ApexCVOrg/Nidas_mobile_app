import React, { useState, useRef, useMemo } from "react";
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../../../styles/search/search.styles";
import searchProducts from "../../../api/searchProducts.json";
import { Product } from "../../../types/Product";
import { getImageRequire } from "../../../utils/imageRequire";

const { width } = Dimensions.get("window");

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

type Banner = {
  id: number;
  image: any;
  title: string;
  subtitle: string;
};

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState("nam"); // 'nam', 'nu', 'tre_em'
  const [searchText, setSearchText] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const bannerScrollRef = useRef<ScrollView>(null);

  // Fuzzy search function
  const fuzzySearch = (text: string, target: string): boolean => {
    if (!text || !target) return false;

    const searchLower = text.toLowerCase();
    const targetLower = target.toLowerCase();

    // Exact match
    if (targetLower.includes(searchLower)) return true;

    // Fuzzy matching - check if characters appear in order
    let searchIndex = 0;
    for (
      let i = 0;
      i < targetLower.length && searchIndex < searchLower.length;
      i++
    ) {
      if (targetLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Suggested products (popular/featured items)
  const suggestedProducts = useMemo(() => {
    return (searchProducts as any[])
      .filter(
        (product) =>
          product.collections &&
          (product.collections.includes('New Arrivals') ||
            product.collections.includes('Best Sellers'))
      )
      .map((product) => ({
        ...product,
        imageByColor: product.imageByColor
          ? Object.fromEntries(
              Object.entries(product.imageByColor).filter(([_, v]) => typeof v === 'string')
            )
          : {},
      }))
      .slice(0, 6);
  }, []);

  // Search results with fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchText.trim()) {
      // Show suggested products when no search text
      return isSearchFocused ? suggestedProducts : [];
    }

    return (searchProducts as any[])
      .filter((product) => {
        return (
          fuzzySearch(searchText, product.name) ||
          (product.tags &&
            product.tags.some((tag: string) => fuzzySearch(searchText, tag))) ||
          fuzzySearch(searchText, product.category) ||
          (product.type && fuzzySearch(searchText, product.type)) ||
          (product.colors &&
            product.colors.some((color: string) => fuzzySearch(searchText, color)))
        );
      })
      .map((product) => ({
        ...product,
        imageByColor: product.imageByColor
          ? Object.fromEntries(
              Object.entries(product.imageByColor).filter(([_, v]) => typeof v === 'string')
            )
          : {},
      }))
      .slice(0, 8); // Limit to 8 results
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
    setSearchText("");
    setShowSearchResults(false);
    setIsSearchFocused(false);
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      setShowSearchResults(false);
      navigation.navigate("SearchResults", { searchQuery: searchText.trim() });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const originalsClassics = [
    { id: 1, name: "OG", image: require("../../../../assets/SearchPage/SL_Spin/Giay_SL_72_OG_Hong_JS0254_video.gif") },
    { id: 2, name: "RS", image: require("../../../../assets/SearchPage/SL_Spin/Giay_SL_72_RS_mau_xanh_la_IG2133_video.gif") },
    { id: 3, name: "RTN", image: require("../../../../assets/SearchPage/SL_Spin/Giay_SL_72_RTN_Xam_IH5558_video.gif") },
  ];


  const banners: Banner[] = [
    {
      id: 1,
      image: require("../../../../assets/banner1.gif"),
      title: "BD7530",
      subtitle: "Pharrell Williams x Tennis Hu.",
    },
    {
      id: 2,
      image: require("../../../../assets/SearchPage/Banner/Handball_banner.jpg"),
      title: "HANDBALL SPEZIAL",
      subtitle: "Step into retro-inspired design.",
    },
    {
      id: 3,
      image: require("../../../../assets/SearchPage/Banner/Ultraboost_banner.png"),
      title: "ULTRABOOST COLLECTION",
      subtitle: "Ultra Energy.",
    },
    {
      id: 4,
      image: require("../../../../assets/SearchPage/Banner/SL_banner.jpg"),
      title: "SL 72",
      subtitle: "From the Track to the Street.",
    },
  ];

  const handleBannerPress = (banner: Banner) => {
    if (banner.id === 1) {
      navigation.navigate("Product");
    } else {
      navigation.navigate("Introduction", {
        bannerId: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
      });
    }
  };

  const specialCollections = [
    {
      id: 1,
      title: "SL 72",
      subtitle: "Vintage Running",
      image: require("../../../../assets/sl72.gif"),
      color: "#000",
    },
    {
      id: 2,
      title: "HANDBALL SPEZIAL",
      subtitle: "Retro Heritage",
      image: require("../../../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_xanh_da_troi_IG6194_01_standard.jpg"),
      color: "#222",
    },
    {
      id: 3,
      title: "ULTRABOOST",
      subtitle: "Boost Your Run",
      image: require("../../../../assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5_Den_ID8812_HM1.png"),
      color: "#00bcd4",
    }
  ];

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
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchInputIcon}
          />
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
                setSearchText("");
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
                <Text style={styles.suggestionsHeaderText}>
                  Suggested Products
                </Text>
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
                    source={getImageRequire(
                      item.image || item.imageDefault || ""
                    )}
                    style={styles.searchResultImage}
                    defaultSource={require("../../../../assets/icon.png")}
                  />
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.searchResultPrice}>
                      {formatPrice(
                        typeof item.price === "string"
                          ? parseInt(item.price.replace(/[^\d]/g, ""))
                          : item.price
                      )}
                    </Text>
                    <Text style={styles.searchResultCategory}>
                      {item.category === "giay" ? "Shoes" : "Clothing"} •{" "}
                      {item.gender || "Unisex"}
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
        {showSearchResults &&
          searchText.length > 0 &&
          searchResults.length === 0 && (
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

      <Text style={styles.swipeText}>
        SWIPE RIGHT TO EXPLORE MORE {">"}
        {">"}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Product Banner - đổi thành slider */}
        <View style={styles.mainBannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: width }}
            ref={bannerScrollRef}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
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
                <View
                  style={[
                    styles.mainBannerOverlay,
                    banner.id === 3 && styles.mainBannerOverlayRight,
                  ]}
                >
                  {idx >= 1 && (
                    <View
                      style={[
                        styles.bannerTextBox,
                        banner.id === 3 && styles.bannerTextBoxRight,
                      ]}
                    >
                      <Text style={styles.arrowText}>→</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bannerTextBox,
                      banner.id === 3 && styles.bannerTextBoxRight,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bannerTitle,
                        banner.id === 3 && styles.bannerTitleRight,
                      ]}
                    >
                      {banner.title}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.bannerTextBox,
                      banner.id === 3 && styles.bannerTextBoxRight,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bannerSubtitle,
                        banner.id === 3 && styles.bannerSubtitleRight,
                      ]}
                    >
                      {banner.subtitle}
                    </Text>
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
              key={`indicator-${idx}`}
              style={[
                styles.bannerIndicatorSegment,
                idx === currentBanner
                  ? styles.bannerIndicatorActive
                  : styles.bannerIndicatorInactive,
              ]}
            />
          ))}
        </View>

        {/* Collections Section */}
        <View style={styles.collectionsSection}>
          <Text style={styles.collectionsSectionTitle}>
            SPECIAL COLLECTIONS
          </Text>
          <View style={styles.collectionsGrid}>
            {specialCollections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={[
                  styles.collectionCard,
                  { borderLeftColor: collection.color },
                ]}
                onPress={() =>
                  (navigation as any).navigate("Collection", {
                    collectionId: collection.id,
                    title: collection.title,
                    subtitle: collection.subtitle,
                  })
                }
              >
                <View style={styles.collectionImageContainer}>
                  <Image
                    source={collection.image}
                    style={styles.collectionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.collectionOverlay}>
                    <View
                      style={[
                        styles.collectionColorDot,
                        { backgroundColor: collection.color },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.collectionInfo}>
                  <Text style={styles.collectionTitle}>{collection.title}</Text>
                  <Text style={styles.collectionSubtitle}>
                    {collection.subtitle}
                  </Text>
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

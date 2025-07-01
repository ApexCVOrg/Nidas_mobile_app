import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import productsData from "../../api/categoryProducts.json";
import { getImageRequire } from "../../utils/imageRequire";
import * as FileSystem from 'expo-file-system';
import { useFavoritesContext } from '../../hooks/FavoritesContext';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/store';

const FAVORITES_FILE = FileSystem.documentDirectory + 'favorites.json';

const FavoritesScreen = () => {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, removeFavorite } = useFavoritesContext();
  const navigation = useNavigation();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let isActive = true;
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
          if (isActive) setFavoriteItems(JSON.parse(content));
        } else {
          if (isActive) setFavoriteItems([]);
        }
      } catch (e) {
        if (isActive) setFavoriteItems([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    loadFavorites();
    return () => { isActive = false; };
  }, [favorites]);

  // Lọc sản phẩm gợi ý từ New Arrivals và Best Sellers
  const suggestedItems = (productsData as any[])
    .filter(
      (item) =>
        item.collections &&
        (item.collections.includes("New Arrivals") ||
          item.collections.includes("Best Sellers"))
    )
    .slice(0, 6); // Lấy 6 sản phẩm đầu tiên

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {showPopup && (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
          <View style={{backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', width: 300}}>
            <Text style={{color: '#d32f2f', fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>Bạn chưa đăng nhập</Text>
            <Text style={{color: '#222', fontSize: 15, marginBottom: 24, textAlign: 'center'}}>Vui lòng đăng nhập để sử dụng tính năng này!</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity style={{flex: 1, marginRight: 8, backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowPopup(false); navigation.navigate('HomeMain' as never); }}>
                <Text style={{color: '#222', fontWeight: 'bold'}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginLeft: 8, backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 10, alignItems: 'center'}} onPress={() => { setShowPopup(false); navigation.navigate('Auth' as never); }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FAVORITES</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.emptyFavoritesContainer}>
            <Text>Loading...</Text>
          </View>
        ) : favoriteItems.length === 0 ? (
          <View style={styles.emptyFavoritesContainer}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyFavoritesText}>
              YOU DON'T HAVE ANY FAVORITES YET
            </Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowButtonText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            {favoriteItems.map((item) => (
              <View key={item.id} style={styles.favoriteItem}>
                <Image
                  source={getImageRequire(item.imageDefault)}
                  style={styles.favoriteImage}
                />
                <View
                  style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}
                >
                  <Text style={styles.favoriteName}>{item.name}</Text>
                  <Text style={styles.favoritePrice}>{item.price}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.heartIcon} onPress={() => removeFavorite(item.id)}>
                    <FontAwesome name="heart" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => {
                      /* TODO: handle add to cart */
                    }}
                  >
                    <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Sản phẩm gợi ý */}
            <View style={styles.suggestedSection}>
              <Text style={styles.suggestedTitle}>SUGGESTED PRODUCTS</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestedScroll}
              >
                {suggestedItems.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.suggestedItem}>
                    <Image
                      source={getImageRequire(item.imageDefault)}
                      style={styles.suggestedImage}
                    />
                    <Text style={styles.suggestedName}>{item.name}</Text>
                    <Text style={styles.suggestedPrice}>{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200, // Ensure it's visible even with no items
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  shopNowButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 10,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  favoritePrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  addToCartButton: {
    marginLeft: 10,
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    marginRight: 10,
    padding: 4,
  },
  suggestedSection: {
    marginTop: 30,
  },
  suggestedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  suggestedScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  suggestedItem: {
    width: 150,
    marginRight: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 12,
  },
  suggestedImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  suggestedPrice: {
    fontSize: 12,
    color: "#888",
  },
});

export default FavoritesScreen;

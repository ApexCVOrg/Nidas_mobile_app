import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
  const favoriteItems = []; // Placeholder for actual favorite items

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MỤC YÊU THÍCH</Text>
      </View>

      <ScrollView style={styles.content}>
        {favoriteItems.length === 0 ? (
          <View style={styles.emptyFavoritesContainer}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyFavoritesText}>BẠN CHƯA CÓ MỤC YÊU THÍCH NÀO</Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowButtonText}>MUA SẮM NGAY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>{/* Render favorite items here */}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Ensure it's visible even with no items
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopNowButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default FavoritesScreen; 
 
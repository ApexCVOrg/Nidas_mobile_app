import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import ProductCard from '../components/ProductCard';
import { getImageRequire } from '../utils/imageRequire';
import productsData from '../api/categoryProducts.json';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTabBar from '../components/CustomTabBar';

type BannerDetailScreenRouteProp = RouteProp<TabNavigatorParamList, 'BannerDetailManchester'>;

type Props = {
  route: BannerDetailScreenRouteProp;
};

const BannerDetailManchester = ({ route }: Props) => {
  const { item } = route.params;
  const navigation = useNavigation();
  // Lọc sản phẩm liên quan đến Manchester United
  const relatedProducts = useMemo(() => {
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes('manchester united') ||
        (p.collections && p.collections.some((c) => c.toLowerCase().includes('manchester united') || c.toLowerCase().includes('football club')))
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', zIndex: 10 }}>
        <Icon name="arrow-back-ios" size={24} color="#000" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>Manchester Collection</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image ? item.image : getImageRequire(item.imageDefault)}
            style={styles.image}
          />
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        </View>
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <FlatList
              data={relatedProducts}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => {
                const cleanedQuantityBySize = Object.fromEntries(
                  Object.entries(item.quantityBySize || {}).filter(([_, v]) => typeof v === 'number')
                );
                return (
                  <ProductCard product={{ ...item, quantityBySize: cleanedQuantityBySize }} />
                );
              }}
            />
          </View>
        )}
      </ScrollView>
      {/* Bottom Tab Bar */}
      <CustomTabBar />
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: height,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  desc: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  relatedSection: {
    marginTop: 24,
    paddingBottom: 24,
  },
  relatedTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
});

export default BannerDetailManchester; 
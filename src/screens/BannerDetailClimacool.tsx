import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import ProductCard from '../components/ProductCard';
import { getImageRequire } from '../utils/imageRequire';
import productsData from '../api/categoryProducts.json';

type BannerDetailScreenRouteProp = RouteProp<TabNavigatorParamList, 'BannerDetailClimacool'>;

type Props = {
  route: BannerDetailScreenRouteProp;
};

const BannerDetailClimacool = ({ route }: Props) => {
  const { item } = route.params;
  // Lọc sản phẩm liên quan đến ClimaCool
  const relatedProducts = useMemo(() => {
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes('climacool') ||
        (p.collections && p.collections.some((c) => c.toLowerCase().includes('climacool')))
    );
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      </View>
      {relatedProducts.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>ClimaCool Products</Text>
          <FlatList
            data={relatedProducts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => (
              <ProductCard product={{
                ...item,
                image: getImageRequire(item.imageDefault)
              }} />
            )}
          />
        </View>
      )}
    </ScrollView>
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

export default BannerDetailClimacool; 
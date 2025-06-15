import React, { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/Product';
import productsData from '../api/categoryProducts.json';

type RouteParams = {
  categoryId: string;
  title: string;
};

const CategoryScreen = () => {
  const route = useRoute();
  const { categoryId, title } = route.params as RouteParams;

  const products: Product[] = useMemo(
    () =>
      (productsData as any[])
        .filter(item => item.category === categoryId)
        .map(item => ({
          ...item,
          imageByColor: Object.fromEntries(
            Object.entries(item.imageByColor).filter(([_, v]) => typeof v === 'string' && v)
          ),
        })),
    [categoryId]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 18,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});

export default CategoryScreen; 
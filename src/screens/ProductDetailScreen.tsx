import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProductStackParamList } from '../navigation/MainNavigator';

type ProductDetailScreenProps = {
  navigation: NativeStackNavigationProp<ProductStackParamList, 'ProductDetail'>;
  route: RouteProp<ProductStackParamList, 'ProductDetail'>;
};

const ProductDetailScreen = ({ route }: ProductDetailScreenProps) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Detail</Text>
      <Text>Product ID: {productId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ProductDetailScreen; 
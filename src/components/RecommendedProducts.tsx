import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import searchProducts from '../api/searchProducts.json';
import { getImageRequire } from '../utils/imageRequire';

type NavigationProp = NativeStackNavigationProp<TabNavigatorParamList, 'ProductDetail'>;

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

type RecommendedProductsProps = {
  currentProductType: 'shoes' | 'clothing' | 'pants';
};

const RecommendedProducts = ({ currentProductType }: RecommendedProductsProps) => {
  const navigation = useNavigation<NavigationProp>();

  // Filter products based on current product type
  const getProductType = (product: any) => {
    const category = product.category;
    if (category === 'giay') {
      return 'shoes';
    } else if (category === 'quan_ao' && product.name.toLowerCase().includes('quần')) {
      return 'pants';
    } else {
      return 'clothing';
    }
  };

  const recommendedProducts = (searchProducts as any[]).filter(
    (product) => getProductType(product) === currentProductType
  ).slice(0, 3); // Limit to 3 products

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {recommendedProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleProductPress(product)}
          >
            <Image source={getImageRequire(product.image)} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              {product.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  scrollView: {
    flexDirection: 'row',
  },
  productCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecommendedProducts; 
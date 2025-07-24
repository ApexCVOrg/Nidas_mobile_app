import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  discount?: number;
  originalPrice?: number;
  imageDefault?: string;
  collections?: string[];
  features?: string[];
  specifications?: any;
  tags?: string[];
  images?: string[];
}

interface ProductMessageCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductMessageCard: React.FC<ProductMessageCardProps> = ({
  product,
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to product detail with productId
      (navigation as any).navigate('ProductDetail', { 
        productId: product.id
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productBrand}>
            {product.brand}
          </Text>
          <View style={styles.priceContainer}>
            {product.discount && product.discount > 0 ? (
              <>
                <Text style={styles.originalPrice}>
                  {product.originalPrice?.toLocaleString()}đ
                </Text>
                <Text style={styles.discountText}>
                  -{product.discount}%
                </Text>
              </>
            ) : null}
            <Text style={styles.price}>
              {product.price.toLocaleString()}đ
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: width * 0.75, // Giới hạn chiều rộng để fit chat bubble
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    lineHeight: 18,
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 6,
  },
  description: {
    fontSize: 11,
    color: '#999',
    lineHeight: 14,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },
});

export default ProductMessageCard; 
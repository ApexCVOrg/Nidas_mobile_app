import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Product } from '../types/Product';
import { getImageRequire } from '../utils/imageRequire';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const MAX_DESCRIPTION_LENGTH = 70; // Adjust as needed

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorite = false, onToggleFavorite }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showImage, setShowImage] = useState(product.imageByColor[selectedColor] || product.imageDefault);

  // For press animation
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleColorChange = (color: string) => {
    setShowImage(product.imageByColor[color] || product.imageDefault);
    setSelectedColor(color);
  };

  const imageSource = getImageRequire(showImage);

  // Truncate description
  const truncatedDescription = product.description.length > MAX_DESCRIPTION_LENGTH
    ? product.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : product.description;

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1} // Disable default TouchableOpacity dimming
      style={styles.touchableCard}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageWrapper}>
          <Animated.Image
            key={showImage}
            source={imageSource}
            style={styles.image}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          />
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>MUA NGAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => onToggleFavorite && onToggleFavorite(product)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color={isFavorite ? '#e53935' : '#888'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{truncatedDescription}</Text>
          <Text style={styles.price}>{product.price}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableCard: {
    // This wrapper ensures the animation applies correctly to the whole card
    width: width * 0.45, // Adjusted for horizontal scroll, showing about 2 items
    marginHorizontal: 8,
    marginVertical: 10,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#1A1A1A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 12,
    height: 120, // Fixed height to ensure uniform card height
    justifyContent: 'space-between', // Distribute content evenly
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif', // Using a generic serif font family
    marginBottom: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
});

export default ProductCard; 
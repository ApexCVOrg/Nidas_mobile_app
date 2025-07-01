import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Product } from '../types/Product';
import { getImageRequire } from '../utils/imageRequire';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getHandballImage } from '../utils/handballImageMap';
import { getUltraboostImage } from '../utils/ultraboostImageMap';

const { width } = Dimensions.get('window');

const MAX_DESCRIPTION_LENGTH = 70; // Adjust as needed

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFavorite = false, 
  onToggleFavorite,
  onPress 
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showImage, setShowImage] = useState(product.imageByColor?.[selectedColor] || product.imageDefault);
  const [isLiked, setIsLiked] = useState(isFavorite);

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
    setSelectedColor(color);
    setShowImage(product.imageByColor?.[color] || product.imageDefault);
  };

  const handleToggleFavorite = () => {
    setIsLiked(!isLiked);
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'blue': '#0066CC',
      'red': '#FF0000',
      'green': '#00CC00',
      'yellow': '#FFCC00',
      'pink': '#FF69B4',
      'purple': '#800080',
      'grey': '#808080',
      'gray': '#808080',
      'brown': '#8B4513',
      'navy': '#000080',
      'khaki': '#F0E68C',
      'floral': '#FFB6C1',
    };
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  const isHandball = product.collections && product.collections.includes('Handball');
  const isUltraboost = product.collections && (product.collections.includes('Ultraboost') || product.collections.includes('Pureboost'));
  const imageSource = isHandball
    ? getHandballImage(product.imageDefault ?? "")
    : isUltraboost
    ? getUltraboostImage(product.imageDefault ?? "")
    : getImageRequire(product.imageDefault ?? "");

  // Truncate description
  const truncatedDescription = product.description.length > MAX_DESCRIPTION_LENGTH
    ? product.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : product.description;

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={1}
      style={styles.touchableCard}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageRectWrapper}>
          <Animated.Image
            key={showImage}
            source={imageSource}
            style={[
              styles.imageRect,
              isUltraboost && {
                height: 260,
                width: '110%',
                marginTop: -10,
                marginBottom: 0,
                alignSelf: 'center',
                resizeMode: 'contain',
              },
            ]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          />
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={isLiked ? 'heart' : 'heart-o'}
              size={24}
              color={isLiked ? '#000' : '#888'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoColorRow}>
          <View style={styles.infoSectionRow}>
            {product.brand && (
              <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
            )}
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            {product.subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>{product.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.ratingBlock}>
            {[1,2,3,4,5].map(i => (
              <FontAwesome
                key={i}
                name={Number(product.rating) >= i ? 'star' : (Number(product.rating) >= i-0.5 ? 'star-half-empty' : 'star-o')}
                size={18}
                color={Number(product.rating) >= i-0.5 ? '#FFD700' : '#444'}
                style={{marginRight: 1}}
              />
            ))}
          </View>
          <Text style={styles.priceFooter}>{typeof product.price === 'number' ? formatPrice(product.price) : product.price}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableCard: {
    width: width * 0.6,
    marginHorizontal: 10,
    marginVertical: 16,
  },
  card: {
    borderRadius: 18,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    height: 400,
    justifyContent: 'space-between',
  },
  imageRectWrapper: {
    width: '100%',
    height: 240,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 0,
    position: 'relative',
  },
  imageRect: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: 'cover',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 2,
    padding: 4,
  },
  infoColorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  infoSectionRow: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 56,
    paddingTop: 2,
    paddingBottom: 2,
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B8DF8',
    textAlign: 'left',
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    textAlign: 'left',
    lineHeight: 18,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'left',
    marginBottom: 0,
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 2,
  },
  priceFooter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#222',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
});

export default ProductCard; 
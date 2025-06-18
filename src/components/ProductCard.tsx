import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
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

  const getImageSource = (imageName: string) => {
    // Map image names to require statements
    const imageMap: { [key: string]: any } = {
      'samba.gif': require('../../assets/samba.gif'),
      'sl72.gif': require('../../assets/sl72.gif'),
      'yeezy750.gif': require('../../assets/yeezy750.gif'),
      'handball.gif': require('../../assets/handball.gif'),
      'banner1.gif': require('../../assets/banner1.gif'),
      'Giay_Ultraboost_22.jpg': require('../../assets/Giay_Ultraboost_22.jpg'),
      'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
      'Ao_Thun_Polo_Ba_La.jpg': require('../../assets/Ao_Thun_Polo_Ba_La.jpg'),
      'Quan_Hiking_Terrex.jpg': require('../../assets/Quan_Hiking_Terrex.jpg'),
      'aoadidasden.png': require('../../assets/aoadidasden.png'),
      'aoadidastrang.png': require('../../assets/aoadidastrang.png'),
      'aoadidasxanh.png': require('../../assets/aoadidasxanh.png'),
      'ao1.jpg': require('../../assets/ao1.jpg'),
      'ao3.jpg': require('../../assets/ao3.jpg'),
      'ao4.jpg': require('../../assets/ao4.jpg'),
      'ao5.jpg': require('../../assets/ao5.jpg'),
      'quan1.jpg': require('../../assets/quan1.jpg'),
      'quan2.jpg': require('../../assets/quan2.jpg'),
      'quan3.jpg': require('../../assets/quan3.jpg'),
    };
    
    return imageMap[imageName] || require('../../assets/icon.png');
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

  // Use new image structure or fallback to legacy
  const imageSource = product.image ? getImageSource(product.image) : getImageRequire(product.imageDefault || '');

  // Truncate description
  const truncatedDescription = product.description.length > MAX_DESCRIPTION_LENGTH
    ? product.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : product.description;

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
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
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{truncatedDescription}</Text>
          <Text style={styles.price}>{product.price}</Text>
          
          {/* Category & Gender */}
          {product.category && (
            <Text style={styles.category}>
              {product.category === 'giay' ? 'Giày' : 'Quần áo'} • {product.gender || 'Unisex'}
            </Text>
          )}
          
          {/* Colors */}
          <View style={styles.colorsRow}>
            {product.colors.slice(0, 4).map((color, index) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDot,
                  { 
                    backgroundColor: getColorCode(color),
                    borderWidth: selectedColor === color ? 2 : 1,
                    borderColor: selectedColor === color ? '#333' : '#ddd'
                  }
                ]}
                onPress={() => handleColorChange(color)}
              />
            ))}
            {product.colors.length > 4 && (
              <Text style={styles.moreColors}>+{product.colors.length - 4}</Text>
            )}
          </View>
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
    borderRadius: 16,
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
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    textAlign: 'center',
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    fontFamily: 'serif', // Using a generic serif font family
    marginBottom: 8,
    textAlign: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 3,
    marginVertical: 2,
  },
  moreColors: {
    fontSize: 10,
    color: '#666',
    marginLeft: 6,
  },
});

export default ProductCard; 
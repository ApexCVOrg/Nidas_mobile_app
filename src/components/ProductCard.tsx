import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Product } from '../types/Product';
import { getImageRequire } from '../utils/imageRequire';

const { width } = Dimensions.get('window');

const ProductCard: React.FC<{ product: Product; onPress?: () => void }> = ({ product, onPress }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={styles.image}
          defaultSource={require('../../assets/icon.png')}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      
      {/* Price */}
      {product.price && (
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      )}
      
      {/* Category & Gender */}
      <Text style={styles.category}>
        {product.category === 'giay' ? 'Giày' : 'Quần áo'} • {product.gender}
      </Text>
      
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: (width - 48) / 2, // For 2 columns with margins
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 6,
    textAlign: 'center',
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
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Product } from '../types/Product';
import { getImageRequire } from '../utils/imageRequire';

const { width } = Dimensions.get('window');

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showImage, setShowImage] = useState(product.imageByColor[selectedColor] || product.imageDefault);

  const handleColorChange = (color: string) => {
    setShowImage(product.imageByColor[color] || product.imageDefault);
    setSelectedColor(color);
  };

  const imageSource = getImageRequire(showImage);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Animated.Image
          key={showImage}
          source={imageSource}
          style={styles.image}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <View style={styles.colorsRow}>
        {product.colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorDot,
              { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 }
            ]}
            onPress={() => handleColorChange(color)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 18,
    marginHorizontal: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  imageWrapper: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  name: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  colorsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
    borderColor: '#333',
  },
});

export default ProductCard; 
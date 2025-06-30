import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Product } from '../types/Product';
import { getImageRequire } from '../utils/imageRequire';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import { useFavoritesContext } from '../hooks/FavoritesContext';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';

const { width } = Dimensions.get('window');

const MAX_DESCRIPTION_LENGTH = 70; // Adjust as needed

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onRequireLogin?: () => void;
}

const FAVORITES_FILE = FileSystem.documentDirectory + 'favorites.json';

const updateFavoriteFile = async (product: Product, add: boolean) => {
  try {
    let favorites: Product[] = [];
    const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
      favorites = JSON.parse(content);
    }
    if (add) {
      // Thêm nếu chưa có
      if (!favorites.find((item) => item.id === product.id)) {
        favorites.push(product);
      }
    } else {
      // Xóa nếu đã có
      favorites = favorites.filter((item) => item.id !== product.id);
    }
    await FileSystem.writeAsStringAsync(FAVORITES_FILE, JSON.stringify(favorites));
    return favorites;
  } catch (e) {
    console.error('Favorite file error:', e);
    return null;
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPress,
  onRequireLogin
}) => {
  // Sử dụng giá trị mặc định nếu thiếu colors
  const safeColors = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : ['default'];
  const [selectedColor, setSelectedColor] = useState(safeColors[0]);
  const [showImage, setShowImage] = useState(
    (product.imageByColor && product.imageByColor[selectedColor]) ||
    product.imageDefault ||
    product.image ||
    ''
  );

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
    setShowImage(
      (product.imageByColor && product.imageByColor[color]) ||
      product.imageDefault ||
      product.image ||
      ''
    );
  };

  const { favorites, addFavorite, removeFavorite } = useFavoritesContext();
  const navigation = useNavigation();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  // Nếu chưa đăng nhập, luôn là false
  const isFavorite = isLoggedIn ? favorites.includes(product.id) : false;
  const [forceUnfavorite, setForceUnfavorite] = useState(false);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setForceUnfavorite(true);
      if (onRequireLogin) onRequireLogin();
      return;
    }
    if (isFavorite) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
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
      "Mu_2526.jpg": require("../../assets/category_images/Mu_2526.jpg")
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
      activeOpacity={1}
      style={styles.touchableCard}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageRectWrapper}>
          <Animated.Image
            key={showImage}
            source={imageSource}
            style={styles.imageRect}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          />
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={(!isLoggedIn || forceUnfavorite) ? 'heart-o' : (isFavorite ? 'heart' : 'heart-o')}
              size={24}
              color={(!isLoggedIn || forceUnfavorite) ? '#888' : (isFavorite ? '#000' : '#888')}
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
      {showLoginNotice && false}
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
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { homeStyles } from '../../styles/home/home.styles';

// Import images
const bannerImage = require('../../../assets/banner3.png');

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();

  const categories = [
    { id: 1, name: 'Nam', icon: 'person' },
    { id: 2, name: 'Nữ', icon: 'person' },
    { id: 3, name: 'Trẻ Em', icon: 'child-care' },
    { id: 4, name: 'Thể Thao', icon: 'sports-basketball' },
    { id: 5, name: 'Phụ Kiện', icon: 'watch' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'ULTRABOOST 22',
      description: 'Giày chạy bộ',
      price: '4.200.000đ',
      image: require('../../../assets/Giay_Ultraboost_22.jpg'),
    },
    {
      id: 2,
      name: 'ADIDAS ORIGINALS',
      description: 'Áo thun Trefoil',
      price: '1.200.000đ',
      image: require('../../../assets/Ao_Thun_Polo_Ba_La.jpg'),
    },
    {
      id: 3,
      name: 'TERREX',
      description: 'Quần leo núi',
      price: '2.500.000đ',
      image: require('../../../assets/Quan_Hiking_Terrex.jpg'),
    },
    {
      id: 4,
      name: 'STAN SMITH',
      description: 'Giày thể thao',
      price: '2.800.000đ',
      image: require('../../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
    },
  ];

  const collections = [
    {
      id: 1,
      name: 'Bộ sưu tập mùa hè',
      image: require('../../../assets/banner.jpg'),
    },
    {
      id: 2,
      name: 'Bộ sưu tập thể thao',
      image: require('../../../assets/sport.jpg'),
    },
  ];

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={homeStyles.header}>
        <View style={homeStyles.headerLeft}>
          <Text style={homeStyles.headerTitle}>NIDAS</Text>
        </View>
        <View style={homeStyles.headerRight}>
          <TouchableOpacity style={homeStyles.iconButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.iconButton}>
            <Icon name="favorite-border" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.iconButton}>
            <Icon name="shopping-bag" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={homeStyles.heroBanner}>
          <Image
            source={bannerImage}
            style={homeStyles.heroImage}
            resizeMode="cover"
          />
          <View style={homeStyles.heroContent}>
            <Text style={homeStyles.heroTitle}>BỘ SƯU TẬP MỚI</Text>
            <Text style={homeStyles.heroSubtitle}>Khám phá ngay</Text>
            <TouchableOpacity style={homeStyles.heroButton}>
              <Text style={homeStyles.heroButtonText}>MUA NGAY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={homeStyles.categoriesContainer}>
          <Text style={homeStyles.sectionTitle}>DANH MỤC</Text>
          <View style={homeStyles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={homeStyles.categoryItem}>
                <View style={homeStyles.categoryIcon}>
                  <Icon name={category.icon} size={24} color="#000" />
                </View>
                <Text style={homeStyles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={homeStyles.productsContainer}>
          <Text style={homeStyles.sectionTitle}>SẢN PHẨM NỔI BẬT</Text>
          <View style={homeStyles.productsList}>
            {featuredProducts.map((product) => (
              <TouchableOpacity key={product.id} style={homeStyles.productCard}>
                <Image
                  source={product.image}
                  style={homeStyles.productImage}
                  resizeMode="cover"
                />
                <View style={homeStyles.productInfo}>
                  <Text style={homeStyles.productName}>{product.name}</Text>
                  <Text style={homeStyles.productDescription}>{product.description}</Text>
                  <Text style={homeStyles.productPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Collections */}
        <View style={homeStyles.collectionsContainer}>
          {collections.map((collection) => (
            <TouchableOpacity key={collection.id} style={homeStyles.collectionCard}>
              <Image
                source={collection.image}
                style={homeStyles.collectionImage}
                resizeMode="cover"
              />
              <View style={homeStyles.collectionOverlay}>
                <Text style={homeStyles.collectionTitle}>{collection.name}</Text>
                <TouchableOpacity style={homeStyles.collectionButton}>
                  <Text style={homeStyles.collectionButtonText}>XEM THÊM</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 
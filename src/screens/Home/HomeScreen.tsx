import React, { useState } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabNavigatorParamList } from '../../navigation/TabNavigator';
import { homeStyles } from '../../styles/home/home.styles';

// Import images
const bannerImage = require('../../../assets/banner3.png');

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<TabNavigatorParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showBanner, setShowBanner] = useState(true);

  const categories = [
    { id: 'men', name: 'Nam', icon: 'person' },
    { id: 'women', name: 'Nữ', icon: 'person-2' },
    { id: 'kids', name: 'Trẻ Em', icon: 'child-care' },
    { id: 'sport', name: 'Thể Thao', icon: 'sports-basketball' },
    { id: 'accessories', name: 'Phụ Kiện', icon: 'watch' },
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

  const handleCategoryPress = (category: { id: string; name: string }) => {
    navigation.navigate('Category', {
      categoryId: category.id,
      title: category.name,
    });
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={homeStyles.headerV2}>
        <View style={homeStyles.headerTopRow}>
          <Text style={homeStyles.greetingText}>NIDAS</Text>
          <View style={homeStyles.headerIconsRight}>
            <TouchableOpacity style={homeStyles.iconButton}>
              <Icon name="search" size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={homeStyles.iconButton}>
              <Icon name="person-outline" size={26} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Banner thông báo */}
      {showBanner && (
        <View style={homeStyles.loginBanner}>
          <Icon name="person-outline" size={32} color="#fff" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={homeStyles.bannerTitle}>Mua theo cách của bạn</Text>
            <Text style={homeStyles.bannerDesc}>
              Cửa hàng được cá nhân hoá của bạn đang chờ đợi. Nhận các đề xuất mới và quyền truy cập độc quyền chỉ dành cho hội viên.
            </Text>
          </View>
          <TouchableOpacity style={homeStyles.loginBannerButton}>
            <Text style={homeStyles.loginBannerButtonText}>ĐĂNG NHẬP NGAY</Text>
            <Icon name="arrow-forward-ios" size={16} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.closeBannerButton} onPress={() => setShowBanner(false)}>
            <Icon name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

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
              <TouchableOpacity key={category.id} style={homeStyles.categoryItem} onPress={() => handleCategoryPress(category)}>
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
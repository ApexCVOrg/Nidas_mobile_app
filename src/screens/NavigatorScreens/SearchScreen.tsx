import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SearchScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('nam'); // 'nam', 'nu', 'tre_em'
  const [searchText, setSearchText] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerScrollRef = useRef(null);

  const originalsClassics = [
    { id: 1, name: 'SAMBA', image: require('../../../assets/samba.gif') },
    { id: 2, name: 'SL 72', image: require('../../../assets/sl72.gif') },
    { id: 3, name: 'YEEZY', image: require('../../../assets/yeezy750.gif') },
  ];

  // Dữ liệu mẫu cho từng mục
  const giayCategories = [
    { id: 'all', name: 'TẤT CẢ GIÀY', image: require('../../../assets/samba.gif') },
    { id: 'new', name: 'HÀNG MỚI VỀ', image: require('../../../assets/sl72.gif') },
    { id: 'run', name: 'CHẠY BỘ', image: require('../../../assets/yeezy750.gif') },
  ];
  const quanAoCategories = [
    { id: 'all', name: 'TẤT CẢ QUẦN ÁO', image: require('../../../assets/ao1.jpg') },
    { id: 'new', name: 'HÀNG MỚI VỀ', image: require('../../../assets/ao1.jpg') },
    { id: 'tshirt', name: 'ÁO THUN & ÁO', image: require('../../../assets/ao3.jpg') },
    { id: 'jersey', name: 'ÁO ĐẤU', image: require('../../../assets/ao4.jpg') },
    { id: 'short', name: 'QUẦN SHORT', image: require('../../../assets/quan1.jpg') },
    { id: 'pants', name: 'QUẦN', image: require('../../../assets/quan2.jpg') },
    { id: 'tight', name: 'QUẦN BÓ', image: require('../../../assets/quan3.jpg') },
    { id: 'hoodie', name: 'ÁO NỈ & ÁO HOODIE', image: require('../../../assets/ao5.jpg') },
  ];
  const phuKienCategories = [
    { id: 'all', name: 'TẤT CẢ PHỤ KIỆN', image: require('../../../assets/yeezy750.gif') },
    { id: 'bag', name: 'TÚI', image: require('../../../assets/sl72.gif') },
    { id: 'cap', name: 'MŨ', image: require('../../../assets/samba.gif') },
  ];

  const banners = [
    { id: 1, image: require('../../../assets/banner1.gif'), title: 'BD7530', subtitle: 'Pharrell Williams x Tennis Hu.' },
    { id: 2, image: require('../../../assets/banner2.gif'), title: 'HANDBALL SPEZIAL', subtitle: 'Step into retro-inspired design.' },
    { id: 3, image: require('../../../assets/banner3.png'), title: 'BANNER 3', subtitle: 'Ưu đãi hấp dẫn.' },
    { id: 4, image: require('../../../assets/sport.jpg'), title: 'BANNER 4', subtitle: 'Thể thao năng động.' },
    { id: 5, image: require('../../../assets/logo.jpg'), title: 'BANNER 5', subtitle: 'Thương hiệu uy tín.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CỬA HÀNG</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Section */}
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchInputIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Gender Tabs */}
      {/* <View style={styles.genderTabsContainer}>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'nam' && styles.activeGenderTab]}
          onPress={() => setActiveTab('nam')}
        >
          <Text style={[styles.genderTabText, activeTab === 'nam' && { color: '#000' }]}>NAM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'nu' && styles.activeGenderTab]}
          onPress={() => setActiveTab('nu')}
        >
          <Text style={[styles.genderTabText, activeTab === 'nu' && { color: '#000' }]}>NỮ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderTab, activeTab === 'tre_em' && styles.activeGenderTab]}
          onPress={() => setActiveTab('tre_em')}
        >
          <Text style={[styles.genderTabText, activeTab === 'tre_em' && { color: '#000' }]}>TRẺ EM</Text>
        </TouchableOpacity>
      </View> */}

      <Text style={styles.swipeText}>SWIPE RIGHT TO EXPLORE MORE {'>'}{'>'}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Product Banner - đổi thành slider */}
        <View style={styles.mainBannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: width }}
            ref={bannerScrollRef}
            onScroll={e => {
              const page = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentBanner(page);
            }}
            scrollEventThrottle={16}
          >
            {banners.map((banner, idx) => (
              <TouchableOpacity
                key={banner.id}
                style={{ width: width, height: 380 }}
                activeOpacity={0.85}
                onPress={() => {
                  if (idx === 0) {
                    (navigation as any).navigate('ProductList');
                  } else {
                    (navigation as any).navigate('ProductIntro', { bannerId: banner.id });
                  }
                }}
              >
                <Image
                  source={banner.image}
                  style={styles.mainBannerImage}
                  resizeMode="cover"
                />
                <View style={styles.mainBannerOverlay}>
                  <View style={styles.bannerTextBoxRow}>
                    {idx >= 1 && (
                      <View style={styles.arrowBox}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    )}
                    <View style={styles.bannerTextBox}>
                      <Text style={styles.bannerTitle}>{banner.title}</Text>
                    </View>
                  </View>
                  <View style={styles.bannerTextBox}>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Indicator dưới banner, không nằm trong mainBannerContainer nữa */}
        <View style={styles.bannerIndicatorContainer}>
          {banners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.bannerIndicatorSegment,
                idx === currentBanner
                  ? styles.bannerIndicatorActive
                  : styles.bannerIndicatorInactive,
              ]}
            />
          ))}
        </View>

        {/* Originals Classics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORIGINALS CLASSICS</Text>
          <View style={[styles.originalsScroll, { flexDirection: 'row', justifyContent: 'center' }]}> 
            {originalsClassics.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image source={typeof product.image === 'number' ? product.image : { uri: product.image }} style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Links */}
        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'GIÀY', categories: giayCategories })}>
          <Ionicons name="tennisball-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>GIÀY</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'QUẦN ÁO', categories: quanAoCategories })}>
          <Ionicons name="shirt-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>QUẦN ÁO</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryLink} onPress={() => (navigation as any).navigate('CategoryList', { title: 'TẤT CẢ PHỤ KIỆN', categories: phuKienCategories })}>
          <Ionicons name="watch-outline" size={24} color="black" style={styles.categoryLinkIcon} /> 
          <Text style={styles.categoryLinkText}>TẤT CẢ PHỤ KIỆN</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" style={styles.categoryLinkArrow} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInputIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  genderTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  genderTab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeGenderTab: {
    borderBottomColor: '#000',
  },
  genderTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  swipeText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#F0F0F0', 
  },
  mainBannerContainer: {
    height: 380,
    width: width,
    position: 'relative',
    marginBottom: 20,
  },
  mainBannerImage: {
    width: '100%',
    height: '100%',
  },
  mainBannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bannerTextBoxRow: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  arrowBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  arrowText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bannerSubtitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  originalsScroll: {
    paddingBottom: 10, 
  },
  originalsContentContainer: {
    justifyContent: 'center',
  },
  productCard: {
    width: 120, 
    marginRight: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  categoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryLinkIcon: {
    marginRight: 15,
  },
  categoryLinkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryLinkArrow: {
    marginLeft: 15,
  },
  bannerIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  bannerIndicatorSegment: {
    width: 28,
    height: 4,
    marginHorizontal: 3,
    borderRadius: 2,
  },
  bannerIndicatorInactive: {
    backgroundColor: '#bbb',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  bannerIndicatorActive: {
    backgroundColor: '#000',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  bannerTextBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
});

export default SearchScreen; 
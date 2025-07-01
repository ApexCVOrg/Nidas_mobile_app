import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles/search/introduction.styles';

const IntroductionScreen3 = () => {
  const navigation = useNavigation();
  
  const content = {
    title: 'ADIDAS ULTRABOOST',
    banner: require('../../../../assets/Giay_Ultraboost_22.jpg'),
    slogan: 'ENERGY. COMFORT. PERFORMANCE.',
    description: 'Khám phá dòng giày Adidas Ultraboost - nơi công nghệ tiên tiến và sự thoải mái tuyệt đối hội tụ. Ultraboost mang lại trải nghiệm chạy bộ vượt trội với đệm Boost đàn hồi, thiết kế Primeknit linh hoạt và phong cách hiện đại.',
    categories: [
      {
        title: 'Boost™ Midsole',
        description: 'Đệm đàn hồi tối ưu, hoàn trả năng lượng vượt trội',
        icon: 'battery-charging-outline'
      },
      {
        title: 'Primeknit Upper',
        description: 'Vải dệt liền mạch, ôm chân, thoáng khí',
        icon: 'layers-outline'
      },
      {
        title: 'Continental™ Rubber',
        description: 'Đế cao su bám đường, bền bỉ mọi điều kiện',
        icon: 'trail-sign-outline'
      },
      {
        title: 'Torsion System',
        description: 'Ổn định bàn chân, hỗ trợ chuyển động tự nhiên',
        icon: 'swap-horizontal-outline'
      }
    ],
    features: [
      'Đệm Boost™ hoàn trả năng lượng tối đa',
      'Thân giày Primeknit co giãn, thoáng khí',
      'Đế ngoài Continental™ bám đường vượt trội',
      'Torsion System tăng ổn định',
      'Trọng lượng nhẹ, phù hợp chạy bộ & lifestyle',
      'Thiết kế hiện đại, đa dạng phối màu'
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      {/* Đã xóa header custom để chỉ còn header mặc định của navigation */}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={content.banner}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.nikeBannerOverlay}>
            <View style={styles.nikeBannerContent}>
              <Text style={styles.nikeSlogan}>{content.slogan}</Text>
              <Text style={styles.nikeBannerTitle}>{content.title}</Text>
              <Text style={styles.nikeBannerSubtitle}>Công nghệ vượt trội cho mọi bước chạy</Text>
            </View>
          </View>
        </View>

        {/* Brand Story */}
        <View style={styles.nikeStorySection}>
          <View style={styles.nikeBrandHeader}>
            <Text style={styles.nikeBrandTitle}>BỨT PHÁ MỌI GIỚI HẠN</Text>
            <View style={styles.nikeDivider} />
          </View>
          <Text style={styles.nikeStoryText}>{content.description}</Text>
        </View>

        {/* Technology Categories */}
        <View style={styles.nikeCategoriesSection}>
          <Text style={styles.nikeCategoriesTitle}>CÔNG NGHỆ NỔI BẬT</Text>
          <View style={styles.nikeCategoriesGrid}>
            {content.categories.map((category, index) => (
              <View key={index} style={styles.nikeCategoryCard}>
                <View style={styles.nikeCategoryIcon}>
                  <Ionicons name={category.icon as any} size={32} color="#000" />
                </View>
                <Text style={styles.nikeCategoryTitle}>{category.title}</Text>
                <Text style={styles.nikeCategoryDesc}>{category.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Features */}
        <View style={styles.nikePerformanceSection}>
          <Text style={styles.nikePerformanceTitle}>TÍNH NĂNG VƯỢT TRỘI</Text>
          <View style={styles.nikeFeaturesGrid}>
            {content.features.map((feature, index) => (
              <View key={index} style={styles.nikeFeatureItem}>
                <View style={styles.nikeFeatureNumber}>
                  <Text style={styles.nikeFeatureNumberText}>{(index + 1).toString().padStart(2, '0')}</Text>
                </View>
                <Text style={styles.nikeFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.nikeCTASection}>
          <Text style={styles.nikeCTATitle}>SẴN SÀNG BỨT PHÁ?</Text>
          <Text style={styles.nikeCTASubtitle}>Khám phá ngay Ultraboost và cảm nhận sự khác biệt</Text>
          
          <View style={styles.nikeCTAButtons}>
            <TouchableOpacity style={styles.nikeShopButton}>
              <Text style={styles.nikeShopButtonText}>SHOP ULTRABOOST</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.nikeShopIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nikeExploreButton}>
              <Text style={styles.nikeExploreButtonText}>TÌM HIỂU THÊM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand Values */}
        <View style={styles.nikeValuesSection}>
          <Text style={styles.nikeValuesTitle}>GIÁ TRỊ ULTRABOOST</Text>
          <View style={styles.nikeValuesContent}>
            <View style={styles.nikeValueItem}>
              <Ionicons name="leaf-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Bền vững</Text>
              <Text style={styles.nikeValueDesc}>Sử dụng vật liệu tái chế, thân thiện môi trường</Text>
            </View>
            
            <View style={styles.nikeValueItem}>
              <Ionicons name="walk-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Đa năng</Text>
              <Text style={styles.nikeValueDesc}>Phù hợp cả chạy bộ lẫn thời trang hàng ngày</Text>
            </View>
            
            <View style={styles.nikeValueItem}>
              <Ionicons name="star-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Hiệu suất</Text>
              <Text style={styles.nikeValueDesc}>Tối ưu cho vận động viên và người yêu thể thao</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroductionScreen3; 
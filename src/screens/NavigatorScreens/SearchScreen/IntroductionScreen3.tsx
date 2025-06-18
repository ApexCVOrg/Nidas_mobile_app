import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles/search/introduction.styles';

const IntroductionScreen3 = () => {
  const navigation = useNavigation();
  
  const content = {
    title: 'NIKE COLLECTION',
    banner: require('../../../../assets/nike.gif'),
    slogan: 'JUST DO IT',
    description: 'Discover the latest Nike collection - where innovation, performance and style converge. ' +
      'From legendary athletic shoes to premium apparel, Nike delivers the ultimate sports experience ' +
      'for every athlete, from professionals to sports enthusiasts.',
    categories: [
      {
        title: 'Nike Air Series',
        description: 'Legendary air cushioning technology',
        icon: 'flash-outline'
      },
      {
        title: 'Dri-FIT Technology',
        description: 'Optimal moisture-wicking material',
        icon: 'water-outline'
      },
      {
        title: 'Performance Gear',
        description: 'Premium athletic apparel',
        icon: 'fitness-outline'
      },
      {
        title: 'Limited Editions',
        description: 'Exclusive limited releases',
        icon: 'star-outline'
      }
    ],
    features: [
      'Advanced Air Cushioning technology',
      'Ultra-light Flyknit material',
      'Optimized aerodynamic design',
      'High-elastic React foam sole',
      'Responsive Zoom Air',
      'Sustainable materials'
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NIKE</Text>
        <View style={styles.headerRight} />
      </View>

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
              <Text style={styles.nikeBannerSubtitle}>Just Do It - Innovation Never Stops</Text>
            </View>
          </View>
        </View>

        {/* Brand Story */}
        <View style={styles.nikeStorySection}>
          <View style={styles.nikeBrandHeader}>
            <Text style={styles.nikeBrandTitle}>INNOVATION THAT MOVES YOU</Text>
            <View style={styles.nikeDivider} />
          </View>
          <Text style={styles.nikeStoryText}>{content.description}</Text>
        </View>

        {/* Technology Categories */}
        <View style={styles.nikeCategoriesSection}>
          <Text style={styles.nikeCategoriesTitle}>NIKE TECHNOLOGIES</Text>
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
          <Text style={styles.nikePerformanceTitle}>PERFORMANCE FEATURES</Text>
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
          <Text style={styles.nikeCTATitle}>READY TO PERFORM?</Text>
          <Text style={styles.nikeCTASubtitle}>Explore the Nike collection and find the perfect product for you</Text>
          
          <View style={styles.nikeCTAButtons}>
            <TouchableOpacity style={styles.nikeShopButton}>
              <Text style={styles.nikeShopButtonText}>SHOP NIKE</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.nikeShopIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nikeExploreButton}>
              <Text style={styles.nikeExploreButtonText}>EXPLORE MORE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nike Values */}
        <View style={styles.nikeValuesSection}>
          <Text style={styles.nikeValuesTitle}>NIKE VALUES</Text>
          <View style={styles.nikeValuesContent}>
            <View style={styles.nikeValueItem}>
              <Ionicons name="earth-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Sustainability</Text>
              <Text style={styles.nikeValueDesc}>Committed to environmental protection through every product</Text>
            </View>
            
            <View style={styles.nikeValueItem}>
              <Ionicons name="people-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Community</Text>
              <Text style={styles.nikeValueDesc}>Connecting the global sports community</Text>
            </View>
            
            <View style={styles.nikeValueItem}>
              <Ionicons name="trophy-outline" size={28} color="#000" />
              <Text style={styles.nikeValueTitle}>Excellence</Text>
              <Text style={styles.nikeValueDesc}>Pursuing perfection in every product</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroductionScreen3; 
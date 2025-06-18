import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../../styles/search/introduction.styles';

const IntroductionScreen2 = () => {
  const content = {
    title: 'HANDBALL SPEZIAL',
    banner: require('../../../../assets/handball.gif'),
    description: 'Handball Spezial - Icon of authentic retro style. ' +
      'Originally designed for indoor handball, it has now become a street fashion icon. ' +
      'With design inspired by the 70s, these shoes bring classic beauty mixed with modern comfort.',
    features: [
      'Distinctive retro design',
      'Durable gum sole',
      'Premium suede upper',
      'Iconic 3-stripes logo'
    ]
  };

  return (
    <ScrollView style={styles.luxuryContainer} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image 
          source={content.banner}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>ADIDAS ORIGINALS</Text>
            <Text style={styles.heroTitle}>HANDBALL{'\n'}SPEZIAL</Text>
            <Text style={styles.heroTagline}>Step into retro-inspired design</Text>
          </View>
        </View>
      </View>

      {/* Brand Story Section */}
      <View style={styles.storySection}>
        <View style={styles.storyHeader}>
          <Text style={styles.storyTitle}>THE STORY</Text>
          <View style={styles.divider} />
        </View>
        <Text style={styles.storyText}>
          Born on the handball courts of the 1970s, the Handball Spezial has transcended its athletic origins to become a streetwear icon. This legendary silhouette embodies the perfect fusion of retro aesthetics and contemporary comfort.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        <Text style={styles.gridTitle}>CRAFTSMANSHIP</Text>
        <View style={styles.gridContainer}>
          {content.features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureNumber}>
                <Text style={styles.featureNumberText}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>DISCOVER THE COLLECTION</Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>SHOP NOW</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>ADIDAS ORIGINALS</Text>
        <Text style={styles.footerSubtext}>Impossible is Nothing</Text>
      </View>
    </ScrollView>
  );
};

export default IntroductionScreen2; 
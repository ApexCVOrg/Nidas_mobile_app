import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const IntroductionScreen4 = () => {
  return (
    <ScrollView style={sl72Styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={sl72Styles.heroSection}>
        <Image 
          source={require('../../../../assets/sl72.gif')}
          style={sl72Styles.heroImage}
          resizeMode="cover"
        />
        <View style={sl72Styles.heroOverlay}>
          <View style={sl72Styles.heroContent}>
            <Text style={sl72Styles.heroTitle}>SL 72</Text>
            <Text style={sl72Styles.heroSubtitle}>VINTAGE RUNNING REDEFINED</Text>
            <View style={sl72Styles.heroLine} />
            <Text style={sl72Styles.heroDescription}>
              Born in the 70s, Built for Today
            </Text>
          </View>
        </View>
      </View>

      {/* Heritage Section */}
      <View style={sl72Styles.section}>
        <View style={sl72Styles.sectionHeader}>
          <Text style={sl72Styles.sectionTitle}>HERITAGE</Text>
          <View style={sl72Styles.sectionDivider} />
        </View>
        <Text style={sl72Styles.sectionDescription}>
          The Adidas SL 72 made its debut during the 1972 Munich Olympics, representing the pinnacle of running technology. 
          Designed as a lightweight training shoe, the SL 72 (Super Light) revolutionized athletic footwear with its 
          innovative construction and timeless aesthetic. Today, this vintage icon continues to inspire with its 
          perfect blend of retro style and modern comfort.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={sl72Styles.featuresSection}>
        <Text style={sl72Styles.featuresSectionTitle}>DESIGN FEATURES</Text>
        <View style={sl72Styles.featuresGrid}>
          {[
            {
              icon: 'flash-outline',
              title: 'LIGHTWEIGHT',
              description: 'Super Light construction for enhanced performance.'
            },
            {
              icon: 'time-outline',
              title: 'VINTAGE',
              description: 'Authentic 70s design with modern updates.'
            },
            {
              icon: 'diamond-outline',
              title: 'QUALITY',
              description: 'Premium materials and expert craftsmanship.'
            },
            {
              icon: 'trending-up-outline',
              title: 'PERFORMANCE',
              description: 'Engineered for running and everyday wear.'
            }
          ].map((feature, index) => (
            <View key={index} style={sl72Styles.featureCard}>
              <View style={sl72Styles.featureIconContainer}>
                <Ionicons name={feature.icon as any} size={28} color="#FFFFFF" />
              </View>
              <Text style={sl72Styles.featureTitle}>{feature.title}</Text>
              <Text style={sl72Styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Specifications Section */}
      <View style={sl72Styles.specsSection}>
        <Text style={sl72Styles.specsSectionTitle}>SPECIFICATIONS</Text>
        <View style={sl72Styles.specsGrid}>
          {[
            { label: 'Weight', value: '290g' },
            { label: 'Drop', value: '12mm' },
            { label: 'Upper', value: 'Suede & Nylon' },
            { label: 'Sole', value: 'Rubber Outsole' }
          ].map((spec, index) => (
            <View key={index} style={sl72Styles.specCard}>
              <Text style={sl72Styles.specValue}>{spec.value}</Text>
              <Text style={sl72Styles.specLabel}>{spec.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Technology Section */}
      <View style={sl72Styles.techSection}>
        <View style={sl72Styles.techContent}>
          <Text style={sl72Styles.techTitle}>TECHNOLOGY</Text>
          <Text style={sl72Styles.techDescription}>
            The SL 72 features a classic suede and nylon upper construction that provides durability and breathability. 
            The rubber outsole offers excellent grip and traction, while the EVA midsole delivers cushioning for 
            all-day comfort. The iconic three stripes and vintage colorways make this shoe a timeless classic.
          </Text>
          <View style={sl72Styles.techFeatures}>
            <View style={sl72Styles.techFeature}>
              <Ionicons name="checkmark-circle" size={20} color="#1976D2" />
              <Text style={sl72Styles.techFeatureText}>Suede & Nylon Upper</Text>
            </View>
            <View style={sl72Styles.techFeature}>
              <Ionicons name="checkmark-circle" size={20} color="#1976D2" />
              <Text style={sl72Styles.techFeatureText}>EVA Midsole Cushioning</Text>
            </View>
            <View style={sl72Styles.techFeature}>
              <Ionicons name="checkmark-circle" size={20} color="#1976D2" />
              <Text style={sl72Styles.techFeatureText}>Rubber Outsole</Text>
            </View>
            <View style={sl72Styles.techFeature}>
              <Ionicons name="checkmark-circle" size={20} color="#1976D2" />
              <Text style={sl72Styles.techFeatureText}>Vintage Aesthetic</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={sl72Styles.ctaSection}>
        <Text style={sl72Styles.ctaTitle}>STEP INTO HISTORY</Text>
        <Text style={sl72Styles.ctaDescription}>
          Experience the legendary SL 72. Where vintage meets performance in perfect harmony.
        </Text>
        <TouchableOpacity style={sl72Styles.ctaButton}>
          <Text style={sl72Styles.ctaButtonText}>SHOP SL 72</Text>
          <Ionicons name="arrow-forward" size={20} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={sl72Styles.footer}>
        <Text style={sl72Styles.footerText}>
          "Classics never go out of style."
        </Text>
        <Text style={sl72Styles.footerSignature}>- Adidas Originals</Text>
      </View>
    </ScrollView>
  );
};

const sl72Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Hero Section
  heroSection: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(25, 118, 210, 0.7)', // Blue overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
  },
  heroLine: {
    width: 60,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 20,
  },
  heroDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Section Styles
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1976D2', // Blue
    letterSpacing: 1,
  },
  sectionDivider: {
    width: 40,
    height: 3,
    backgroundColor: '#1976D2',
    marginTop: 8,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: '#2C3E50',
    textAlign: 'justify',
  },

  // Features Section
  featuresSection: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  featuresSectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderTopWidth: 4,
    borderTopColor: '#1976D2',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#1976D2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Specifications Section
  specsSection: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  specsSectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.3)',
  },
  specValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1976D2',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Technology Section
  techSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  techContent: {
    alignItems: 'center',
  },
  techTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 20,
    letterSpacing: 2,
  },
  techDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  techFeatures: {
    width: '100%',
  },
  techFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  techFeatureText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
    fontWeight: '500',
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    marginRight: 10,
    letterSpacing: 1,
  },

  // Footer
  footer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerSignature: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
});

export default IntroductionScreen4; 
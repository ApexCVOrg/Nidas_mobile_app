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
    <ScrollView style={arsenalStyles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={arsenalStyles.heroSection}>
        <Image 
          source={require('../../../../assets/arsenal_banner.jpg')}
          style={arsenalStyles.heroImage}
          resizeMode="cover"
        />
        <View style={arsenalStyles.heroOverlay}>
          <View style={arsenalStyles.heroContent}>
            <Text style={arsenalStyles.heroTitle}>ARSENAL</Text>
            <Text style={arsenalStyles.heroSubtitle}>NORTH LONDON FOREVER</Text>
            <View style={arsenalStyles.heroLine} />
            <Text style={arsenalStyles.heroDescription}>
              The Pride of North London
            </Text>
          </View>
        </View>
      </View>

      {/* Club Heritage Section */}
      <View style={arsenalStyles.section}>
        <View style={arsenalStyles.sectionHeader}>
          <Text style={arsenalStyles.sectionTitle}>CLUB HERITAGE</Text>
          <View style={arsenalStyles.sectionDivider} />
        </View>
        <Text style={arsenalStyles.sectionDescription}>
          Founded in 1886, Arsenal Football Club has been a cornerstone of English football for over 135 years. 
          Known as "The Gunners," we represent the spirit of North London with passion, pride, and unwavering determination. 
          From Highbury to the Emirates Stadium, our legacy continues to inspire generations of football fans worldwide.
        </Text>
      </View>

      {/* Values Grid */}
      <View style={arsenalStyles.valuesSection}>
        <Text style={arsenalStyles.valuesSectionTitle}>OUR VALUES</Text>
        <View style={arsenalStyles.valuesGrid}>
          {[
            {
              icon: 'trophy-outline',
              title: 'EXCELLENCE',
              description: 'Striving for greatness in every match, every season.'
            },
            {
              icon: 'people-outline',
              title: 'UNITY',
              description: 'One team, one family, one Arsenal.'
            },
            {
              icon: 'heart-outline',
              title: 'PASSION',
              description: 'The fire that burns in every Gunner\'s heart.'
            },
            {
              icon: 'shield-outline',
              title: 'TRADITION',
              description: 'Honoring our past while building our future.'
            }
          ].map((value, index) => (
            <View key={index} style={arsenalStyles.valueCard}>
              <View style={arsenalStyles.valueIconContainer}>
                <Ionicons name={value.icon as any} size={28} color="#FFFFFF" />
              </View>
              <Text style={arsenalStyles.valueTitle}>{value.title}</Text>
              <Text style={arsenalStyles.valueDescription}>{value.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements Section */}
      <View style={arsenalStyles.achievementsSection}>
        <Text style={arsenalStyles.achievementsSectionTitle}>ACHIEVEMENTS</Text>
        <View style={arsenalStyles.achievementsGrid}>
          {[
            { number: '13', title: 'Premier League Titles' },
            { number: '14', title: 'FA Cup Wins' },
            { number: '2', title: 'League Cup Titles' },
            { number: '1', title: 'European Cup Winners\' Cup' }
          ].map((achievement, index) => (
            <View key={index} style={arsenalStyles.achievementCard}>
              <Text style={arsenalStyles.achievementNumber}>{achievement.number}</Text>
              <Text style={arsenalStyles.achievementTitle}>{achievement.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stadium Section */}
      <View style={arsenalStyles.stadiumSection}>
        <View style={arsenalStyles.stadiumContent}>
          <Text style={arsenalStyles.stadiumTitle}>EMIRATES STADIUM</Text>
          <Text style={arsenalStyles.stadiumDescription}>
            Our home since 2006, the Emirates Stadium stands as a modern fortress in North London. 
            With a capacity of 60,704, it's where legends are made and dreams come true. 
            The atmosphere on matchday is electric, with the roar of the crowd driving our players to victory.
          </Text>
          <View style={arsenalStyles.stadiumStats}>
            <View style={arsenalStyles.stadiumStat}>
              <Text style={arsenalStyles.stadiumStatNumber}>60,704</Text>
              <Text style={arsenalStyles.stadiumStatLabel}>Capacity</Text>
            </View>
            <View style={arsenalStyles.stadiumStat}>
              <Text style={arsenalStyles.stadiumStatNumber}>2006</Text>
              <Text style={arsenalStyles.stadiumStatLabel}>Opened</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={arsenalStyles.ctaSection}>
        <Text style={arsenalStyles.ctaTitle}>JOIN THE ARSENAL FAMILY</Text>
        <Text style={arsenalStyles.ctaDescription}>
          Be part of the North London legacy. Support the Gunners and wear your colors with pride.
        </Text>
        <TouchableOpacity style={arsenalStyles.ctaButton}>
          <Text style={arsenalStyles.ctaButtonText}>EXPLORE COLLECTION</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={arsenalStyles.footer}>
        <Text style={arsenalStyles.footerText}>
          "Remember who you are, what you are, and who you represent."
        </Text>
        <Text style={arsenalStyles.footerSignature}>- Arsène Wenger</Text>
      </View>
    </ScrollView>
  );
};

const arsenalStyles = StyleSheet.create({
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
    backgroundColor: 'rgba(220, 20, 60, 0.7)', // Arsenal red overlay
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
    color: '#DC143C', // Arsenal red
    letterSpacing: 1,
  },
  sectionDivider: {
    width: 40,
    height: 3,
    backgroundColor: '#DC143C',
    marginTop: 8,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: '#2C3E50', // Dark navy
    textAlign: 'justify',
  },

  // Values Section
  valuesSection: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  valuesSectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#DC143C',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCard: {
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
    borderTopColor: '#DC143C',
  },
  valueIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#DC143C',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC143C',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Achievements Section
  achievementsSection: {
    backgroundColor: '#2C3E50', // Dark navy
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  achievementsSectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  achievementNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#DC143C',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Stadium Section
  stadiumSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  stadiumContent: {
    alignItems: 'center',
  },
  stadiumTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#DC143C',
    marginBottom: 20,
    letterSpacing: 2,
  },
  stadiumDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  stadiumStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stadiumStat: {
    alignItems: 'center',
  },
  stadiumStatNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#DC143C',
  },
  stadiumStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#DC143C',
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
    color: '#DC143C',
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
    color: '#DC143C',
  },
});

export default IntroductionScreen4; 
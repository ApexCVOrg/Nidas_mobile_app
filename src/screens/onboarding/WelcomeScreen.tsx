import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import TypingText from '../../components/TypingText';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const opacity = useSharedValue(0);

  const texts = [
    'Welcome to Nidas, we are very happy to have you',
    'Start by preparing for the best application experience.',
  ];

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    });
  }, []);

  const handleTypingComplete = () => {
    if (currentTextIndex < texts.length - 1) {
      setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
      }, 1000); // Đợi 1s rồi mới chuyển đoạn tiếp theo
    } else {
      setTimeout(() => {
        navigation.replace('NotificationPermission');
      }, 1000); // Đợi 1s rồi mới chuyển màn tiếp theo
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <TypingText
          text={texts[currentTextIndex]}
          style={styles.text}
          typingSpeed={50}
          onTypingComplete={handleTypingComplete}
        />
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.replace('NotificationPermission')}
        >
          <Text style={styles.skipButtonText}>Tap to skip</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 32,
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default WelcomeScreen; 
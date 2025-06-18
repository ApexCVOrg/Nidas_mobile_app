import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useDispatch } from 'react-redux';
import { setOnboardingComplete } from '../../store/slices/onboardingSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';

type OnboardingCompleteScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingComplete'>;
};

const OnboardingCompleteScreen = ({ navigation }: OnboardingCompleteScreenProps) => {
  const dispatch = useDispatch();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    });
  }, []);

  const handleComplete = () => {
    dispatch(setOnboardingComplete(true));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>
          Cảm ơn bạn đã bỏ thời gian cho chúng tôi, chúc bạn có trải nghiệm tốt nhất
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Bắt đầu sử dụng</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  button: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingCompleteScreen; 
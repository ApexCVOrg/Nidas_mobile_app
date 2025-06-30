import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { setOnboardingComplete } from '../../store/slices/onboardingSlice';

type AuthSuccessRouteProp = RouteProp<{ AuthSuccess: { token?: string } }, 'AuthSuccess'>;

export default function AuthSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<AuthSuccessRouteProp>();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = route.params?.token;
        const pendingRegistration = await AsyncStorage.getItem('pendingRegistration');

        if (token) {
          // Save token to AsyncStorage
          await AsyncStorage.setItem('auth_token', token);

          // You can fetch user info from backend here if needed
          // const userInfo = await fetchUserInfo(token);

          // Check if this is part of registration flow
          if (pendingRegistration) {
            // This is registration flow - continue with registration form
            setTimeout(() => {
              navigation.navigate('Register' as never);
            }, 2000); // Show loading for 2 seconds
          } else {
            // This is login flow - update Redux state and let App.tsx handle navigation
            dispatch(loginSuccess({ token, user: null }));
            dispatch(setOnboardingComplete(true));
            // Không gọi navigation.reset hay navigate ở đây
          }
        } else {
          // If no token, redirect to error screen
          console.log('Missing authentication token');
          // navigation.navigate('AuthError', { message: 'Missing authentication token' });
        }
      } catch (error) {
        console.error('Auth success error:', error);
        console.log('Authentication failed');
        // navigation.navigate('AuthError', { message: 'Authentication failed' });
      }
    };

    handleAuthSuccess();
  }, [route.params?.token, navigation, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.loadingText}>Đang đăng nhập...</Text>
          <Text style={styles.subText}>Please wait while we set up your account</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: 'black',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginTop: 20,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 
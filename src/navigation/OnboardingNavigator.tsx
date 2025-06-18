import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import NotificationPermissionScreen from '../screens/onboarding/NotificationPermissionScreen';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';
import PreferenceScreen from '../screens/onboarding/PreferenceScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';
import CategoryScreen from '../screens/CategoryScreen';

export type OnboardingStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  NotificationPermission: undefined;
  LocationPermission: undefined;
  Preference: undefined;
  OnboardingComplete: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Category: { categoryId: string; title: string };
  ProductDetail: { productId: number };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="Preference" component={PreferenceScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator; 
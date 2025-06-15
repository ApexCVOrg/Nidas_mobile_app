import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './OnboardingNavigator';

// Import screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import NotificationPermissionScreen from '../screens/onboarding/NotificationPermissionScreen';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';
import PreferenceScreen from '../screens/onboarding/PreferenceScreen';
import OnboardingComplete from '../screens/onboarding/OnboardingCompleteScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Onboarding Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
        <Stack.Screen name="Preference" component={PreferenceScreen} />
        <Stack.Screen name="OnboardingComplete" component={OnboardingComplete} />
        
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({ title: route.params?.title || 'Danh mục' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
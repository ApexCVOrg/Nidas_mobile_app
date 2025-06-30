import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/Auth/VerifyEmailScreen';
import VerifyOTPScreen from '../screens/Auth/VerifyOTPScreen';
import AuthSuccessScreen from '../screens/Auth/AuthSuccessScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { token?: string } | undefined;
  VerifyOTP: undefined;
  AuthSuccess: { token?: string } | undefined;
  AuthError: { message?: string } | undefined;
  ResetPassword: { token?: string } | undefined;
  AdminDashboard: undefined;
  ManagerDashboard: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator; 
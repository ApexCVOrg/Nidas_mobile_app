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

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import axiosInstance from '../../api/axiosInstance';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { loginStyles } from '../../styles/auth/login.styles';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const initialFormData: LoginFormData = {
  username: '',
  password: '',
  rememberMe: false,
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateLogin = (data: LoginFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!data.username) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (data.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!data.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (data.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return errors;
  };

  const handleLogin = async () => {
    setError('');
    setFieldErrors({});

    const errors = validateLogin(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      if (response.data.success) {
        // Save token based on Remember Me
        if (response.data.data?.token) {
          await AsyncStorage.setItem('auth_token', response.data.data.token);
        }

        // Get user role and navigate accordingly
        const role = response.data.data?.user?.role || 'user';
        if (role === 'admin') {
          navigation.replace('AdminDashboard');
        } else if (role === 'manager') {
          navigation.replace('ManagerDashboard');
        } else {
          navigation.replace('Main');
        }
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
  };

  const ErrorText = ({ field }: { field: string }) => {
    if (!fieldErrors[field]) return null;
    return <Text style={loginStyles.errorText}>{fieldErrors[field]}</Text>;
  };

  return (
    <View style={loginStyles.container}>
                      <TouchableOpacity onPress={() => navigation.navigate('MainTabs' as never)}>
                  <Text style={{ color: '#1A1A1A', fontWeight: '500', fontSize: 14, textAlign: 'left', marginTop: 16, marginLeft: 16 }}>Home</Text>
                </TouchableOpacity>
      <ScrollView contentContainerStyle={loginStyles.scrollContent}>
        <View style={loginStyles.formContainer}>
          <Text style={loginStyles.title}>Welcome Back</Text>
          <Text style={loginStyles.subtitle}>Sign in to continue</Text>

          <Formik
            initialValues={initialFormData}
            validationSchema={Yup.object().shape({
              username: Yup.string().required('Enter your email'),
              password: Yup.string().required('Enter your password'),
            })}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <View style={loginStyles.inputContainer}>
                  <Icon name="email" size={24} color="black" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {touched.username && errors.username && (
                  <Text style={loginStyles.errorText}>{errors.username}</Text>
                )}

                <View style={loginStyles.inputContainer}>
                  <Icon name="lock" size={24} color="black" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={loginStyles.eyeIcon}>
                    <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={loginStyles.errorText}>{errors.password}</Text>
                )}
                <View style={loginStyles.rememberForgotContainer}>
                  <TouchableOpacity style={loginStyles.checkboxContainer} onPress={() => handleChange('rememberMe')}>
                    <View style={[loginStyles.checkbox, values.rememberMe && loginStyles.checkboxChecked]}>
                      {values.rememberMe && <Icon name="check" size={20} color="white" />}
                    </View>
                    <Text style={loginStyles.checkboxLabel}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={loginStyles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {error && (
                  <Text style={loginStyles.errorMessage}>{error}</Text>
                )}

                <TouchableOpacity
                  style={[loginStyles.button, isSubmitting && loginStyles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={loginStyles.buttonText}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <View style={loginStyles.dividerContainer}>
                  <View style={loginStyles.divider} />
                  <Text style={loginStyles.dividerText}>OR</Text>
                  <View style={loginStyles.divider} />
                </View>

                <TouchableOpacity style={loginStyles.socialButton} onPress={() => handleSocialLogin('Google')}>
                  <FontAwesome5 name="google" size={20} color="black" style={loginStyles.socialIcon} />
                  <Text style={loginStyles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[loginStyles.socialButton, loginStyles.facebookButton]} onPress={() => handleSocialLogin('Facebook')}>
                  <FontAwesome5 name="facebook" size={20} color="white" style={loginStyles.socialIcon} />
                  <Text style={loginStyles.facebookButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <Text style={loginStyles.termsText}>
                  By signing in, you agree to our{' '}
                  <Text style={loginStyles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={loginStyles.termsLink}>Privacy Policy</Text>
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                  <Text>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={loginStyles.link}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen; 
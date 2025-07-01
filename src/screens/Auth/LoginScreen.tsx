import React, { useState, useEffect } from 'react';
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
import { useNavigation, CommonActions } from '@react-navigation/native';
import { loginStyles } from '../../styles/auth/login.styles';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { setOnboardingComplete } from '../../store/slices/onboardingSlice';
import { TabNavigatorParamList } from '../../navigation/TabNavigator';

const REMEMBER_ME_KEY = 'remember_me_credentials';
const REMEMBER_ME_ENABLED_KEY = 'remember_me_enabled';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
  username: '',
  password: '',
  rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<TabNavigatorParamList>>();

  // Load saved credentials on mount
  useEffect(() => {
    (async () => {
      try {
        const rememberMeEnabled = await AsyncStorage.getItem(REMEMBER_ME_ENABLED_KEY);
        if (rememberMeEnabled === 'true') {
          const savedCredentials = await AsyncStorage.getItem(REMEMBER_ME_KEY);
          if (savedCredentials) {
            const credentials = JSON.parse(savedCredentials);
            setFormData({
              username: credentials.username,
              password: credentials.password,
              rememberMe: true,
            });
          }
        }
      } catch (error) {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        await AsyncStorage.removeItem(REMEMBER_ME_ENABLED_KEY);
      }
    })();
  }, []);

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const saveCredentials = async (username: string, password: string) => {
    try {
      await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({ username, password }));
      await AsyncStorage.setItem(REMEMBER_ME_ENABLED_KEY, 'true');
    } catch (error) {}
  };

  const clearSavedCredentials = async () => {
    try {
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      await AsyncStorage.removeItem(REMEMBER_ME_ENABLED_KEY);
    } catch (error) {}
  };

  const validateLogin = (data: typeof formData): Record<string, string> => {
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
        // Remember Me
        if (formData.rememberMe) {
          await saveCredentials(formData.username, formData.password);
        } else {
          await clearSavedCredentials();
        }
        // Save token
        if (response.data.data?.token) {
          await AsyncStorage.setItem('auth_token', response.data.data.token);
        }
        // Navigate by role
        const role = response.data.data?.user?.role || 'user';
        if (role === 'admin') {
          // Nếu có màn AdminDashboard thì mở, nếu không thì chỉ login bình thường
          // navigation.navigate('Auth', { screen: 'AdminDashboard' });
        } else if (role === 'manager') {
          // navigation.navigate('Auth', { screen: 'ManagerDashboard' });
        } else {
          dispatch(loginSuccess({ token: response.data.data.token, user: response.data.data.user }));
          dispatch(setOnboardingComplete(true));
          console.log('✅ Login successful - Dispatched loginSuccess and setOnboardingComplete');
          console.log('🔍 Token:', response.data.data.token);
          console.log('👤 User:', response.data.data.user);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            })
          );
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
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 2 }}
        onPress={() => navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
        )}
      >
        <Icon name="arrow-back-ios" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={loginStyles.scrollContent}>
        <View style={loginStyles.formContainer}>
          <Text style={loginStyles.title}>Đăng nhập</Text>
          <Text style={loginStyles.subtitle}>Chào mừng bạn quay lại!</Text>

                <View style={loginStyles.inputContainer}>
            <Icon name="person" size={24} color="black" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.input}
              placeholder="Tên đăng nhập"
                    placeholderTextColor="#888"
              value={formData.username}
              onChangeText={v => handleChange('username', v)}
              keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>
          {fieldErrors.username && (
            <Text style={loginStyles.errorText}>{fieldErrors.username}</Text>
                )}

                <View style={loginStyles.inputContainer}>
                  <Icon name="lock" size={24} color="black" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.input}
              placeholder="Mật khẩu"
                    placeholderTextColor="#888"
              value={formData.password}
              onChangeText={v => handleChange('password', v)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={loginStyles.eyeIcon}>
                    <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                  </TouchableOpacity>
                </View>
          {fieldErrors.password && (
            <Text style={loginStyles.errorText}>{fieldErrors.password}</Text>
                )}

                <View style={loginStyles.rememberForgotContainer}>
            <TouchableOpacity
              style={loginStyles.checkboxContainer}
              onPress={() => handleChange('rememberMe', !formData.rememberMe)}
            >
              <View style={[loginStyles.checkbox, formData.rememberMe && loginStyles.checkboxChecked]}>
                {formData.rememberMe && <Icon name="check" size={20} color="white" />}
                    </View>
              <Text style={loginStyles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
                  </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={loginStyles.forgotPassword}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
                </View>

          {error ? (
                  <Text style={loginStyles.errorMessage}>{error}</Text>
          ) : null}

                <TouchableOpacity
            style={[loginStyles.button, loading && loginStyles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
                >
                  <Text style={loginStyles.buttonText}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Text>
                </TouchableOpacity>

                <View style={loginStyles.dividerContainer}>
                  <View style={loginStyles.divider} />
            <Text style={loginStyles.dividerText}>HOẶC</Text>
                  <View style={loginStyles.divider} />
                </View>

                <TouchableOpacity style={loginStyles.socialButton} onPress={() => handleSocialLogin('Google')}>
                  <FontAwesome5 name="google" size={20} color="black" style={loginStyles.socialIcon} />
            <Text style={loginStyles.socialButtonText}>Đăng nhập với Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[loginStyles.socialButton, loginStyles.facebookButton]} onPress={() => handleSocialLogin('Facebook')}>
                  <FontAwesome5 name="facebook" size={20} color="white" style={loginStyles.socialIcon} />
            <Text style={loginStyles.facebookButtonText}>Đăng nhập với Facebook</Text>
                </TouchableOpacity>

                <Text style={loginStyles.termsText}>
            Khi đăng nhập, bạn đồng ý với{' '}
            <Text style={loginStyles.termsLink}>Điều khoản dịch vụ</Text> và{' '}
            <Text style={loginStyles.termsLink}>Chính sách bảo mật</Text>
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <Text>Bạn chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={loginStyles.link}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>
        </View>
      </ScrollView>
    </View>
  );
} 
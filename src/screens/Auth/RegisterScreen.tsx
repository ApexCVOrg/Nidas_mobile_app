import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import axiosInstance from '../../api/axiosInstance';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { registerStyles } from '../../styles/auth/register.styles';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

interface Address {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  addressNumber: string;
  isDefault: boolean;
}

interface RegisterFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: Address;
}

const initialFormData: RegisterFormData = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: {
    recipientName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    addressNumber: '',
    isDefault: false,
  },
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.username) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName) {
      errors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address.recipientName) {
      errors['address.recipientName'] = 'Vui lòng nhập tên người nhận';
    }
    if (!formData.address.street) {
      errors['address.street'] = 'Vui lòng nhập đường';
    }
    if (!formData.address.city) {
      errors['address.city'] = 'Vui lòng nhập thành phố';
    }
    if (!formData.address.state) {
      errors['address.state'] = 'Vui lòng nhập tỉnh/thành phố';
    }
    if (!formData.address.country) {
      errors['address.country'] = 'Vui lòng nhập quốc gia';
    }

    return errors;
  };

  const handleRegister = async () => {
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      console.log('Sending registration data:', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        addresses: [formData.address],
      });

      const response = await axiosInstance.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        addresses: [formData.address],
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Registration successful! Please login.');
        navigation.navigate('Login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError('An error occurred while setting up the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorText = ({ field }: { field: string }) => {
    if (!fieldErrors[field]) return null;
    return <Text style={registerStyles.errorText}>{fieldErrors[field]}</Text>;
  };

  return (
    <View style={registerStyles.container}>
      <ScrollView contentContainerStyle={registerStyles.scrollContent}>
        <View style={registerStyles.formContainer}>
          <Text style={registerStyles.title}>Create Account</Text>
          <Text style={registerStyles.subtitle}>Sign up to get started</Text>

          <Formik
            initialValues={initialFormData}
            validationSchema={Yup.object().shape({
              username: Yup.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự').required('Vui lòng nhập tên đăng nhập'),
              fullName: Yup.string().required('Vui lòng nhập họ tên'),
              email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
              password: Yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Vui lòng nhập mật khẩu'),
              confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp').required('Vui lòng nhập lại mật khẩu'),
              phone: Yup.string().matches(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
              address: Yup.object().shape({
                recipientName: Yup.string().required('Vui lòng nhập tên người nhận'),
                street: Yup.string().required('Vui lòng nhập đường'),
                city: Yup.string().required('Vui lòng nhập thành phố'),
                state: Yup.string().required('Vui lòng nhập tỉnh/thành phố'),
                country: Yup.string().required('Vui lòng nhập quốc gia'),
                addressNumber: Yup.string().required('Vui lòng nhập số nhà'),
              }),
            })}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
              <>
                <View style={registerStyles.inputContainer}>
                  <Icon name="person" size={24} color="black" style={registerStyles.inputIcon} />
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Full Name"
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                  />
                </View>
                {touched.fullName && errors.fullName && (
                  <Text style={registerStyles.errorText}>{errors.fullName}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <Icon name="email" size={24} color="black" style={registerStyles.inputIcon} />
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={registerStyles.errorText}>{errors.email}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <Icon name="lock" size={24} color="black" style={registerStyles.inputIcon} />
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={registerStyles.eyeIcon}>
                    <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={registerStyles.errorText}>{errors.password}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <Icon name="lock" size={24} color="black" style={registerStyles.inputIcon} />
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Confirm Password"
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={registerStyles.eyeIcon}>
                    <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={registerStyles.errorText}>{errors.confirmPassword}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <Icon name="phone" size={24} color="black" style={registerStyles.inputIcon} />
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Số điện thoại"
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    keyboardType="phone-pad"
                  />
                </View>
                {touched.phone && errors.phone && (
                  <Text style={registerStyles.errorText}>{errors.phone}</Text>
                )}

                <Text style={registerStyles.sectionTitle}>Địa chỉ</Text>

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Tên người nhận"
                    onChangeText={handleChange('address.recipientName')}
                    onBlur={handleBlur('address.recipientName')}
                    value={values.address.recipientName}
                  />
                </View>
                {touched.address && touched.address.recipientName && errors.address && errors.address.recipientName && (
                  <Text style={registerStyles.errorText}>{errors.address.recipientName}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Số nhà"
                    onChangeText={handleChange('address.addressNumber')}
                    onBlur={handleBlur('address.addressNumber')}
                    value={values.address.addressNumber}
                  />
                </View>
                {touched.address && touched.address.addressNumber && errors.address && errors.address.addressNumber && (
                  <Text style={registerStyles.errorText}>{errors.address.addressNumber}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Đường"
                    onChangeText={handleChange('address.street')}
                    onBlur={handleBlur('address.street')}
                    value={values.address.street}
                  />
                </View>
                {touched.address && touched.address.street && errors.address && errors.address.street && (
                  <Text style={registerStyles.errorText}>{errors.address.street}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Thành phố"
                    onChangeText={handleChange('address.city')}
                    onBlur={handleBlur('address.city')}
                    value={values.address.city}
                  />
                </View>
                {touched.address && touched.address.city && errors.address && errors.address.city && (
                  <Text style={registerStyles.errorText}>{errors.address.city}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Tỉnh/Thành phố"
                    onChangeText={handleChange('address.state')}
                    onBlur={handleBlur('address.state')}
                    value={values.address.state}
                  />
                </View>
                {touched.address && touched.address.state && errors.address && errors.address.state && (
                  <Text style={registerStyles.errorText}>{errors.address.state}</Text>
                )}

                <View style={registerStyles.inputContainer}>
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Quốc gia"
                    onChangeText={handleChange('address.country')}
                    onBlur={handleBlur('address.country')}
                    value={values.address.country}
                  />
                </View>
                {touched.address && touched.address.country && errors.address && errors.address.country && (
                  <Text style={registerStyles.errorText}>{errors.address.country}</Text>
                )}

                <TouchableOpacity
                  style={registerStyles.checkboxContainer}
                  onPress={() => {
                    const newValue = !values.address.isDefault;
                    setFieldValue('address.isDefault', newValue);
                  }}
                >
                  <View style={[
                    registerStyles.checkbox,
                    values.address.isDefault && registerStyles.checkboxChecked
                  ]}>
                    {values.address.isDefault && <Icon name="check" size={16} color="white" />}
                  </View>
                  <Text style={registerStyles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
                </TouchableOpacity>

                {error && (
                  <Text style={registerStyles.errorMessage}>{error}</Text>
                )}

                <TouchableOpacity
                  style={[registerStyles.button, isSubmitting && registerStyles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={registerStyles.buttonText}>
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>

                <View style={registerStyles.dividerContainer}>
                  <View style={registerStyles.divider} />
                  <Text style={registerStyles.dividerText}>OR</Text>
                  <View style={registerStyles.divider} />
                </View>

                <TouchableOpacity style={registerStyles.socialButton} onPress={() => {}}>
                  <FontAwesome5 name="google" size={20} color="black" style={registerStyles.socialIcon} />
                  <Text style={registerStyles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[registerStyles.socialButton, registerStyles.facebookButton]} onPress={() => {}}>
                  <FontAwesome5 name="facebook" size={20} color="white" style={registerStyles.socialIcon} />
                  <Text style={registerStyles.facebookButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <Text style={registerStyles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={registerStyles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={registerStyles.termsLink}>Privacy Policy</Text>
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                  <Text>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={registerStyles.link}>Sign In</Text>
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

export default RegisterScreen; 
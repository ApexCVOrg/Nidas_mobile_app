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
  const [step, setStep] = useState(1);

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

  const validateStep = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (step === 1) {
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
    } else if (step === 2) {
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
    }
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep(step + 1);
  };

  const handleBack = () => {
    setFieldErrors({});
    setStep(step - 1);
  };

  const handleRegister = async () => {
    setError('');
    setFieldErrors({});
    const errors = validateStep();
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
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your internet connection.');
      } else {
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
      <ScrollView contentContainerStyle={registerStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={registerStyles.formContainer}>
          <Text style={registerStyles.title}>Create Account</Text>
          <Text style={registerStyles.subtitle}>Sign up to get started</Text>

          {step === 1 && (
            <>
              <View style={registerStyles.inputContainer}>
                <Icon name="person" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  value={formData.fullName}
                  onChangeText={text => handleChange('fullName', text)}
                />
              </View>
              <ErrorText field="fullName" />
              <View style={registerStyles.inputContainer}>
                <Icon name="email" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={formData.email}
                  onChangeText={text => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <ErrorText field="email" />
              <View style={registerStyles.inputContainer}>
                <Icon name="person" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={formData.username}
                  onChangeText={text => handleChange('username', text)}
                  autoCapitalize="none"
                />
              </View>
              <ErrorText field="username" />
              <View style={registerStyles.inputContainer}>
                <Icon name="lock" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={formData.password}
                  onChangeText={text => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={registerStyles.eyeIcon}>
                  <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ErrorText field="password" />
              <View style={registerStyles.inputContainer}>
                <Icon name="lock" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"

                  value={formData.confirmPassword}
                  onChangeText={text => handleChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={registerStyles.eyeIcon}>
                  <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ErrorText field="confirmPassword" />
              <View style={registerStyles.inputContainer}>
                <Icon name="phone" size={24} color="black" style={registerStyles.inputIcon} />
                <TextInput
                  style={registerStyles.input}
                  placeholder="Phone"
                  placeholderTextColor="#888"

                  value={formData.phone}
                  onChangeText={text => handleChange('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              <ErrorText field="phone" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={registerStyles.sectionTitle}>Địa chỉ</Text>
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Recipient Name"
                  placeholderTextColor="#888"

                  value={formData.address.recipientName}
                  onChangeText={text => handleAddressChange('recipientName', text)}
                />
              </View>
              <ErrorText field="address.recipientName" />
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Address Number"
                  placeholderTextColor="#888"
                  value={formData.address.addressNumber}
                  onChangeText={text => handleAddressChange('addressNumber', text)}
                />
              </View>
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Street"
                  placeholderTextColor="#888"
                  value={formData.address.street}
                  onChangeText={text => handleAddressChange('street', text)}
                />
              </View>
              <ErrorText field="address.street" />
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="City"
                  placeholderTextColor="#888"

                  value={formData.address.city}
                  onChangeText={text => handleAddressChange('city', text)}
                />
              </View>
              <ErrorText field="address.city" />
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="State"
                  placeholderTextColor="#888"

                  value={formData.address.state}
                  onChangeText={text => handleAddressChange('state', text)}
                />
              </View>
              <ErrorText field="address.state" />
              <View style={registerStyles.inputContainer}>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Country"
                  placeholderTextColor="#888"

                  value={formData.address.country}
                  onChangeText={text => handleAddressChange('country', text)}
                />
              </View>
              <ErrorText field="address.country" />
              <TouchableOpacity
                style={registerStyles.checkboxContainer}
                onPress={() => handleAddressChange('isDefault', !formData.address.isDefault)}
              >
                <View style={[
                  registerStyles.checkbox,
                  formData.address.isDefault && registerStyles.checkboxChecked
                ]}>
                  {formData.address.isDefault && <Icon name="check" size={16} color="white" />}
                </View>
                <Text style={registerStyles.checkboxLabel}>Set as default address</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={registerStyles.sectionTitle}>Confirm information</Text>
              <Text>Họ tên: {formData.fullName}</Text>
              <Text>Email: {formData.email}</Text>
              <Text>Tên đăng nhập: {formData.username}</Text>
              <Text>Phone: {formData.phone}</Text>
              {error && <Text style={registerStyles.errorMessage}>{error}</Text>}
            </>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            {step > 1 && (
              <TouchableOpacity style={[registerStyles.button, { flex: 1, marginRight: 8 }]} onPress={handleBack}>
                <Text style={registerStyles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
            {step < 3 && (
              <TouchableOpacity style={[registerStyles.button, { flex: 1, marginLeft: step > 1 ? 8 : 0 }]} onPress={handleNext}>
                <Text style={registerStyles.buttonText}>Continue</Text>
              </TouchableOpacity>
            )}
            {step === 3 && (
              <TouchableOpacity style={[registerStyles.button, { flex: 1, marginLeft: step > 1 ? 8 : 0 }]} onPress={handleRegister} disabled={loading}>
                <Text style={registerStyles.buttonText}>{loading ? 'Creating...' : 'Create account'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={registerStyles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen; 
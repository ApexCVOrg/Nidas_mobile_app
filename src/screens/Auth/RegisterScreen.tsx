import React, { useState, useRef, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { TextInput, Text, IconButton, Button, Checkbox } from 'react-native-paper';
import { registerStyles } from '../../styles/auth/register.styles';
import api from '../../api/axiosInstance';

const initialBasicInfo = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};
const initialAddress = {
  recipientName: '',
  addressNumber: '',
  street: '',
  city: '',
  state: '',
  country: '',
  isDefault: false,
};

const RegisterScreen = ({ navigation }: any) => {
  // Step state
  const [step, setStep] = useState(1);
  // Basic info
  const [basicInfo, setBasicInfo] = useState({ ...initialBasicInfo });
  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  // Address
  const [address, setAddress] = useState({ ...initialAddress });
  // UI/logic
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpInputs = useRef<any[]>([]);
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [canResend, setCanResend] = useState(false);
  const [emailInVerification, setEmailInVerification] = useState(false);

  // Timer for OTP
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Animation for step change
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [step]);

  // Validate helpers
  const validateBasicInfo = () => {
    let err: any = {};
    if (!basicInfo.username) err.username = 'Username is required';
    if (!basicInfo.fullName) err.fullName = 'Full Name is required';
    if (!basicInfo.email) err.email = 'Email is required';
    if (!basicInfo.password || basicInfo.password.length < 8) err.password = 'Password must be at least 8 characters';
    if (basicInfo.password !== basicInfo.confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (!basicInfo.phone) err.phone = 'Phone is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const validateAddress = () => {
    let err: any = {};
    if (!address.recipientName) err.recipientName = 'Recipient name is required';
    if (!address.street) err.street = 'Street is required';
    if (!address.city) err.city = 'City is required';
    if (!address.state) err.state = 'State is required';
    if (!address.country) err.country = 'Country is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Step 1: Register
  const handleSendOtp = async () => {
    if (!validateBasicInfo()) return;
    setLoading(true);
    setErrors({});
    setEmailInVerification(false);
    try {
      await api.post('/auth/register', {
        username: basicInfo.username,
        fullName: basicInfo.fullName,
        email: basicInfo.email,
        password: basicInfo.password,
        phone: basicInfo.phone,
      });
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (e: any) {
      if (e.response && e.response.data) {
        const msg = e.response.data.message || '';
        if (
          msg.toLowerCase().includes('pending') ||
          msg.toLowerCase().includes('verification email sent') ||
          msg.toLowerCase().includes('already in verification process')
        ) {
          setEmailInVerification(true);
          setCanResend(true);
          setErrors({ email: 'Email is already in verification process' });
          return;
        }
        if (e.response.data.errors) setErrors(e.response.data.errors);
        else setErrors({ general: msg || 'Failed to send OTP' });
      } else {
        setErrors({ general: 'Network or server error.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrors({});
    try {
      // Thử gọi resend-verification để gửi lại OTP
      const response = await api.post('/auth/resend-verification', { email: basicInfo.email });
      if (response.data && response.data.success) {
        setStep(2);
        setTimer(60);
        setErrors({});
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setEmailInVerification(false);
        return;
      } else {
        // Nếu resend không thành công, thử gọi lại register
        const registerResponse = await api.post('/auth/register', {
          username: basicInfo.username,
          fullName: basicInfo.fullName,
          email: basicInfo.email,
          password: basicInfo.password,
          phone: basicInfo.phone,
        });
        if (registerResponse.data && (registerResponse.data.success || registerResponse.data.status === 'pending')) {
          setStep(2);
          setTimer(60);
          setErrors({});
          setCanResend(false);
          setOtp(['', '', '', '', '', '']);
          setEmailInVerification(false);
          return;
        } else {
          setErrors({ general: registerResponse.data.message || 'Cannot resend OTP' });
        }
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrors({ general: err.response.data.message || 'Server connection error' });
      } else {
        setErrors({ general: 'Server connection error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.some(d => !d)) {
      setErrors({ otp: 'Please enter complete OTP code' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/verify-email', {
        email: basicInfo.email,
        code: otp.join(''),
      });
      setStep(3);
    } catch (e: any) {
      if (e.response && e.response.data) {
        if (e.response.data.errors) setErrors(e.response.data.errors);
        else setErrors({ otp: e.response.data.message || 'OTP is incorrect' });
      } else {
        setErrors({ otp: 'Network or server error.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Address
  const handleSaveAddress = async () => {
    if (!validateAddress()) return;
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/save-address', {
        email: basicInfo.email,
        address: [address],
      });
      setStep(4);
    } catch (e: any) {
      if (e.response && e.response.data) {
        if (e.response.data.errors) setErrors(e.response.data.errors);
        else setErrors({ general: e.response.data.message || 'Failed to save address' });
      } else {
        setErrors({ general: 'Network or server error.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (v: string, idx: number) => {
    if (!/^[0-9]?$/.test(v)) return;
    const newOtp = [...otp];
    newOtp[idx] = v;
    setOtp(newOtp);
    if (v && idx < 5) otpInputs.current[idx + 1]?.focus();
    if (!v && idx > 0) otpInputs.current[idx - 1]?.focus();
  };

  // UI rendering
  return (
    <KeyboardAvoidingView style={registerStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={registerStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <View style={registerStyles.formContainer}>
              <Text style={registerStyles.title}>Create Account</Text>
              <Text style={registerStyles.subtitle}>SIGN UP TO GET STARTED</Text>
              {/* Full Name */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="account" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#222"
                  value={basicInfo.fullName}
                  onChangeText={v => setBasicInfo({ ...basicInfo, fullName: v })}
                  style={registerStyles.input}
                  error={!!errors.fullName}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  autoCapitalize="words"
                  selectionColor="#222"
                  editable={!emailInVerification}
                />
              </View>
              {errors.fullName && <Text style={registerStyles.errorText}>{errors.fullName}</Text>}
              {/* Email */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="email" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#222"
                  value={basicInfo.email}
                  onChangeText={v => {
                    setBasicInfo({ ...basicInfo, email: v });
                    setEmailInVerification(false);
                    setErrors({ ...errors, email: undefined });
                  }}
                  style={registerStyles.input}
                  error={!!errors.email}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#222"
                  editable={!emailInVerification}
                />
              </View>
              {errors.email && <Text style={registerStyles.errorText}>{errors.email}</Text>}
              {emailInVerification && (
                <>
                  <Text style={registerStyles.errorMessage}>Email is already in verification process</Text>
                  <Button mode="contained" onPress={handleResendOtp} loading={loading} style={registerStyles.button} labelStyle={registerStyles.buttonText} disabled={loading}>Resend OTP</Button>
                </>
              )}
              {/* Username */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="account" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#222"
                  value={basicInfo.username}
                  onChangeText={v => setBasicInfo({ ...basicInfo, username: v })}
                  style={registerStyles.input}
                  error={!!errors.username}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  autoCapitalize="none"
                  selectionColor="#222"
                />
              </View>
              {errors.username && <Text style={registerStyles.errorText}>{errors.username}</Text>}
              {/* Password */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="lock" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#222"
                  value={basicInfo.password}
                  onChangeText={v => setBasicInfo({ ...basicInfo, password: v })}
                  style={registerStyles.input}
                  error={!!errors.password}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  secureTextEntry={!showPassword}
                  right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} size={26} color="#222" onPress={() => setShowPassword(!showPassword)} />} 
                  autoCapitalize="none"
                  selectionColor="#222"
                />
              </View>
              {errors.password && <Text style={registerStyles.errorText}>{errors.password}</Text>}
              {/* Confirm Password */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="lock" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#222"
                  value={basicInfo.confirmPassword}
                  onChangeText={v => setBasicInfo({ ...basicInfo, confirmPassword: v })}
                  style={registerStyles.input}
                  error={!!errors.confirmPassword}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  secureTextEntry={!showConfirmPassword}
                  right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} size={26} color="#222" onPress={() => setShowConfirmPassword(!showConfirmPassword)} />} 
                  autoCapitalize="none"
                  selectionColor="#222"
                />
              </View>
              {errors.confirmPassword && <Text style={registerStyles.errorText}>{errors.confirmPassword}</Text>}
              {/* Phone */}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="phone" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor="#222"
                  value={basicInfo.phone}
                  onChangeText={v => setBasicInfo({ ...basicInfo, phone: v })}
                  style={registerStyles.input}
                  error={!!errors.phone}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  keyboardType="phone-pad"
                  selectionColor="#222"
                />
              </View>
              {errors.phone && <Text style={registerStyles.errorText}>{errors.phone}</Text>}
              {errors.general && <Text style={registerStyles.errorMessage}>{errors.general}</Text>}
              <Button
                mode="contained"
                onPress={handleSendOtp}
                loading={loading}
                style={registerStyles.button}
                labelStyle={registerStyles.buttonText}
                disabled={loading}
              >
                Continue
              </Button>
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Text>
                  Already have an account?{' '}
                  <Text style={registerStyles.link} onPress={() => navigation.replace('Login')}>Sign In</Text>
                </Text>
              </View>
            </View>
          )}
          {/* Step 2: OTP */}
          {step === 2 && (
            <View style={registerStyles.formContainer}>
              <Text style={registerStyles.title}>Verify OTP</Text>
              <Text style={registerStyles.subtitle}>Enter the 6-digit code sent to your email address</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
                {otp.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={(el: any) => (otpInputs.current[i] = el)}
                    value={d}
                    onChangeText={v => handleOtpChange(v, i)}
                    style={{
                      width: 44,
                      height: 56,
                      marginHorizontal: 4,
                      fontSize: 24,
                      textAlign: 'center',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#D1D5DB',
                      backgroundColor: '#fff',
                    }}
                    maxLength={1}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    mode="flat"
                    underlineColor="transparent"
                    theme={{ roundness: 12 }}
                    selectionColor="#222"
                    autoFocus={i === 0}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !otp[i] && i > 0) otpInputs.current[i - 1]?.focus();
                    }}
                    editable={timer > 0}
                  />
                ))}
              </View>
              <Text style={{ textAlign: 'center', color: '#666', marginBottom: 8 }}>
                {timer > 0 ? `Time left: ${timer}s` : 'OTP expired. Please resend OTP.'}
              </Text>
              {errors.otp && <Text style={registerStyles.errorText}>{errors.otp}</Text>}
              {errors.general && <Text style={registerStyles.errorMessage}>{errors.general}</Text>}
              <Button
                mode="contained"
                onPress={handleVerifyOtp}
                loading={loading}
                style={registerStyles.button}
                labelStyle={registerStyles.buttonText}
                disabled={loading || timer === 0}
              >
                Verify OTP
              </Button>
              {(canResend || timer === 0) && (
                <Button mode="text" onPress={handleResendOtp} style={{ marginTop: 8 }} disabled={loading}>Resend OTP</Button>
              )}
              <Button mode="text" onPress={() => setStep(1)} style={{ marginTop: 8 }}>Change Email</Button>
            </View>
          )}
          {/* Step 3: Address */}
          {step === 3 && (
            <View style={registerStyles.formContainer}>
              <Text style={registerStyles.title}>Shipping Address</Text>
              <Text style={registerStyles.subtitle}>Enter your shipping address</Text>
              <View style={registerStyles.inputContainer}>
                <IconButton icon="account" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Recipient Name"
                  placeholderTextColor="#222"
                  value={address.recipientName}
                  onChangeText={v => setAddress({ ...address, recipientName: v })}
                  style={registerStyles.input}
                  error={!!errors.recipientName}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  selectionColor="#222"
                />
              </View>
              {errors.recipientName && <Text style={registerStyles.errorText}>{errors.recipientName}</Text>}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="home" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Street"
                  placeholderTextColor="#222"
                  value={address.street}
                  onChangeText={v => setAddress({ ...address, street: v })}
                  style={registerStyles.input}
                  error={!!errors.street}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  selectionColor="#222"
                />
              </View>
              {errors.street && <Text style={registerStyles.errorText}>{errors.street}</Text>}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="city" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="City"
                  placeholderTextColor="#222"
                  value={address.city}
                  onChangeText={v => setAddress({ ...address, city: v })}
                  style={registerStyles.input}
                  error={!!errors.city}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  selectionColor="#222"
                />
              </View>
              {errors.city && <Text style={registerStyles.errorText}>{errors.city}</Text>}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="map-marker" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="State"
                  placeholderTextColor="#222"
                  value={address.state}
                  onChangeText={v => setAddress({ ...address, state: v })}
                  style={registerStyles.input}
                  error={!!errors.state}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  selectionColor="#222"
                />
              </View>
              {errors.state && <Text style={registerStyles.errorText}>{errors.state}</Text>}
              <View style={registerStyles.inputContainer}>
                <IconButton icon="earth" size={26} style={registerStyles.inputIcon} disabled iconColor="#222" />
                <TextInput
                  placeholder="Country"
                  placeholderTextColor="#222"
                  value={address.country}
                  onChangeText={v => setAddress({ ...address, country: v })}
                  style={registerStyles.input}
                  error={!!errors.country}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ roundness: 16 }}
                  dense
                  selectionColor="#222"
                />
              </View>
              {errors.country && <Text style={registerStyles.errorText}>{errors.country}</Text>}
              <View style={registerStyles.inputContainer}>
                <Checkbox status={address.isDefault ? 'checked' : 'unchecked'} onPress={() => setAddress({ ...address, isDefault: !address.isDefault })} color="#1A1A1A" />
                <Text style={[registerStyles.checkboxLabel, { fontWeight: 'bold', color: '#222' }]}>Set as default address</Text>
              </View>
              {errors.general && <Text style={registerStyles.errorMessage}>{errors.general}</Text>}
              <Button
                mode="contained"
                onPress={handleSaveAddress}
                loading={loading}
                style={registerStyles.button}
                labelStyle={registerStyles.buttonText}
                disabled={loading}
              >
                Complete Registration
              </Button>
            </View>
          )}
          {/* Step 4: Success */}
          {step === 4 && (
            <View style={registerStyles.formContainer}>
              <Text style={registerStyles.title}>Registration Complete</Text>
              <Text style={{ textAlign: 'center', marginVertical: 16 }}>Your account has been created successfully!</Text>
              <Button mode="contained" onPress={() => navigation.replace('Login')} style={registerStyles.button} labelStyle={registerStyles.buttonText}>Sign In</Button>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
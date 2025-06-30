import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

export default function VerifyOTPScreen() {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Start timer when component mounts
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (otp.some(digit => !digit)) {
      setError('Please enter complete OTP code');
      return;
    }

    setLoading(true);
    try {
      const resetEmail = await AsyncStorage.getItem('resetEmail');
      const pendingRegistration = await AsyncStorage.getItem('pendingRegistration');
      console.log('Verifying OTP...');
      
      const response = await fetch('EXPO_PUBLIC_API_URL/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          otp: otp.join(''),
          email: resetEmail,
        }),
      });

      const data = await response.json();
      console.log('Verify OTP response:', data);

      if (!response.ok) {
        console.error('Verify OTP failed:', data);
        setError(data.message || 'Verification failed');
        return;
      }

      // If verification successful, check if this is for registration or password reset
      if (pendingRegistration) {
        // This is for registration flow - navigate to AuthSuccess
        navigation.navigate('AuthSuccess', { token: data.data.token });
      } else {
        // This is for password reset flow - navigate to ResetPassword
        navigation.navigate('ResetPassword', { token: data.data.token });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const resetEmail = await AsyncStorage.getItem('resetEmail');
      
      const response = await fetch('EXPO_PUBLIC_API_URL/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to resend OTP');
        return;
      }

      // Reset timer and OTP
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.description}>
                Enter the 6-digit code sent to your email address
              </Text>
            </View>

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={value => handleChange(index, value)}
                  onKeyPress={e => handleKeyPress(index, e)}
                  maxLength={1}
                  keyboardType="number-pad"
                  textAlign="center"
                  placeholderTextColor="#666"
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View style={styles.timerContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend in {formatTime(timer)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={loading || !canResend}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Icon name="arrow-left" size={16} color="black" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: 'black',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: 'black',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 0,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: 'gray',
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 0,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: 'black',
    borderRadius: 0,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
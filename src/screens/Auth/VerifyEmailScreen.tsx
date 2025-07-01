import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export default function VerifyEmailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getStoredEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('pendingEmail');
        if (!storedEmail) {
          navigation.navigate('Register' as never);
          return;
        }
        setRegisteredEmail(storedEmail);
      } catch (error) {
        console.error('Error getting stored email:', error);
        navigation.navigate('Register' as never);
      }
    };

    getStoredEmail();
  }, [navigation]);

  useEffect(() => {
    const verifyEmailWithToken = async () => {
      try {
        setLoading(true);
        const token = route.params?.token;
        if (!token) {
          setError('Invalid verification token');
          return;
        }

        const response = await fetch(`EXPO_PUBLIC_API_URL/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data: VerifyEmailResponse = await response.json();

        if (data.success) {
          navigation.navigate('Login' as never);
        } else {
          setError(data.message || 'Email verification failed');
        }
      } catch (error) {
        setError('Email verification failed');
      } finally {
        setLoading(false);
      }
    };

    if (route.params?.token) {
      verifyEmailWithToken();
    }
  }, [route.params?.token, navigation]);

  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('EXPO_PUBLIC_API_URL/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: registeredEmail, code: verificationCode }),
      });

      const data: VerifyEmailResponse = await response.json();

      if (data.success) {
        await AsyncStorage.removeItem('pendingEmail');
        Alert.alert('Success', 'Email verified successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]);
      } else {
        setError(data.message || 'Email verification failed');
      }
    } catch (error) {
      setError('Server error. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegistration = async () => {
    try {
      await AsyncStorage.removeItem('pendingEmail');
      navigation.navigate('Register' as never);
    } catch (error) {
      console.error('Error removing stored email:', error);
      navigation.navigate('Register' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Icon name="verified-user" size={64} color="black" style={styles.icon} />
              <Text style={styles.title}>Verify Email</Text>
              <Text style={styles.description}>Enter the verification code sent to your email</Text>
              <Text style={styles.email}>{registeredEmail}</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Enter verification code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                maxLength={6}
                keyboardType="number-pad"
                textAlign="center"
                placeholderTextColor="#666"
              />

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.verifyButton, loading && styles.disabledButton]}
                onPress={handleVerificationSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToRegistration}
              >
                <Text style={styles.backButtonText}>Back to Registration</Text>
              </TouchableOpacity>
            </View>
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
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: 'black',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 0,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: 'black',
    borderRadius: 0,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  backButton: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 0,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
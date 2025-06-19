import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import * as Notifications from 'expo-notifications';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { setNotificationPermission } from '../../store/slices/onboardingSlice';

type NotificationPermissionScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'NotificationPermission'>;
};

const NotificationPermissionScreen = ({ navigation }: NotificationPermissionScreenProps) => {
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        dispatch(setNotificationPermission(true));
        navigation.replace('LocationPermission');
      }
    };
    checkPermission();
  }, []);

  const requestNotificationPermission = async () => {
    try {
      setIsRequesting(true);
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      dispatch(setNotificationPermission(granted));
      
      // Navigate to next screen regardless of permission status
      navigation.replace('LocationPermission');
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="notifications" size={64} color="#1A1A1A" style={styles.icon} />
        <Text style={styles.title}>Allow notification access</Text>
        <Text style={styles.description}>
          Receive notifications about special offers, order updates, and important information
        </Text>

        <TouchableOpacity
          style={[styles.button, isRequesting && styles.buttonDisabled]}
          onPress={requestNotificationPermission}
          disabled={isRequesting}
        >
          <Text style={styles.buttonText}>
            {isRequesting ? 'Processing...' : 'Allow notification'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            dispatch(setNotificationPermission(false));
            navigation.replace('LocationPermission');
          }}
        >
          <Text style={styles.skipButtonText}>Tap to skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default NotificationPermissionScreen; 
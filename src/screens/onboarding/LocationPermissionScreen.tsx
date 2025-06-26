import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { setLocationPermission, setUserLocation } from '../../store/slices/onboardingSlice';

type LocationPermissionScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'LocationPermission'>;
};

const LocationPermissionScreen = ({ navigation }: LocationPermissionScreenProps) => {
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        dispatch(setLocationPermission(true));
        navigation.replace('Preference');
      }
    };
    checkPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setIsRequesting(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      dispatch(setLocationPermission(granted));

      if (granted) {
        const location = await Location.getCurrentPositionAsync({});
        dispatch(setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      }

      // Navigate to next screen regardless of permission status
      navigation.replace('Preference');
    } catch (error) {
      console.error('Error requesting location permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="location-on" size={64} color="#1A1A1A" style={styles.icon} />
        <Text style={styles.title}>Allow location access</Text>
        <Text style={styles.description}>
          Help us find the nearest store and provide a better shopping experience
        </Text>

        <TouchableOpacity
          style={[styles.button, isRequesting && styles.buttonDisabled]}
          onPress={requestLocationPermission}
          disabled={isRequesting}
        >
          <Text style={styles.buttonText}>
            {isRequesting ? 'Processing...' : 'Allow location access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            dispatch(setLocationPermission(false));
            navigation.replace('Preference');
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

export default LocationPermissionScreen; 
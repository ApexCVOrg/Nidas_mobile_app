import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useDispatch } from 'react-redux';
import { setUserPreference } from '../../store/slices/onboardingSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

type PreferenceScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Preference'>;
};

type Preference = 'men' | 'women' | 'children';

const PreferenceScreen = ({ navigation }: PreferenceScreenProps) => {
  const [selectedPreference, setSelectedPreference] = useState<Preference | null>(null);
  const dispatch = useDispatch();

  const handlePreferenceSelect = (preference: Preference) => {
    setSelectedPreference(preference);
    dispatch(setUserPreference(preference));
    navigation.replace('OnboardingComplete');
  };

  const PreferenceButton = ({ type, label }: { type: Preference; label: string }) => (
    <TouchableOpacity
      style={[
        styles.preferenceButton,
        selectedPreference === type && styles.preferenceButtonSelected,
      ]}
      onPress={() => handlePreferenceSelect(type)}
    >
      <Icon
        name={
          type === 'men'
            ? 'person'
            : type === 'women'
            ? 'person-2'
            : 'child-care'
        }
        size={24}
        color={selectedPreference === type ? '#fff' : '#1A1A1A'}
        style={styles.preferenceIcon}
      />
      <Text
        style={[
          styles.preferenceText,
          selectedPreference === type && styles.preferenceTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Please select your preference</Text>
        
        <View style={styles.preferenceContainer}>
          <PreferenceButton type="men" label="Men's clothing" />
          <PreferenceButton type="women" label="Women's clothing" />
          <PreferenceButton type="children" label="Children's clothing" />
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.replace('OnboardingComplete')}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 32,
  },
  preferenceContainer: {
    width: '100%',
    gap: 16,
  },
  preferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  preferenceButtonSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  preferenceTextSelected: {
    color: '#fff',
  },
  skipButton: {
    marginTop: 32,
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PreferenceScreen; 
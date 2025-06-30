import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#757575', elevation: 4 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 }}>Settings</Text>
        <Icon name="settings" size={24} color="#fff" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Notifications Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Icon name="notifications" size={24} color="#757575" style={{ marginRight: 16 }} />
          <Text style={{ flex: 1, fontSize: 16 }}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? '#1976D2' : '#ccc'}
            trackColor={{ true: '#BBDEFB', false: '#eee' }}
          />
        </View>
        {/* Dark Mode Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Icon name="dark-mode" size={24} color="#757575" style={{ marginRight: 16 }} />
          <Text style={{ flex: 1, fontSize: 16 }}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#1976D2' : '#ccc'}
            trackColor={{ true: '#BBDEFB', false: '#eee' }}
          />
        </View>
        {/* Language Option */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Icon name="language" size={24} color="#757575" style={{ marginRight: 16 }} />
          <Text style={{ flex: 1, fontSize: 16 }}>Language</Text>
          <Text style={{ color: '#1976D2', fontWeight: '600' }}>English</Text>
        </View>
        {/* More settings can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen; 
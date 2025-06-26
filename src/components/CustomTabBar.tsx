import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const tabs = [
  { name: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'Search', icon: 'search-outline', iconActive: 'search' },
  { name: 'Favorites', icon: 'heart-outline', iconActive: 'heart' },
  { name: 'Cart', icon: 'cart-outline', iconActive: 'cart' },
];

const CustomTabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => {
        const isActive = route.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => (navigation as any).navigate('MainTabs', { screen: tab.name })}
          >
            <Ionicons
              name={isActive ? (tab.iconActive as any) : (tab.icon as any)}
              size={28}
              color={isActive ? '#000' : '#888'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default CustomTabBar; 
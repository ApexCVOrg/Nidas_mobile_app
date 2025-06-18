import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryListScreen from '../screens/NavigatorScreens/CategoryListScreen';
import CategoryScreen from '../screens/CategoryScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/NavigatorScreens/SearchScreen';
import FavoritesScreen from '../screens/NavigatorScreens/FavoritesScreen';
import CartScreen from '../screens/NavigatorScreens/CartScreen';
import CustomTabBar from '../components/CustomTabBar';
import BannerDetailScreen from '../screens/BannerDetailScreen';

export type TabNavigatorParamList = {
  MainTabs: undefined;
  CategoryList: undefined;
  Category: { categoryId: string; title: string };
  BannerDetail: { item: any };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<TabNavigatorParamList>();

const MainTabs = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Ẩn tabBar mặc định
        headerShown: false,
      }}
      tabBar={() => null}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
    <CustomTabBar />
  </View>
);

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CategoryList" component={CategoryListScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="BannerDetail" component={BannerDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default TabNavigator; 
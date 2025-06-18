import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CategoryListScreen from '../screens/NavigatorScreens/CategoryListScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/NavigatorScreens/SearchScreen/SearchScreen';
import ProductScreen from '../screens/NavigatorScreens/SearchScreen/ProductScreen';
import IntroductionScreen from '../screens/NavigatorScreens/SearchScreen/IntroductionScreen';
import SearchResultsScreen from '../screens/NavigatorScreens/SearchScreen/SearchResultsScreen';
import ProductDetailScreen from '../screens/NavigatorScreens/SearchScreen/ProductDetailScreen';
import CollectionScreen from '../screens/NavigatorScreens/SearchScreen/CollectionScreen';
import FavoritesScreen from '../screens/NavigatorScreens/FavoritesScreen';
import CartScreen from '../screens/NavigatorScreens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen 
      name="SearchMain" 
      component={SearchScreen} 
      options={{ headerShown: false }}
    />
    <SearchStack.Screen 
      name="Product" 
      component={ProductScreen} 
      options={{ title: 'PRODUCT' }}
    />
    <SearchStack.Screen 
      name="Introduction" 
      component={IntroductionScreen} 
      options={{ title: 'INTRODUCTION' }}
    />
    <SearchStack.Screen 
      name="SearchResults" 
      component={SearchResultsScreen} 
      options={{ headerShown: false }}
    />
    <SearchStack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen} 
      options={{ headerShown: false }}
    />
    <SearchStack.Screen 
      name="Collection" 
      component={CollectionScreen} 
      options={{ headerShown: false }}
    />
  </SearchStack.Navigator>
);

const CartIcon = ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const iconName = focused ? 'cart' : 'cart-outline';
  
  return (
    <View style={styles.cartIconContainer}>
      <Ionicons name={iconName} size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === 'Cart') {
          return <CartIcon focused={focused} color={color} size={size} />;
        }
        
        let iconName: "home" | "home-outline" | "search" | "search-outline" | "heart" | "heart-outline" = 'home';
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'heart' : 'heart-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000000',
      tabBarInactiveTintColor: '#666666',
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerShadowVisible: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Search" component={SearchStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'FAVORITES' }} />
    <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'CART' }} />
  </Tab.Navigator>
);

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CategoryList" component={CategoryListScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
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
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator; 
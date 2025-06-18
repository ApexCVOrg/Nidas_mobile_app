import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/NavigatorScreens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import UserScreen from '../screens/User/UserScreen';
import CategoryScreen from '../screens/CategoryScreen';

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  User: undefined;
  Category: { categoryId: string; title: string };
};

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<ProductStackParamList>();

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProductList" component={ProductListScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="User" component={UserScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
};

export default MainNavigator; 
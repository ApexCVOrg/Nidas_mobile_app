import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import CategoryListScreen from '../screens/NavigatorScreens/CategoryListScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/NavigatorScreens/SearchScreen/SearchScreen';
import ProductScreen from '../screens/NavigatorScreens/SearchScreen/ProductScreen';
import IntroductionScreen from '../screens/NavigatorScreens/SearchScreen/IntroductionScreen';
import SearchResultsScreen from '../screens/NavigatorScreens/SearchScreen/SearchResultsScreen';
import ProductDetailScreen from '../screens/NavigatorScreens/SearchScreen/ProductDetailScreen';
import CollectionScreen from '../screens/NavigatorScreens/SearchScreen/CollectionScreen';
import FavoritesScreen from '../screens/NavigatorScreens/FavoritesScreen';
import CartScreen from '../screens/NavigatorScreens/CartScreen';
import BannerDetailScreen from '../screens/BannerDetailScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProductDetail from '../screens/Product/ProductDetail';
import UserProfile from '../screens/Auth/UserProfile';
import BannerDetailManchester from '../screens/BannerDetailManchester';
import BannerDetailClimacool from '../screens/BannerDetailClimacool';
import ChatScreen from '../screens/Auth/ChatScreen';
import SettingsScreen from '../screens/Auth/SettingsScreen';

export type TabNavigatorParamList = {
  MainTabs: undefined;
  CategoryList: undefined;
  Category: { categoryId: string; title: string };
  BannerDetail: { item: any };
  Checkout: undefined;
  Login: undefined;
  Register: undefined;
  ProductDetail: { productId: string };
  Collection: { collectionId: number; title: string; subtitle: string };
  BannerDetailClimacool: { item: any };
  BannerDetailManchester: { item: any };
  UserProfile: undefined;
  Chat: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<TabNavigatorParamList>();
const SearchStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

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

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Category" component={CategoryScreen} options={{ title: 'Danh mục' }} />
    </HomeStack.Navigator>
  );
}

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: "home" | "home-outline" | "search" | "search-outline" | "heart" | "heart-outline" | "cart" | "cart-outline" = 'home';
        if (route.name === 'Cart') {
          return <CartIcon focused={focused} color={color} size={size} />;
        }
        
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
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
    <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Search" component={SearchStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'FAVORITES' }} />
    <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'CART' }} />
  </Tab.Navigator>
);

const TabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="BannerDetail" component={BannerDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="BannerDetailManchester" component={BannerDetailManchester} options={{ headerShown: false }} />
      <Stack.Screen name="BannerDetailClimacool" component={BannerDetailClimacool} options={{ headerShown: false }} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
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
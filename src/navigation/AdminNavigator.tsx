import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Admin Screens
import AdminDashboard from '../screens/Admin/AdminDashboard';
import ProductManagement from '../screens/Admin/ProductManagement';
import OrderManagement from '../screens/Admin/OrderManagement';
import UserManagement from '../screens/Admin/UserManagement';
import Analytics from '../screens/Admin/Analytics';
import SalesAnalytics from '../screens/Admin/SalesAnalytics';
import CustomerAnalytics from '../screens/Admin/CustomerAnalytics';

// Manager Screens
import ManagerDashboard from '../screens/Manager/ManagerDashboard';
import InventoryManagement from '../screens/Manager/InventoryManagement';
import OrderProcessing from '../screens/Manager/OrderProcessing';
import CustomerSupport from '../screens/Manager/CustomerSupport';
import StaffManagement from '../screens/Manager/StaffManagement';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ProductManagement: undefined;
  OrderManagement: undefined;
  UserManagement: undefined;
  Analytics: undefined;
  SalesAnalytics: undefined;
  CustomerAnalytics: undefined;
  ManagerDashboard: undefined;
  InventoryManagement: undefined;
  OrderProcessing: undefined;
  CustomerSupport: undefined;
  StaffManagement: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'dashboard';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'Products') {
            iconName = focused ? 'inventory' : 'inventory';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Products" component={ProductManagement} />
      <Tab.Screen name="Orders" component={OrderManagement} />
      <Tab.Screen name="Users" component={UserManagement} />
      <Tab.Screen name="Analytics" component={Analytics} />
    </Tab.Navigator>
  );
};

// Manager Tab Navigator
const ManagerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'dashboard';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'Inventory') {
            iconName = focused ? 'inventory-2' : 'inventory-2';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt';
          } else if (route.name === 'Support') {
            iconName = focused ? 'support-agent' : 'support-agent';
          } else if (route.name === 'Staff') {
            iconName = focused ? 'people-alt' : 'people-alt';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={ManagerDashboard} />
      <Tab.Screen name="Inventory" component={InventoryManagement} />
      <Tab.Screen name="Orders" component={OrderProcessing} />
      <Tab.Screen name="Support" component={CustomerSupport} />
      <Tab.Screen name="Staff" component={StaffManagement} />
    </Tab.Navigator>
  );
};

// Admin Stack Navigator
const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminTabNavigator} />
      <Stack.Screen name="ProductManagement" component={ProductManagement} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      <Stack.Screen name="Analytics" component={Analytics} />
      <Stack.Screen name="SalesAnalytics" component={SalesAnalytics} />
      <Stack.Screen name="CustomerAnalytics" component={CustomerAnalytics} />
      <Stack.Screen name="ManagerDashboard" component={ManagerTabNavigator} />
      <Stack.Screen name="InventoryManagement" component={InventoryManagement} />
      <Stack.Screen name="OrderProcessing" component={OrderProcessing} />
      <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
      <Stack.Screen name="StaffManagement" component={StaffManagement} />
    </Stack.Navigator>
  );
};

export default AdminNavigator; 
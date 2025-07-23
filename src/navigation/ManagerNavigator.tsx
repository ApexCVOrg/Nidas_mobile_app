import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Manager Screens
import ManagerDashboard from '../screens/Manager/ManagerDashboard';
import InventoryManagement from '../screens/Manager/InventoryManagement';
import OrderProcessing from '../screens/Manager/OrderProcessing';
import CustomerSupport from '../screens/Manager/CustomerSupport';
import StaffManagement from '../screens/Manager/StaffManagement';
import ManagerChatScreen from '../screens/Manager/ManagerChatScreen';

export type ManagerStackParamList = {
  ManagerDashboard: undefined;
  InventoryManagement: undefined;
  OrderProcessing: undefined;
  CustomerSupport: undefined;
  StaffManagement: undefined;
  ManagerChat: undefined;
};

const Stack = createNativeStackNavigator<ManagerStackParamList>();
const Tab = createBottomTabNavigator();

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
      <Tab.Screen name="Support" component={ManagerChatScreen} />
      <Tab.Screen name="Staff" component={StaffManagement} />
    </Tab.Navigator>
  );
};

// Manager Stack Navigator
const ManagerNavigator = () => {
  console.log('👔 ManagerNavigator rendering');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManagerDashboard" component={ManagerTabNavigator} />
      <Stack.Screen name="InventoryManagement" component={InventoryManagement} />
      <Stack.Screen name="OrderProcessing" component={OrderProcessing} />
      <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
      <Stack.Screen name="StaffManagement" component={StaffManagement} />
      <Stack.Screen name="ManagerChat" component={ManagerChatScreen} />
    </Stack.Navigator>
  );
};

export default ManagerNavigator; 
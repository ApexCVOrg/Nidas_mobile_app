import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { FavoritesProvider } from '../hooks/FavoritesContext';

// Import các màn hình
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentCallbackScreen from '../screens/PaymentCallbackScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Provider store={store}>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Checkout"
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="PaymentCallback" component={PaymentCallbackScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </Provider>
  );
};

export default AppNavigator;
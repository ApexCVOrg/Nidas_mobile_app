import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <TabNavigator />
    </Provider>
  );
}

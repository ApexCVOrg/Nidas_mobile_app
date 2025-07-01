import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import TabNavigator from './src/navigation/TabNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { FavoritesProvider } from './src/hooks/FavoritesContext';

// Selector để lấy trạng thái onboarding
import { RootState } from './src/redux/store';

function MainApp() {
  // Nếu chưa có Provider, useSelector sẽ lỗi, nhưng sau khi bọc Provider thì sẽ chạy được
  // Nếu chưa hoàn thành onboarding thì vào OnboardingNavigator, ngược lại vào TabNavigator
  const hasOnboarded = useSelector((state: RootState) => state.onboarding.hasOnboarded);
  const authState = useSelector((state: RootState) => state.auth);
  
  console.log('🔄 MainApp re-render - hasOnboarded:', hasOnboarded);
  console.log('🔐 Auth state:', authState);
  console.log('📱 Rendering:', hasOnboarded ? 'TabNavigator' : 'OnboardingNavigator');
  
  return hasOnboarded ? <TabNavigator /> : <OnboardingNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <FavoritesProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </FavoritesProvider>
    </Provider>
  );
}

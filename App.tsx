import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import TabNavigator from './src/navigation/TabNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { FavoritesProvider } from './src/hooks/FavoritesContext';

// Selector để lấy trạng thái onboarding
import { RootState } from './src/redux/store';
import { getUsers, createUser, updateUser, deleteUser } from './src/api/mockApi';
import { initOfflineData, getOfflineData, addOfflineProduct, updateOfflineProduct, deleteOfflineProduct } from './src/utils/initOfflineData';

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
  useEffect(() => {
    // Khởi tạo dữ liệu offline
    initOfflineData();

    // CRUD với mock API (json-server)
    getUsers()
      .then(res => console.log('Users:', res.data))
      .catch(err => console.error('API error:', err.message));

    createUser({ name: 'New Manager', role: 'manager' })
      .then(res => console.log('Created:', res.data))
      .catch(err => console.error('API error:', err.message));

    updateUser('1', { name: 'Admin Updated', role: 'admin' })
      .then(res => console.log('Updated:', res.data))
      .catch(err => console.error('API error:', err.message));

    deleteUser('2')
      .then(res => console.log('Deleted:', res.data))
      .catch(err => console.error('API error:', err.message));

    // CRUD offline với AsyncStorage
    getOfflineData().then(data => console.log('Offline products:', data));
    addOfflineProduct({ id: 3, name: 'Áo khoác', price: 300000 });
    updateOfflineProduct(1, { id: 1, name: 'Áo thun updated', price: 210000 });
    deleteOfflineProduct(2);
  }, []);

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

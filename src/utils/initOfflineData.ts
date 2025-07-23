import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../data.json';

const STORAGE_KEY = 'PRODUCTS';

export const initOfflineData = async () => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Initialized offline data');
    } else {
      console.log('Offline data already exists');
    }
  } catch (e) {
    console.error('Error initializing offline data', e);
  }
};

export const getOfflineData = async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const addOfflineProduct = async (product: any) => {
  const products = await getOfflineData();
  products.push(product);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const updateOfflineProduct = async (id: number, newProduct: any) => {
  let products = await getOfflineData();
  products = products.map((p: any) => (p.id === id ? newProduct : p));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const deleteOfflineProduct = async (id: number) => {
  let products = await getOfflineData();
  products = products.filter((p: any) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}; 
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

const FAVORITES_FILE = FileSystem.documentDirectory + 'favorites.json';

interface FavoritesContextType {
  favorites: string[];
  reloadFavorites: () => Promise<void>;
  addFavorite: (product: any) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const reloadFavorites = useCallback(async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
        setFavorites(JSON.parse(content).map((item: any) => item.id));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const addFavorite = useCallback(async (product: any) => {
    let favoritesArr: any[] = [];
    const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
      favoritesArr = JSON.parse(content);
    }
    if (!favoritesArr.find((item) => item.id === product.id)) {
      favoritesArr.push(product);
      await FileSystem.writeAsStringAsync(FAVORITES_FILE, JSON.stringify(favoritesArr));
      setFavorites(favoritesArr.map((item) => item.id));
    }
  }, []);

  const removeFavorite = useCallback(async (productId: string) => {
    let favoritesArr: any[] = [];
    const fileInfo = await FileSystem.getInfoAsync(FAVORITES_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(FAVORITES_FILE);
      favoritesArr = JSON.parse(content);
    }
    favoritesArr = favoritesArr.filter((item) => item.id !== productId);
    await FileSystem.writeAsStringAsync(FAVORITES_FILE, JSON.stringify(favoritesArr));
    setFavorites(favoritesArr.map((item) => item.id));
  }, []);

  useEffect(() => {
    reloadFavorites();
  }, [reloadFavorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, reloadFavorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  return context;
} 
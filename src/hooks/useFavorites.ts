import { useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

const FAVORITES_FILE = FileSystem.documentDirectory + 'favorites.json';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = useCallback(async () => {
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

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return { favorites, reloadFavorites: loadFavorites };
} 
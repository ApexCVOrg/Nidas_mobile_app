import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Storage keys
export const OFFLINE_KEYS = {
  PENDING_ORDERS: 'offline_pending_orders',
  PENDING_PRODUCTS: 'offline_pending_products',
  PENDING_USERS: 'offline_pending_users',
  PENDING_ANALYTICS: 'offline_pending_analytics',
  PENDING_CHATS: 'offline_pending_chats',
  PENDING_MESSAGES: 'offline_pending_messages',
  LAST_SYNC: 'last_sync_timestamp',
  OFFLINE_DATA: 'offline_data_cache',
} as const;

// Types
export interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'order' | 'product' | 'user' | 'analytics' | 'chat' | 'message';
  data: any;
  timestamp: number;
  retryCount: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: number | null;
  pendingActions: number;
  isSyncing: boolean;
}

// Network status - simple fetch-based check
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    // Try to fetch a small resource to check connectivity
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.log('Network check failed:', error);
    return false;
  }
};

// Offline storage operations
export const storeOfflineAction = async (action: OfflineAction): Promise<void> => {
  try {
    const key = OFFLINE_KEYS[`PENDING_${action.entity.toUpperCase()}S` as keyof typeof OFFLINE_KEYS];
    const existingActions = await getOfflineActions(action.entity);
    existingActions.push(action);
    await AsyncStorage.setItem(key, JSON.stringify(existingActions));
  } catch (error) {
    console.error('Error storing offline action:', error);
  }
};

export const getOfflineActions = async (entity: string): Promise<OfflineAction[]> => {
  try {
    const key = OFFLINE_KEYS[`PENDING_${entity.toUpperCase()}S` as keyof typeof OFFLINE_KEYS];
    const actions = await AsyncStorage.getItem(key);
    return actions ? JSON.parse(actions) : [];
  } catch (error) {
    console.error('Error getting offline actions:', error);
    return [];
  }
};

export const removeOfflineAction = async (entity: string, actionId: string): Promise<void> => {
  try {
    const key = OFFLINE_KEYS[`PENDING_${entity.toUpperCase()}S` as keyof typeof OFFLINE_KEYS];
    const actions = await getOfflineActions(entity);
    const filteredActions = actions.filter(action => action.id !== actionId);
    await AsyncStorage.setItem(key, JSON.stringify(filteredActions));
  } catch (error) {
    console.error('Error removing offline action:', error);
  }
};

// Data caching
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const cacheAge = Date.now() - timestamp;
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    if (cacheAge > maxAge) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

// Sync operations
export const syncOfflineActions = async (apiFunctions: any, onSyncSuccess?: () => void): Promise<boolean> => {
  const isOnline = await checkNetworkStatus();
  if (!isOnline) return false;

  try {
    // Only sync entities that have available API methods
    const entities = ['order', 'product', 'user'];
    let successCount = 0;
    let totalActions = 0;

    for (const entity of entities) {
      const actions = await getOfflineActions(entity);
      totalActions += actions.length;

      for (const action of actions) {
        try {
          switch (action.type) {
            case 'CREATE':
              if (entity === 'order' && apiFunctions.createOrder) {
                await apiFunctions.createOrder(action.data);
              } else if (entity === 'product' && apiFunctions.addProduct) {
                await apiFunctions.addProduct(action.data);
              } else if (entity === 'user' && apiFunctions.createUser) {
                await apiFunctions.createUser(action.data);
              }
              break;
            case 'UPDATE':
              if (entity === 'order' && apiFunctions.updateOrderStatus) {
                await apiFunctions.updateOrderStatus(action.data.id, action.data.status);
              } else if (entity === 'product' && apiFunctions.updateProduct) {
                await apiFunctions.updateProduct(action.data.id, action.data);
              } else if (entity === 'user' && apiFunctions.updateUser) {
                await apiFunctions.updateUser(action.data.id, action.data);
              }
              break;
            case 'DELETE':
              if (entity === 'product' && apiFunctions.deleteProduct) {
                await apiFunctions.deleteProduct(action.data.id);
              } else if (entity === 'user' && apiFunctions.deleteUser) {
                await apiFunctions.deleteUser(action.data.id);
              }
              break;
          }
          
          await removeOfflineAction(entity, action.id);
          successCount++;
        } catch (error) {
          console.error(`Error syncing ${entity} action:`, error);
          action.retryCount = (action.retryCount || 0) + 1;
          
          // Remove action if retry count exceeds limit
          if (action.retryCount >= 3) {
            await removeOfflineAction(entity, action.id);
          }
        }
      }
    }

    if (successCount > 0) {
      await AsyncStorage.setItem(OFFLINE_KEYS.LAST_SYNC, Date.now().toString());
      console.log(`Synced ${successCount}/${totalActions} offline actions`);
      
      // Call callback to refresh data after successful sync
      if (onSyncSuccess) {
        onSyncSuccess();
      }
      
      // Show success message
      Alert.alert(
        'Đồng bộ thành công',
        `Đã đồng bộ ${successCount} thay đổi lên server. Dữ liệu đã được cập nhật.`
      );
    } else if (totalActions === 0) {
      // Show message when no actions to sync
      Alert.alert(
        'Không có thay đổi',
        'Không có thay đổi nào cần đồng bộ.'
      );
    }

    return successCount > 0;
  } catch (error) {
    console.error('Error during sync:', error);
    return false;
  }
};

// Generate unique ID for offline actions
export const generateOfflineId = (): string => {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get sync status
export const getSyncStatus = async (): Promise<SyncStatus> => {
  const isOnline = await checkNetworkStatus();
  const lastSync = await AsyncStorage.getItem(OFFLINE_KEYS.LAST_SYNC);
  
  let pendingActions = 0;
  const entities = ['order', 'product', 'user']; // Only count available entities
  
  for (const entity of entities) {
    const actions = await getOfflineActions(entity);
    pendingActions += actions.length;
  }

  return {
    isOnline,
    lastSync: lastSync ? parseInt(lastSync) : null,
    pendingActions,
    isSyncing: false,
  };
};

// Clear all offline data
export const clearOfflineData = async (): Promise<void> => {
  try {
    // Only clear keys for available entities
    const keys = [
      OFFLINE_KEYS.PENDING_ORDERS,
      OFFLINE_KEYS.PENDING_PRODUCTS,
      OFFLINE_KEYS.PENDING_USERS,
      OFFLINE_KEYS.LAST_SYNC,
      OFFLINE_KEYS.OFFLINE_DATA
    ];
    await AsyncStorage.multiRemove(keys);
    console.log('Cleared all offline data');
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}; 
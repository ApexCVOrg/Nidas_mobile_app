import { useState, useEffect, useCallback } from 'react';
import { 
  checkNetworkStatus, 
  getSyncStatus, 
  syncOfflineActions, 
  SyncStatus,
  OfflineAction,
  storeOfflineAction,
  generateOfflineId
} from '../utils/offlineSync';
import { mockApi } from '../services/mockApi';

export const useOfflineSync = (onAutoSyncSuccess?: () => void) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: null,
    pendingActions: 0,
    isSyncing: false,
  });

  // API functions for sync - only use available methods
  const apiFunctions = {
    createOrder: mockApi.createOrder,
    updateOrderStatus: mockApi.updateOrderStatus,
    addProduct: mockApi.addProduct,
    updateProduct: mockApi.updateProduct,
    deleteProduct: mockApi.deleteProduct,
    createUser: mockApi.createUser,
    updateUser: mockApi.updateUser,
    deleteUser: mockApi.deleteUser,
  };

  // Update sync status
  const updateSyncStatus = useCallback(async () => {
    const status = await getSyncStatus();
    setSyncStatus(status);
  }, []);

  // Manual sync
  const performSync = useCallback(async (onSuccess?: () => void) => {
    if (syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      const success = await syncOfflineActions(apiFunctions, onSuccess);
      if (success) {
        console.log('Sync completed successfully');
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      await updateSyncStatus();
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [syncStatus.isSyncing, updateSyncStatus]);

  // Store offline action
  const addOfflineAction = useCallback(async (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: 'order' | 'product' | 'user' | 'analytics' | 'chat' | 'message',
    data: any
  ) => {
    const action: OfflineAction = {
      id: generateOfflineId(),
      type,
      entity,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await storeOfflineAction(action);
    await updateSyncStatus();
  }, [updateSyncStatus]);

  // Network status listener
  useEffect(() => {
    let isMounted = true;
    
    const checkNetworkAndSync = async () => {
      try {
        const isOnline = await checkNetworkStatus();
        
        if (isMounted) {
          setSyncStatus(prev => ({ ...prev, isOnline }));
          
          // Tắt auto sync - chỉ sync khi user ấn nút đồng bộ
          // if (isOnline && syncStatus.pendingActions > 0) {
          //   setTimeout(() => {
          //     performSync(onAutoSyncSuccess); // Auto sync with callback if provided
          //   }, 1000); // Delay to ensure connection is stable
          // }
        }
      } catch (error) {
        console.error('Error checking network status:', error);
      }
    };

    // Check network status periodically
    const interval = setInterval(checkNetworkAndSync, 10000); // Check every 10 seconds
    
    // Initial check
    checkNetworkAndSync();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [performSync]);

  // Initial status check
  useEffect(() => {
    updateSyncStatus();
  }, [updateSyncStatus]);

  // Tắt auto sync - chỉ sync khi user ấn nút đồng bộ
  // useEffect(() => {
  //   if (!syncStatus.isOnline || syncStatus.pendingActions === 0) return;

  //   const interval = setInterval(() => {
  //     performSync(onAutoSyncSuccess); // Auto sync with callback if provided
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [syncStatus.isOnline, syncStatus.pendingActions, performSync, onAutoSyncSuccess]);

  return {
    syncStatus,
    performSync,
    addOfflineAction,
    updateSyncStatus,
  };
}; 
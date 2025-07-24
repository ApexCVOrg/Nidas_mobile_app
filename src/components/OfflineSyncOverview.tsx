import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SyncStatus } from '../utils/offlineSync';
import { getOfflineActions, clearOfflineData } from '../utils/offlineSync';

interface OfflineSyncOverviewProps {
  syncStatus: SyncStatus;
  onManualSync: () => void;
  onRefresh: () => void;
}

const OfflineSyncOverview: React.FC<OfflineSyncOverviewProps> = ({
  syncStatus,
  onManualSync,
  onRefresh,
}) => {
  const [offlineStats, setOfflineStats] = React.useState({
    orders: 0,
    products: 0,
    users: 0,
  });

  const loadOfflineStats = async () => {
    try {
      const entities = ['order', 'product', 'user']; // Only available entities
      const stats: any = {};
      
      for (const entity of entities) {
        const actions = await getOfflineActions(entity);
        stats[`${entity}s`] = actions.length;
      }
      
      setOfflineStats(stats);
    } catch (error) {
      console.error('Error loading offline stats:', error);
    }
  };

  React.useEffect(() => {
    loadOfflineStats();
  }, [syncStatus.pendingActions]);

  const handleClearOfflineData = () => {
    Alert.alert(
      'Xóa dữ liệu offline',
      'Bạn có chắc chắn muốn xóa tất cả dữ liệu offline? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearOfflineData();
              await loadOfflineStats();
              onRefresh();
              Alert.alert('Thành công', 'Đã xóa tất cả dữ liệu offline');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu offline');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return '#f44336';
    if (syncStatus.pendingActions > 0) return '#FF9800';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Ngoại tuyến';
    if (syncStatus.pendingActions > 0) return `${syncStatus.pendingActions} hành động chờ`;
    return 'Đã đồng bộ';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="cloud-sync" size={24} color={getStatusColor()} />
          <Text style={styles.headerTitle}>Offline Sync</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Icon name="refresh" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearOfflineData}>
            <Icon name="clear-all" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {syncStatus.isSyncing && (
          <Icon name="sync" size={16} color="#FF9800" style={styles.syncingIcon} />
        )}
      </View>

                {syncStatus.pendingActions > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Hành động chờ đồng bộ:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.statsRow}>
                  {offlineStats.orders > 0 && (
                    <View style={styles.statItem}>
                      <Icon name="receipt" size={16} color="#FF9800" />
                      <Text style={styles.statText}>{offlineStats.orders} Đơn hàng</Text>
                    </View>
                  )}
                  {offlineStats.products > 0 && (
                    <View style={styles.statItem}>
                      <Icon name="inventory" size={16} color="#FF9800" />
                      <Text style={styles.statText}>{offlineStats.products} Sản phẩm</Text>
                    </View>
                  )}
                  {offlineStats.users > 0 && (
                    <View style={styles.statItem}>
                      <Icon name="people" size={16} color="#FF9800" />
                      <Text style={styles.statText}>{offlineStats.users} Người dùng</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          )}

      {syncStatus.lastSync && (
        <View style={styles.lastSyncContainer}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.lastSyncText}>
            Đồng bộ lần cuối: {new Date(syncStatus.lastSync).toLocaleString('vi-VN')}
          </Text>
        </View>
      )}

      {syncStatus.pendingActions > 0 && syncStatus.isOnline && !syncStatus.isSyncing && (
        <TouchableOpacity style={styles.syncButton} onPress={onManualSync}>
          <Icon name="sync" size={16} color="white" />
          <Text style={styles.syncButtonText}>Đồng bộ ngay</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  syncingIcon: {
    marginLeft: 8,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  lastSyncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastSyncText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  syncButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default OfflineSyncOverview; 
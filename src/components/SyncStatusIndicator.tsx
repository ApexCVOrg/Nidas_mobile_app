import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SyncStatus } from '../utils/offlineSync';

interface SyncStatusIndicatorProps {
  syncStatus: SyncStatus;
  onManualSync: () => void;
  showDetails?: boolean;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  syncStatus,
  onManualSync,
  showDetails = false,
}) => {
  const getStatusColor = () => {
    if (syncStatus.isSyncing) return '#FF9800';
    if (!syncStatus.isOnline) return '#f44336';
    if (syncStatus.pendingActions > 0) return '#FF9800';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (syncStatus.isSyncing) return 'Đang đồng bộ...';
    if (!syncStatus.isOnline) return 'Không có kết nối';
    if (syncStatus.pendingActions > 0) return `${syncStatus.pendingActions} hành động chờ`;
    return 'Đã đồng bộ';
  };

  const getStatusIcon = () => {
    if (syncStatus.isSyncing) return 'sync';
    if (!syncStatus.isOnline) return 'wifi-off';
    if (syncStatus.pendingActions > 0) return 'cloud-upload';
    return 'cloud-done';
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {syncStatus.isSyncing && (
          <ActivityIndicator size="small" color={getStatusColor()} style={styles.spinner} />
        )}
      </View>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="wifi" size={16} color={syncStatus.isOnline ? '#4CAF50' : '#f44336'} />
            <Text style={styles.detailText}>
              {syncStatus.isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </Text>
          </View>
          
          {syncStatus.lastSync && (
            <View style={styles.detailRow}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.detailText}>
                Đồng bộ lần cuối: {new Date(syncStatus.lastSync).toLocaleTimeString()}
              </Text>
            </View>
          )}
          
          {syncStatus.pendingActions > 0 && (
            <View style={styles.detailRow}>
              <Icon name="pending" size={16} color="#FF9800" />
              <Text style={styles.detailText}>
                {syncStatus.pendingActions} hành động chờ đồng bộ
              </Text>
            </View>
          )}
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
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  spinner: {
    marginLeft: 8,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  syncButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default SyncStatusIndicator; 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingActions: number;
  onManualSync?: () => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  pendingActions,
  onManualSync,
}) => {
  if (isOnline && pendingActions === 0) {
    return null; // Không hiển thị khi online và không có pending actions
  }

  return (
    <View style={[
      styles.container,
      isOnline ? styles.onlineContainer : styles.offlineContainer
    ]}>
      <View style={styles.content}>
        <Icon 
          name={isOnline ? "cloud-upload" : "wifi-off"} 
          size={20} 
          color={isOnline ? "#FF9800" : "#f44336"} 
        />
        <View style={styles.textContainer}>
          <Text style={[
            styles.statusText,
            isOnline ? styles.onlineText : styles.offlineText
          ]}>
            {isOnline 
              ? `${pendingActions} thay đổi chờ đồng bộ`
              : 'Đang hoạt động offline'
            }
          </Text>
          {!isOnline && (
            <Text style={styles.subText}>
              Các thay đổi sẽ được lưu offline và đồng bộ khi có mạng
            </Text>
          )}
        </View>
      </View>
      
      {isOnline && pendingActions > 0 && onManualSync && (
        <TouchableOpacity style={styles.syncButton} onPress={onManualSync}>
          <Icon name="sync" size={16} color="white" />
          <Text style={styles.syncButtonText}>Đồng bộ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onlineContainer: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  offlineContainer: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  onlineText: {
    color: '#E65100',
  },
  offlineText: {
    color: '#C62828',
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  syncButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default OfflineIndicator; 
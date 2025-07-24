import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Bank {
  bank_code: string;
  bank_name: string;
  bank_short_name: string;
}

interface BankSelectorProps {
  onSelectBank: (bank: Bank) => void;
  selectedBank?: Bank;
}

const BankSelector: React.FC<BankSelectorProps> = ({ onSelectBank, selectedBank }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.100.246:8000/api/payments/banks');
      const data = await response.json();
      
      if (data.success) {
        setBanks(data.banks);
      } else {
        setError('Không thể tải danh sách ngân hàng');
        Alert.alert('Lỗi', 'Không thể tải danh sách ngân hàng');
      }
    } catch (error) {
      setError('Lỗi kết nối server');
      Alert.alert('Lỗi', 'Không kết nối được server');
    } finally {
      setLoading(false);
    }
  };

  const renderBankItem = ({ item }: { item: Bank }) => (
    <TouchableOpacity
      style={[
        styles.bankItem,
        selectedBank?.bank_code === item.bank_code && styles.selectedBankItem
      ]}
      onPress={() => onSelectBank(item)}
    >
      <View style={styles.bankInfo}>
        <Text style={[
          styles.bankName,
          selectedBank?.bank_code === item.bank_code && styles.selectedBankName
        ]}>
          {item.bank_name}
        </Text>
        <Text style={[
          styles.bankCode,
          selectedBank?.bank_code === item.bank_code && styles.selectedBankCode
        ]}>
          {item.bank_short_name}
        </Text>
      </View>
      {selectedBank?.bank_code === item.bank_code && (
        <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Đang tải danh sách ngân hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBanks}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn ngân hàng</Text>
      <FlatList
        data={banks}
        renderItem={renderBankItem}
        keyExtractor={(item) => item.bank_code}
        showsVerticalScrollIndicator={false}
        style={styles.bankList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  bankList: {
    flex: 1,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedBankItem: {
    backgroundColor: '#F8F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  selectedBankName: {
    color: '#0066CC',
  },
  bankCode: {
    fontSize: 14,
    color: '#666',
  },
  selectedBankCode: {
    color: '#0066CC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BankSelector; 
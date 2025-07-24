import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import BankSelector from './BankSelector';

interface Bank {
  bank_code: string;
  bank_name: string;
  bank_short_name: string;
}

interface EnhancedPaymentButtonProps {
  amount: number;
  orderInfo: string;
  returnUrl: string;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

const EnhancedPaymentButton: React.FC<EnhancedPaymentButtonProps> = ({
  amount,
  orderInfo,
  returnUrl,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [loading, setLoading] = useState(false);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.246:8000/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          orderInfo, 
          returnUrl,
          bankCode: selectedBank?.bank_code // Gửi mã ngân hàng nếu có
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mở URL thanh toán
        const canOpen = await Linking.canOpenURL(data.paymentUrl);
        if (canOpen) {
          await Linking.openURL(data.paymentUrl);
          onPaymentSuccess?.(data);
        } else {
          Alert.alert('Lỗi', 'Không thể mở trang thanh toán');
          onPaymentError?.('Không thể mở trang thanh toán');
        }
      } else {
        Alert.alert('Lỗi', data.message || 'Không tạo được thanh toán');
        onPaymentError?.(data.message || 'Không tạo được thanh toán');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không kết nối được server');
      onPaymentError?.('Không kết nối được server');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setShowBankSelector(false);
  };

  return (
    <View style={styles.container}>
      {/* Thông tin thanh toán */}
      <View style={styles.paymentInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số tiền:</Text>
          <Text style={styles.infoValue}>{formatPrice(amount)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nội dung:</Text>
          <Text style={styles.infoValue} numberOfLines={2}>{orderInfo}</Text>
        </View>
        {selectedBank && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngân hàng:</Text>
            <Text style={styles.infoValue}>{selectedBank.bank_name}</Text>
          </View>
        )}
      </View>

      {/* Nút chọn ngân hàng */}
      <TouchableOpacity
        style={styles.bankSelectorButton}
        onPress={() => setShowBankSelector(true)}
      >
        <Ionicons name="card-outline" size={20} color="#0066CC" />
        <Text style={styles.bankSelectorText}>
          {selectedBank ? `Đã chọn: ${selectedBank.bank_name}` : 'Chọn ngân hàng (tùy chọn)'}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>

      {/* Nút thanh toán chính */}
      <TouchableOpacity
        style={[styles.paymentButton, loading && styles.paymentButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="card" size={20} color="#fff" />
            <Text style={styles.paymentButtonText}>Thanh toán VNPAY</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Thông tin bảo mật */}
      <View style={styles.securityInfo}>
        <Ionicons name="shield-checkmark" size={16} color="#27ae60" />
        <Text style={styles.securityText}>
          Thanh toán được bảo mật bởi VNPAY
        </Text>
      </View>

      {/* Modal chọn ngân hàng */}
      <Modal
        visible={showBankSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBankSelector(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chọn ngân hàng</Text>
            <View style={styles.modalHeaderRight} />
          </View>
          <BankSelector
            onSelectBank={handleBankSelect}
            selectedBank={selectedBank}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 2,
    textAlign: 'right',
  },
  bankSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FF',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  bankSelectorText: {
    flex: 1,
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalHeaderRight: {
    width: 32,
  },
});

export default EnhancedPaymentButton; 
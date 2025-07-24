import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface SimplePaymentButtonProps {
  amount: number;
  orderInfo: string;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: any) => void;
}

const SimplePaymentButton: React.FC<SimplePaymentButtonProps> = ({
  amount,
  orderInfo,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTxnRef, setCurrentTxnRef] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Tạo giao dịch thanh toán
      const response = await fetch('http://192.168.100.246:8000/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderInfo,
          returnUrl: 'http://192.168.100.246:8081/payment-callback',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Lưu transaction reference để kiểm tra sau
        const txnRef = data.paymentUrl.match(/vnp_TxnRef=([^&]+)/)?.[1];
        setCurrentTxnRef(txnRef);
        
        // Mở URL thanh toán
        const { Linking } = require('react-native');
        const supported = await Linking.canOpenURL(data.paymentUrl);
        
        if (supported) {
          await Linking.openURL(data.paymentUrl);
          
          // Bắt đầu polling để kiểm tra trạng thái
          startPolling(txnRef);
        } else {
          Alert.alert('Lỗi', 'Không thể mở trang thanh toán');
        }
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tạo giao dịch thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server thanh toán');
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

     const startPolling = (txnRef: string) => {
     let attempts = 0;
     const maxAttempts = 60; // 60 giây - tăng thời gian chờ
     
     // Mock success cho testing - comment out khi production
     const mockSuccessAfterAttempts = 5; // Mock thành công sau 5 lần thử
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        Alert.alert(
          'Hết thời gian',
          'Không nhận được phản hồi từ hệ thống thanh toán. Vui lòng kiểm tra lại.',
          [
            {
              text: 'OK',
              onPress: () => setCurrentTxnRef(null)
            }
          ]
        );
        return;
      }

             try {
         console.log(`🔍 Polling attempt ${attempts + 1}/${maxAttempts} for txnRef: ${txnRef}`);
         
         // Mock success cho testing - comment out khi production
         if (attempts >= mockSuccessAfterAttempts) {
           console.log('🎭 Mocking success response for testing...');
           const mockSuccessResult = {
             vnp_ResponseCode: '00',
             vnp_Message: 'Giao dịch thành công',
             vnp_TxnRef: txnRef,
             vnp_Amount: amount * 100,
             vnp_OrderInfo: orderInfo,
             vnp_TransactionNo: `VN${Date.now()}`,
             vnp_PayDate: new Date().toISOString(),
             vnp_BankCode: 'NCB',
             vnp_CardType: 'ATM',
           };
           
           Alert.alert(
             'Thanh toán thành công! (Mock)',
             'Giao dịch của bạn đã được xử lý thành công.',
             [
               {
                 text: 'Xem hóa đơn',
                 onPress: () => {
                   navigation.navigate('PaymentSuccess' as never, { 
                     paymentResult: mockSuccessResult 
                   } as never);
                   setCurrentTxnRef(null);
                 }
               }
             ]
           );
           onPaymentSuccess?.(mockSuccessResult);
           return;
         }
         
         const response = await fetch(`http://192.168.100.246:8000/api/payments/query/${txnRef}`);
         const data = await response.json();
         console.log('📊 Polling response:', data);
        
                 if (data.success && data.result && data.result.vnp_ResponseCode) {
           const result = data.result;
           
           if (result.vnp_ResponseCode === '00') {
             // Thanh toán thành công
             Alert.alert(
               'Thanh toán thành công!',
               'Giao dịch của bạn đã được xử lý thành công.',
               [
                 {
                   text: 'Xem hóa đơn',
                   onPress: () => {
                     navigation.navigate('PaymentSuccess' as never, { 
                       paymentResult: result 
                     } as never);
                     setCurrentTxnRef(null);
                   }
                 }
               ]
             );
             onPaymentSuccess?.(result);
             return;
           } else if (result.vnp_ResponseCode === '24') {
             // Giao dịch đang xử lý, tiếp tục polling
             attempts++;
             setTimeout(poll, 1000);
             return;
           } else if (result.vnp_ResponseCode === '99') {
             // Lỗi chung - có thể do sandbox, tiếp tục polling
             console.log('VNPAY Response 99 - continuing to poll...');
             attempts++;
             setTimeout(poll, 1000);
             return;
           } else {
             // Thanh toán thất bại
             Alert.alert(
               'Thanh toán thất bại',
               `Giao dịch không thành công. Mã lỗi: ${result.vnp_ResponseCode}`,
               [
                 {
                   text: 'OK',
                   onPress: () => setCurrentTxnRef(null)
                 }
               ]
             );
             onPaymentError?.(result);
             return;
           }
         } else if (data.result && data.result.vnp_ResponseCode) {
           // Trường hợp isSuccess: false nhưng vẫn có response code
           const result = data.result;
           
           if (result.vnp_ResponseCode === '00') {
             // Thanh toán thành công
             Alert.alert(
               'Thanh toán thành công!',
               'Giao dịch của bạn đã được xử lý thành công.',
               [
                 {
                   text: 'Xem hóa đơn',
                   onPress: () => {
                     navigation.navigate('PaymentSuccess' as never, { 
                       paymentResult: result 
                     } as never);
                     setCurrentTxnRef(null);
                   }
                 }
               ]
             );
             onPaymentSuccess?.(result);
             return;
           } else if (result.vnp_ResponseCode === '24' || result.vnp_ResponseCode === '99') {
             // Giao dịch đang xử lý hoặc lỗi chung, tiếp tục polling
             console.log(`VNPAY Response ${result.vnp_ResponseCode} - continuing to poll...`);
             attempts++;
             setTimeout(poll, 1000);
             return;
           } else {
             // Thanh toán thất bại
             Alert.alert(
               'Thanh toán thất bại',
               `Giao dịch không thành công. Mã lỗi: ${result.vnp_ResponseCode}`,
               [
                 {
                   text: 'OK',
                   onPress: () => setCurrentTxnRef(null)
                 }
               ]
             );
             onPaymentError?.(result);
             return;
           }
         }
      } catch (error) {
        console.error('Polling error:', error);
      }
      
      attempts++;
      setTimeout(poll, 1000);
    };
    
    poll();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.paymentButton, isLoading && styles.disabledButton]}
        onPress={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons name="card-outline" size={24} color="#fff" />
        )}
        <Text style={styles.buttonText}>
          {isLoading ? 'Đang xử lý...' : 'Thanh toán VNPAY'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Tổng tiền:</Text>
        <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
      </View>
      
      {currentTxnRef && (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color="#0066CC" />
          <Text style={styles.statusText}>Đang kiểm tra trạng thái thanh toán...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
  },
});

export default SimplePaymentButton; 
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const PaymentCallbackScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');
  const [message, setMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    const params = route.params || {};
    fetch('http://192.168.100.246:8000/api/payments/verify?' + new URLSearchParams(params).toString())
      .then(res => res.json())
      .then(data => {
        if (data.isSuccess && data.vnp_ResponseCode === '00') {
          setStatus('success');
          setMessage('Thanh toán thành công!');
          setPaymentResult(data);
          
          // Tự động chuyển đến màn hình thành công sau 2 giây
          setTimeout(() => {
            navigation.navigate('PaymentSuccess' as never, { paymentResult: data } as never);
          }, 2000);
        } else {
          setStatus('fail');
          setMessage('Thanh toán thất bại hoặc bị hủy.');
          
          // Hiển thị alert và quay về màn hình trước
          setTimeout(() => {
            Alert.alert(
              'Thanh toán thất bại',
              'Giao dịch của bạn không thành công. Vui lòng thử lại.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]
            );
          }, 2000);
        }
      })
      .catch(() => {
        setStatus('fail');
        setMessage('Không xác thực được kết quả thanh toán.');
        
        // Hiển thị alert và quay về màn hình trước
        setTimeout(() => {
          Alert.alert(
            'Lỗi xác thực',
            'Không thể xác thực kết quả thanh toán. Vui lòng thử lại.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ]
          );
        }, 2000);
      });
  }, [route.params, navigation]);

  return (
    <View style={styles.container}>
      {status === 'pending' && (
        <>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang xác thực thanh toán...</Text>
        </>
      )}
      {status === 'success' && (
        <>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successText}>{message}</Text>
          <Text style={styles.redirectText}>Tự động chuyển đến hóa đơn...</Text>
        </>
      )}
      {status === 'fail' && (
        <>
          <View style={styles.failIcon}>
            <Text style={styles.failIconText}>✗</Text>
          </View>
          <Text style={styles.failText}>{message}</Text>
          <Text style={styles.redirectText}>Quay về màn hình trước...</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center',
    marginTop: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  successText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#27ae60', 
    textAlign: 'center',
    marginBottom: 8,
  },
  failIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  failIconText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  failText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#e74c3c', 
    textAlign: 'center',
    marginBottom: 8,
  },
  redirectText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default PaymentCallbackScreen; 
import React, { useState } from 'react';
import { Button, Linking, Alert } from 'react-native';

interface PaymentButtonProps {
  amount: number;
  orderInfo: string;
  returnUrl: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, orderInfo, returnUrl }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.246:8000/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderInfo, returnUrl }),
      });
      const data = await response.json();
      if (data.success) {
        Linking.openURL(data.paymentUrl);
      } else {
        Alert.alert('Lỗi', 'Không tạo được thanh toán');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không kết nối được server');
    } finally {
      setLoading(false);
    }
  };

  return <Button title="Thanh toán VNPAY" onPress={handlePayment} disabled={loading} />;
};

export default PaymentButton; 
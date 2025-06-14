import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CheckoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default CheckoutScreen; 
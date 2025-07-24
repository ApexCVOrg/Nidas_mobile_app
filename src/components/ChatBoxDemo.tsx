// Demo component để test ChatBox với tab Shop
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChatBox from './ChatBox';

const ChatBoxDemo: React.FC = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatBox Demo với Tab Shop</Text>
      
      <View style={styles.features}>
        <Text style={styles.featureTitle}>Tính năng mới:</Text>
        <Text style={styles.feature}>• Tab "Bot Hỗ Trợ" - Chat với AI bot</Text>
        <Text style={styles.feature}>• Tab "Shop" - Chat real-time với manager</Text>
        <Text style={styles.feature}>• Xử lý tin nhắn không dấu</Text>
        <Text style={styles.feature}>• UI/UX cải thiện với emoji và màu sắc</Text>
        <Text style={styles.feature}>• Phân tích ý định người dùng thông minh</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setIsChatVisible(true)}
      >
        <Text style={styles.buttonText}>Mở ChatBox</Text>
      </TouchableOpacity>

      <ChatBox 
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  features: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  feature: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatBoxDemo; 
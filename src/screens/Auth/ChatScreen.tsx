import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const mockMessages = [
  { id: '1', text: 'Hi there! 👋', sender: 'support', time: '09:00' },
  { id: '2', text: 'Hello! I need help with my order.', sender: 'user', time: '09:01' },
  { id: '3', text: 'Of course! Can you provide your order number?', sender: 'support', time: '09:02' },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        text: input,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={{
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? '#1976D2' : '#F0F0F0',
        borderRadius: 16,
        marginVertical: 4,
        maxWidth: '75%',
        padding: 12,
        marginHorizontal: 8,
      }}
    >
      <Text style={{ color: item.sender === 'user' ? '#fff' : '#222', fontSize: 16 }}>{item.text}</Text>
      <Text style={{ color: item.sender === 'user' ? '#BBDEFB' : '#888', fontSize: 12, marginTop: 4, textAlign: 'right' }}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#1976D2', elevation: 4 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 }}>Chat</Text>
        <Icon name="support-agent" size={24} color="#fff" />
      </View>
      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      />
      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' }}>
          <TextInput
            style={{ flex: 1, fontSize: 16, backgroundColor: '#F5F5F5', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 }}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={{ backgroundColor: '#1976D2', borderRadius: 24, padding: 10 }}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen; 
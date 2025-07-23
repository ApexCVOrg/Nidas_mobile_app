import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { 
  getChats, 
  getMessages, 
  sendMessage, 
  markMessageAsRead,
  getUsers 
} from '../../api/mockApi';

interface Chat {
  id: string;
  userId: string;
  managerId: string;
  status: string;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  type?: string;
  isManagerJoined?: boolean;
  user?: {
    name: string;
    email: string;
  };
}

interface Message {
  id: string;
  content: string;
  senderType: 'user' | 'manager' | 'bot';
  timestamp: string;
  isRead: boolean;
}

const ManagerChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isManagerJoined, setIsManagerJoined] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChats();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      setIsManagerJoined(selectedChat.isManagerJoined || false);
    }
  }, [selectedChat]);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const response = await getChats();
      const chatsWithUsers = response.data.map((chat: Chat) => {
        const user = users.find(u => u.id === chat.userId);
        return {
          ...chat,
          user: user || { name: 'Unknown User', email: 'unknown@email.com' },
          isManagerJoined: chat.isManagerJoined || false
        };
      });
      
      // Lọc chỉ hiển thị shop chats
      const shopChats = chatsWithUsers.filter((chat: Chat) => chat.type === 'shop');
      setChats(shopChats);
    } catch (error) {
      console.error('Error loading chats:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách chat');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await getMessages(chatId);
      setMessages(response.data);
      
      // Mark messages as read
      const unreadMessages = response.data.filter((msg: Message) => 
        !msg.isRead && msg.senderType === 'user'
      );
      
      for (const message of unreadMessages) {
        await markMessageAsRead(message.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Lỗi', 'Không thể tải tin nhắn');
    }
  };

  const joinChat = async () => {
    if (!selectedChat) return;

    try {
      // Cập nhật trạng thái chat
      const updatedChat = { ...selectedChat, isManagerJoined: true };
      setSelectedChat(updatedChat);
      setIsManagerJoined(true);

      // Gửi tin nhắn thông báo manager đã tham gia
      await sendMessage({
        chatId: selectedChat.id,
        senderId: 'manager001',
        senderType: 'manager',
        content: '👋 Xin chào! Tôi là nhân viên shop. Tôi sẽ hỗ trợ bạn ngay bây giờ.',
        timestamp: new Date().toISOString(),
        isRead: false
      });

      // Reload messages
      await loadMessages(selectedChat.id);
      
      Alert.alert('Thành công', 'Bạn đã tham gia chat thành công!');
    } catch (error) {
      console.error('Error joining chat:', error);
      Alert.alert('Lỗi', 'Không thể tham gia chat');
    }
  };

  const endChat = async () => {
    if (!selectedChat) return;

    Alert.alert(
      'Kết thúc phiên chat',
      'Bạn có chắc chắn muốn kết thúc phiên chat này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Kết thúc',
          style: 'destructive',
          onPress: async () => {
            try {
              // Gửi tin nhắn thông báo kết thúc
              await sendMessage({
                chatId: selectedChat.id,
                senderId: 'manager001',
                senderType: 'manager',
                content: 'Cảm ơn bạn đã liên hệ! Phiên chat này sẽ kết thúc. Nếu cần hỗ trợ thêm, vui lòng tạo chat mới. 👋',
                timestamp: new Date().toISOString(),
                isRead: false
              });

              // Cập nhật trạng thái chat
              const updatedChat = { ...selectedChat, status: 'ended', isManagerJoined: false };
              setSelectedChat(updatedChat);
              setIsManagerJoined(false);

              // Reload messages và chats
              await loadMessages(selectedChat.id);
              await loadChats();

              Alert.alert('Thành công', 'Phiên chat đã được kết thúc!');
            } catch (error) {
              console.error('Error ending chat:', error);
              Alert.alert('Lỗi', 'Không thể kết thúc chat');
            }
          }
        }
      ]
    );
  };

  const sendManagerMessage = async () => {
    if (!inputText.trim() || !selectedChat || !isManagerJoined) return;

    const managerMessage = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      // Gửi tin nhắn lên server
      await sendMessage({
        chatId: selectedChat.id,
        senderId: 'manager001',
        senderType: 'manager',
        content: managerMessage,
        timestamp: new Date().toISOString(),
        isRead: false
      });

      // Reload messages
      await loadMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn');
    } finally {
      setIsSending(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadChats();
    setIsRefreshing(false);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedChat?.id === item.id;
    const user = users.find(u => u.id === item.userId);
    
    return (
      <TouchableOpacity
        style={[styles.chatItem, isSelected && styles.selectedChatItem]}
        onPress={() => setSelectedChat(item)}
      >
        <View style={styles.chatAvatar}>
          <Ionicons name="person" size={24} color="#666" />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>
            {user?.name || 'Unknown User'}
          </Text>
          <Text style={styles.chatEmail}>
            {user?.email || 'unknown@email.com'}
          </Text>
          <Text style={styles.chatTime}>
            {new Date(item.lastMessageAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.chatStatus}>
          <View style={[styles.statusDot, item.status === 'active' && styles.activeDot]} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isManager = item.senderType === 'manager';
    const isBot = item.senderType === 'bot';
    
    return (
      <View style={[
        styles.messageContainer,
        isManager ? styles.managerMessage : styles.userMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isManager ? styles.managerBubble : styles.userBubble,
          isBot && styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            isManager ? styles.managerText : styles.userText
          ]}>
            {item.content}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat với khách hàng</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Chat List */}
        <View style={styles.chatList}>
          <Text style={styles.sectionTitle}>Danh sách chat ({chats.length})</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <FlatList
              data={chats}
              renderItem={renderChatItem}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {selectedChat ? (
            <>
              <View style={styles.messagesHeader}>
                <View style={styles.messagesHeaderLeft}>
                  <Text style={styles.messagesTitle}>
                    Chat với {users.find(u => u.id === selectedChat.userId)?.name || 'Unknown User'}
                  </Text>
                  <View style={styles.chatStatusContainer}>
                    {selectedChat.isManagerJoined ? (
                      <View style={styles.joinedStatus}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.joinedText}>Đã tham gia</Text>
                      </View>
                    ) : (
                      <View style={styles.waitingStatus}>
                        <Ionicons name="time" size={16} color="#FF9800" />
                        <Text style={styles.waitingText}>Chờ tham gia</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.messagesHeaderRight}>
                  {!selectedChat.isManagerJoined ? (
                    <TouchableOpacity style={styles.joinButton} onPress={joinChat}>
                      <Ionicons name="person-add" size={16} color="#fff" />
                      <Text style={styles.joinButtonText}>Tham gia</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.endButton} onPress={endChat}>
                      <Ionicons name="close-circle" size={16} color="#fff" />
                      <Text style={styles.endButtonText}>Kết thúc</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                onLayout={() => flatListRef.current?.scrollToEnd()}
                ListEmptyComponent={
                  <View style={styles.emptyMessagesContainer}>
                    <Text style={styles.emptyMessagesText}>
                      Bắt đầu cuộc trò chuyện
                    </Text>
                  </View>
                }
              />

              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
              >
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập tin nhắn..."
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                  onPress={sendManagerMessage}
                  disabled={!inputText.trim()}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() ? "#fff" : "#ccc"} 
                  />
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </>
          ) : (
            <View style={styles.noChatSelected}>
              <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
              <Text style={styles.noChatText}>Chọn một cuộc trò chuyện để bắt đầu</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  chatList: {
    width: '40%',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedChatItem: {
    backgroundColor: '#E3F2FD',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chatEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chatTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  chatStatus: {
    marginLeft: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  messagesHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 5,
  },
  managerMessage: {
    alignItems: 'flex-end',
  },
  userMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  managerBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  userBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  botBubble: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  managerText: {
    color: '#fff',
  },
  userText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  noChatSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyMessagesText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  messagesHeaderLeft: {
    flex: 1,
  },
  messagesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatStatusContainer: {
    marginTop: 4,
  },
  joinedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  waitingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  endButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ManagerChatScreen; 
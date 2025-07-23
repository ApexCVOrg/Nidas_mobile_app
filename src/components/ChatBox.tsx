import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  getChats, 
  getMessages, 
  sendMessage, 
  createChat, 
  getBotResponse,
  markMessageAsRead,
  getChatById
} from '../api/mockApi';

interface Message {
  id: string;
  content: string;
  senderType: 'user' | 'manager' | 'bot';
  timestamp: string;
  isRead: boolean;
}

interface ChatBoxProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isVisible, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bot' | 'shop'>('bot');
  const [shopMessages, setShopMessages] = useState<Message[]>([]);
  const [shopChatId, setShopChatId] = useState<string | null>(null);
  const [isShopLoading, setIsShopLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Load chat history
  useEffect(() => {
    if (isVisible && user) {
      if (activeTab === 'bot') {
        loadChatHistory();
      } else {
        loadShopChatHistory();
      }
    }
  }, [isVisible, user, activeTab]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      
      // Nếu không có user, tạo chat tạm thời
      if (!user) {
        setCurrentChatId('temp_chat');
        setMessages([]);
        setIsLoading(false);
        return;
      }
      
      // Tìm chat hiện tại hoặc tạo mới
      const chatsResponse = await getChats();
      const userChat = chatsResponse.data.find((chat: any) => chat.userId === user.id);
      
      if (userChat) {
        setCurrentChatId(userChat.id);
        const messagesResponse = await getMessages(userChat.id);
        setMessages(messagesResponse.data);
      } else {
        // Tạo chat mới
        const newChat = {
          userId: user.id,
          managerId: 'manager001',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0
        };
        
        const chatResponse = await createChat(newChat);
        setCurrentChatId(chatResponse.data.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      // Không hiển thị alert, chỉ log lỗi
      setCurrentChatId('temp_chat');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadShopChatHistory = async () => {
    try {
      setIsShopLoading(true);
      
      // Nếu không có user, tạo chat tạm thời
      if (!user) {
        setShopChatId('temp_shop_chat');
        setShopMessages([]);
        setIsShopLoading(false);
        return;
      }
      
      // Tìm shop chat hiện tại hoặc tạo mới
      const chatsResponse = await getChats();
      const shopChat = chatsResponse.data.find((chat: any) => 
        chat.userId === user.id && chat.type === 'shop'
      );
      
      if (shopChat) {
        setShopChatId(shopChat.id);
        const messagesResponse = await getMessages(shopChat.id);
        setShopMessages(messagesResponse.data);
      } else {
        // Tạo shop chat mới
        const newShopChat = {
          userId: user.id,
          managerId: 'shop_manager_001',
          type: 'shop',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0
        };
        
        const chatResponse = await createChat(newShopChat);
        setShopChatId(chatResponse.data.id);
        setShopMessages([]);
      }
    } catch (error) {
      console.error('Error loading shop chat:', error);
      setShopChatId('temp_shop_chat');
      setShopMessages([]);
    } finally {
      setIsShopLoading(false);
    }
  };

  const sendUserMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const userMessage = inputText.trim();
    // Xóa text field ngay lập tức và đảm bảo luôn được xóa
    setInputText('');
    setIsSending(true);

    if (activeTab === 'bot') {
      // Thêm tin nhắn user vào UI ngay lập tức
      const newUserMessage: Message = {
        id: `temp_${Date.now()}`,
        content: userMessage,
        senderType: 'user',
        timestamp: new Date().toISOString(),
        isRead: true
      };

      setMessages(prev => [...prev, newUserMessage]);

      try {
        // Gửi tin nhắn lên server (chỉ khi có user)
        if (user) {
          await sendMessage({
            chatId: currentChatId,
            senderId: user.id,
            senderType: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
            isRead: true
          });
        }

        // Lấy câu trả lời từ bot
        const botResponse = await getBotResponse(userMessage);
        
        if (botResponse.success) {
          // Thêm câu trả lời bot
          const botMessage: Message = {
            id: `bot_${Date.now()}`,
            content: botResponse.data.content,
            senderType: 'bot',
            timestamp: new Date().toISOString(),
            isRead: false
          };

          setMessages(prev => [...prev, botMessage]);

          // Gửi tin nhắn bot lên server (chỉ khi có user)
          if (user) {
            await sendMessage({
              chatId: currentChatId,
              senderId: 'bot',
              senderType: 'bot',
              content: botResponse.data.content,
              timestamp: new Date().toISOString(),
              isRead: false
            });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Lỗi', 'Không thể gửi tin nhắn');
        // Đảm bảo text field vẫn được xóa ngay cả khi có lỗi
        setInputText('');
      }
    } else {
      // Gửi tin nhắn đến shop manager
      const newUserMessage: Message = {
        id: `temp_${Date.now()}`,
        content: userMessage,
        senderType: 'user',
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setShopMessages(prev => [...prev, newUserMessage]);

      try {
        // Gửi tin nhắn lên server (chỉ khi có user)
        if (user) {
          await sendMessage({
            chatId: shopChatId,
            senderId: user.id,
            senderType: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
            isRead: false
          });
        }

        // Kiểm tra xem manager đã tham gia chưa và gửi tin nhắn bot
        if (shopChatId) {
          try {
            const chatResponse = await getChatById(shopChatId);
            const chatData = chatResponse.data;
            
            // Chỉ gửi tin nhắn bot nếu manager chưa tham gia
            if (!chatData.isManagerJoined) {
              setTimeout(() => {
                const shopMessage: Message = {
                  id: `shop_${Date.now()}`,
                  content: 'Cảm ơn bạn đã liên hệ! Nhân viên shop sẽ phản hồi trong thời gian sớm nhất. 🛍️',
                  senderType: 'manager',
                  timestamp: new Date().toISOString(),
                  isRead: false
                };

                setShopMessages(prev => [...prev, shopMessage]);

                // Gửi tin nhắn shop lên server
                if (user) {
                  sendMessage({
                    chatId: shopChatId,
                    senderId: 'shop_manager_001',
                    senderType: 'manager',
                    content: shopMessage.content,
                    timestamp: new Date().toISOString(),
                    isRead: false
                  });
                }
              }, 1000);
            }
          } catch (error) {
            console.error('Error checking chat status:', error);
          }
        }
      } catch (error) {
        console.error('Error sending shop message:', error);
        Alert.alert('Lỗi', 'Không thể gửi tin nhắn đến shop');
        // Đảm bảo text field vẫn được xóa ngay cả khi có lỗi
        setInputText('');
      }
    }
    
    // Đảm bảo text field luôn được xóa sau khi xử lý xong
    setInputText('');
    setIsSending(false);
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      sendUserMessage();
    }
  };

  const handleSubmitEditing = () => {
    sendUserMessage();
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendUserMessage();
    }
  };

  // Thêm useEffect để đảm bảo text field được xóa khi chuyển tab
  React.useEffect(() => {
    setInputText('');
  }, [activeTab]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.senderType === 'user';
    const isBot = item.senderType === 'bot';
    const isShop = item.senderType === 'manager' && activeTab === 'shop';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.otherBubble,
          isBot && styles.botBubble,
          isShop && styles.shopBubble
        ]}>
          {isShop && (
            <View style={styles.shopHeader}>
              <Ionicons name="storefront" size={16} color="#FF6B35" />
              <Text style={styles.shopName}>Shop Nidas</Text>
            </View>
          )}
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.otherText
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

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={[styles.onlineIndicator, activeTab === 'shop' && styles.shopIndicator]} />
          <Text style={styles.headerTitle}>
            {activeTab === 'bot' ? 'Hỗ trợ khách hàng' : 'Shop Nidas'}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bot' && styles.activeTab]}
          onPress={() => setActiveTab('bot')}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={20} 
            color={activeTab === 'bot' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'bot' && styles.activeTabText]}>
            Bot Hỗ Trợ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
          onPress={() => setActiveTab('shop')}
        >
          <Ionicons 
            name="storefront" 
            size={20} 
            color={activeTab === 'shop' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
            Shop
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        {activeTab === 'bot' ? (
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              onLayout={() => flatListRef.current?.scrollToEnd()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>Chào bạn! Tôi có thể giúp gì cho bạn?</Text>
                  <Text style={styles.emptySubText}>💡 Bạn có thể nhắn tin bằng tiếng Việt có dấu hoặc không dấu đều được!</Text>
                </View>
              }
            />
          )
        ) : (
          isShopLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Đang kết nối với shop...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={shopMessages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              onLayout={() => flatListRef.current?.scrollToEnd()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="storefront" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>Chào bạn! Bạn cần hỗ trợ gì từ shop?</Text>
                  <Text style={styles.emptySubText}>🛍️ Nhân viên shop sẽ phản hồi trong thời gian sớm nhất!</Text>
                </View>
              }
            />
          )
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={
            isSending 
              ? "Đang gửi..."
              : activeTab === 'bot' 
                ? "Nhập tin nhắn... (có dấu hoặc không dấu đều được)"
                : "Nhắn tin với shop..."
          }
          multiline
          maxLength={500}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#fff" : "#ccc"} 
            />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  shopIndicator: {
    backgroundColor: '#FF6B35',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  botBubble: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  shopBubble: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  otherText: {
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
    borderTopColor: '#f0f0f0',
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
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
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
  emptySubText: {
    marginTop: 8,
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
    backgroundColor: '#fff',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ChatBox; 
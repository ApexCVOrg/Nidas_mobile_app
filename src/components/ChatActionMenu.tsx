import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface ChatActionMenuProps {
  onSendSuggestion: () => void;
  onSendProduct: () => void;
  onSendImage: (uri: string) => void;
  onSendFile: (file: any) => void;
  showProductButton?: boolean;
}

const ChatActionMenu: React.FC<ChatActionMenuProps> = ({
  onSendSuggestion,
  onSendProduct,
  onSendImage,
  onSendFile,
  showProductButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showMenu = () => {
    setIsVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const handleCameraPress = () => {
    Alert.alert('Thông báo', 'Tính năng chụp ảnh sẽ được cập nhật sau');
    hideMenu();
  };

  const handleGalleryPress = () => {
    Alert.alert('Thông báo', 'Tính năng chọn ảnh sẽ được cập nhật sau');
    hideMenu();
  };

  const handleFilePress = () => {
    Alert.alert('Thông báo', 'Tính năng gửi file sẽ được cập nhật sau');
    hideMenu();
  };

  const handleSuggestionPress = () => {
    onSendSuggestion();
    hideMenu();
  };

  const handleProductPress = () => {
    onSendProduct();
    hideMenu();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={showMenu}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={hideMenu}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSuggestionPress}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="#007AFF" />
              <Text style={styles.menuText}>Gợi ý tin nhắn</Text>
            </TouchableOpacity>

            {showProductButton && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleProductPress}
              >
                <Ionicons name="cube" size={20} color="#4CAF50" />
                <Text style={styles.menuText}>Gửi sản phẩm</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleCameraPress}
            >
              <Ionicons name="camera" size={20} color="#FF6B35" />
              <Text style={styles.menuText}>Chụp ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleGalleryPress}
            >
              <Ionicons name="image" size={20} color="#9C27B0" />
              <Text style={styles.menuText}>Chọn ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleFilePress}
            >
              <Ionicons name="document" size={20} color="#FF9800" />
              <Text style={styles.menuText}>Gửi file</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 100,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default ChatActionMenu; 
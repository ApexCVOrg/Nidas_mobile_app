import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatBox from './ChatBox';

interface ChatButtonProps {
  style?: any;
}

const ChatButton: React.FC<ChatButtonProps> = ({ style }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  // Animation pulse
  React.useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsChatVisible(true);
  };

  return (
    <>
      {!isChatVisible && (
        <Animated.View
          style={[
            styles.chatButton,
            style,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <View style={styles.chatIconContainer}>
              <Ionicons name="chatbubble" size={24} color="#fff" />
            </View>
            <Animated.View 
              style={[
                styles.pulse,
                {
                  transform: [{ scale: pulse }],
                },
              ]} 
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>1</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ChatBox
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatButton; 
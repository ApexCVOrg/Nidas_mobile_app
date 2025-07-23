import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ChatMediaMessageProps {
  type: 'image' | 'file';
  uri?: string;
  fileName?: string;
  fileSize?: string;
  onPress?: () => void;
  isUser?: boolean;
}

const ChatMediaMessage: React.FC<ChatMediaMessageProps> = ({
  type,
  uri,
  fileName,
  fileSize,
  onPress,
  isUser = false,
}) => {
  if (type === 'image' && uri) {
    return (
      <TouchableOpacity
        style={[
          styles.imageContainer,
          isUser ? styles.userImageContainer : styles.otherImageContainer,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <Ionicons name="expand" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  }

  if (type === 'file' && fileName) {
    return (
      <TouchableOpacity
        style={[
          styles.fileContainer,
          isUser ? styles.userFileContainer : styles.otherFileContainer,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.fileIcon}>
          <Ionicons name="document" size={24} color="#007AFF" />
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={2}>
            {fileName}
          </Text>
          {fileSize && (
            <Text style={styles.fileSize}>{fileSize}</Text>
          )}
        </View>
        <View style={styles.fileAction}>
          <Ionicons name="download" size={20} color="#007AFF" />
        </View>
      </TouchableOpacity>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  userImageContainer: {
    alignSelf: 'flex-end',
    maxWidth: width * 0.6,
  },
  otherImageContainer: {
    alignSelf: 'flex-start',
    maxWidth: width * 0.6,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: width * 0.7,
  },
  userFileContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherFileContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  fileAction: {
    marginLeft: 8,
  },
});

export default ChatMediaMessage; 
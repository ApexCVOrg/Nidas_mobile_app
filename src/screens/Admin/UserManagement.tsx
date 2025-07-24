import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi';

const UserManagement: React.FC = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [banLoading, setBanLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await mockApi.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleViewUser = (user: any) => {
    setViewingUser(user);
    setViewModalVisible(true);
  };

  const handleBanUnban = async (user: any) => {
    setBanLoading(true);
    try {
      // Đảo trạng thái ban: nếu user.isBanned thì unban, ngược lại ban
      await mockApi.updateUser(user.id, { isBanned: !user.isBanned });
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user status');
    } finally {
      setBanLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }: any) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
        {item.isBanned && <Text style={{ color: 'red', fontWeight: 'bold' }}>(Banned)</Text>}
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleViewUser(item)}>
          <Icon name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleBanUnban(item)} disabled={banLoading}>
          <Icon name={item.isBanned ? "lock-open" : "block"} size={20} color={item.isBanned ? "#4CAF50" : "#f44336"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="person-add" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Thông tin người dùng</Text>
            {viewingUser && (
              <>
                <Text>ID: {viewingUser.id}</Text>
                <Text>Tên: {viewingUser.name}</Text>
                <Text>Email: {viewingUser.email}</Text>
                <Text>Role: {viewingUser.role}</Text>
                <Text>Phone: {viewingUser.phone}</Text>
                <Text>Trạng thái: {viewingUser.isBanned ? 'Banned' : 'Active'}</Text>
                <Text>Ngày tạo: {viewingUser.createdAt}</Text>
                <Text>Ngày cập nhật: {viewingUser.updatedAt}</Text>
              </>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Text style={{ color: '#2196F3' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default UserManagement; 
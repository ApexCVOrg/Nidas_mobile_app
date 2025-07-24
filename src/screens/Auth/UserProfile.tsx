import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Platform,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabNavigatorParamList } from '../../navigation/TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileStyles } from '../../styles/auth/userProfile.styles';
import { mockApi } from '../../services/mockApi/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { setOnboardingComplete } from '../../store/slices/onboardingSlice';
import { getUserWithAddresses } from '../../api/mockApi';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  avatar?: string;
  membershipLevel: string;
  joinDate: string;
  totalPoints: number;
  currentLevel: string;
  nextLevelPoints: number;
  addresses?: any[];
  fullName?: string;
}

const { width } = Dimensions.get('window');

const UserProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TabNavigatorParamList>>();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempUserData, setTempUserData] = useState<UserProfileData | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Stats data (mock for now)
  const stats = {
    orders: 24,
    points: userData?.totalPoints || 0,
    reviews: 8,
    wishlist: 12,
    returns: 2,
    coupons: 5,
  };

  useEffect(() => {
    fetchProfile();
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy userId từ Redux hoặc token
      let userId = user?.id;
      if (!userId) {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          // Token dạng mock_token_<userId>_<timestamp>
          const parts = storedToken.split('_');
          userId = parts[2];
        }
      }
      if (!userId) {
        setError('No authentication token found');
        return;
      }
      // Lấy user + address từ mock API
      const { user: userInfo, addresses } = await getUserWithAddresses(userId);
      if (!userInfo) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }
      // Gộp thông tin user + address (lấy address mặc định hoặc đầu tiên)
      const mainAddress = addresses && addresses.length > 0 ? addresses.find((a: any) => a.isDefault) || addresses[0] : null;
      const mockUserData = {
        ...userInfo,
        firstName: userInfo.name?.split(' ')[0] || '',
        lastName: userInfo.name?.split(' ').slice(1).join(' ') || '',
        phone: userInfo.phone || '',
        dateOfBirth: userInfo.dateOfBirth || '1990-01-01',
        gender: userInfo.gender || 'male',
        address: mainAddress ? mainAddress.street : '',
        city: mainAddress ? mainAddress.city : '',
        country: mainAddress ? mainAddress.country : '',
        avatar: userInfo.avatar || 'default-avatar.svg',
        membershipLevel: 'Gold',
        joinDate: userInfo.createdAt || '2024-01-01',
        totalOrders: 15,
        totalSpent: 2500000,
        preferences: {
          notifications: true,
          marketing: false,
          language: 'en'
        },
        addresses: addresses || [],
        fullName: userInfo.name
      };
      setUserData(mockUserData as any);
      setTempUserData(mockUserData as any);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) setTempUserData(userData);
  }, [userData]);

  const handleSave = async () => {
    if (!tempUserData) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
              // Simulate updating profile
        console.log('📧 Mock: Profile updated for user:', tempUserData.email);
        const res = { data: { success: true, message: 'Profile updated successfully' } };
              setUserData(tempUserData);
      setIsEditing(false);
      setFocusedInput(null);
      setSuccess('Profile updated successfully! 🎉');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempUserData(userData);
    setIsEditing(false);
    setFocusedInput(null);
    setError(null);
    setSuccess(null);
  };

  const handleAvatarPick = () => {
    Alert.alert(
      'Avatar Change',
      'Avatar change feature will be implemented with expo-image-picker',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mock Change',
          onPress: () => {
            if (userData)
              setUserData(prev => prev ? { ...prev, avatar: 'https://via.placeholder.com/120x120/1A1A1A/FFFFFF?text=JD' } : null);
            setShowAvatarPicker(false);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await AsyncStorage.removeItem('auth_token');
    dispatch(logoutAction());
    dispatch(setOnboardingComplete(true));
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' as never }],
    });
  };

  const getInitials = () => {
    if (!userData) return '';
    return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getProgressPercentage = () => {
    if (!userData) return 0;
    const currentPoints = userData.totalPoints;
    const nextLevelPoints = userData.nextLevelPoints;
    const previousLevelPoints = userData.currentLevel === 'Gold' ? 1000 : 500;
    const progress = (currentPoints - previousLevelPoints) / (nextLevelPoints - previousLevelPoints);
    return Math.min(Math.max(progress, 0), 1);
  };

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    badge?: string,
    onPress?: () => void,
    isLast = false,
    iconColor?: string
  ) => (
    <TouchableOpacity
      style={[userProfileStyles.menuItem, isLast && userProfileStyles.menuItemLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={userProfileStyles.menuItemLeft}>
        <Icon
          name={icon}
          size={28}
          color={iconColor || '#1A1A1A'}
          style={userProfileStyles.menuIcon}
        />
        <View style={{ flex: 1 }}>
          <Text style={userProfileStyles.menuText}>{title}</Text>
          {subtitle && <Text style={userProfileStyles.menuSubtext}>{subtitle}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {badge && (
          <View style={userProfileStyles.badge}>
            <Text style={userProfileStyles.badgeText}>{badge}</Text>
          </View>
        )}
        <Icon name="chevron-right" size={24} color="#CCCCCC" />
      </View>
    </TouchableOpacity>
  );

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    keyboardType?: any,
    isLast = false
  ) => (
    <View style={[userProfileStyles.formGroup, isLast && { marginBottom: 0 }]}> 
      <Text style={userProfileStyles.label}>{label}</Text>
      <View
        style={[
          userProfileStyles.inputContainer,
          focusedInput === label && userProfileStyles.inputContainerFocused,
        ]}
      >
        <Icon name={icon} size={20} color="#666666" style={userProfileStyles.inputIcon} />
        <TextInput
          style={userProfileStyles.input}
          value={value}
          onChangeText={onChangeText}
          editable={isEditing}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          keyboardType={keyboardType}
          onFocus={() => setFocusedInput(label)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
        <Text style={{ marginTop: 16, color: '#1A1A1A', fontWeight: '600' }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
        <Text style={{ color: 'red', fontWeight: '600', marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity style={userProfileStyles.actionButton} onPress={fetchProfile}>
          <Text style={userProfileStyles.actionButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userData || !tempUserData) return null;

  return (
    <SafeAreaView style={userProfileStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      {/* Header */}
      <Animated.View
        style={[
          userProfileStyles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={userProfileStyles.headerContent}>
          <TouchableOpacity
            style={userProfileStyles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={userProfileStyles.headerTitle}>PROFILE</Text>
            <Text style={userProfileStyles.headerSubtitle}>Manage your account</Text>
          </View>
          <TouchableOpacity
            style={userProfileStyles.backButton}
            onPress={() => setIsEditing(!isEditing)}
            activeOpacity={0.8}
          >
            <Icon name={isEditing ? 'close' : 'edit'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Profile Section */}
          <Animated.View
            style={[
              userProfileStyles.profileSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={userProfileStyles.avatarContainer}>
              <TouchableOpacity
                style={userProfileStyles.avatar}
                onPress={() => setShowAvatarPicker(true)}
                disabled={!isEditing}
                activeOpacity={0.8}
              >
                {userData.avatar ? (
                  <Image source={{ uri: userData.avatar }} style={userProfileStyles.avatarImage} resizeMode="cover" />
                ) : (
                  <Text style={userProfileStyles.avatarText}>{getInitials()}</Text>
                )}
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity style={userProfileStyles.editAvatarButton} onPress={handleAvatarPick} activeOpacity={0.8}>
                  <Text style={userProfileStyles.editAvatarText}>Change Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={userProfileStyles.userInfo}>
              <Text style={userProfileStyles.userName}>
                {isEditing
                  ? tempUserData.fullName || tempUserData.firstName + ' ' + tempUserData.lastName
                  : userData.fullName || userData.firstName + ' ' + userData.lastName}
              </Text>
              <Text style={userProfileStyles.userEmail}>{isEditing ? tempUserData.email : userData.email}</Text>
              <View style={userProfileStyles.membershipBadge}>
                <Text style={userProfileStyles.membershipText}>{userData.membershipLevel}</Text>
              </View>
            </View>
            {/* Level Progress */}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A1A' }}>Level Progress</Text>
                <Text style={{ fontSize: 12, color: '#666666' }}>{userData.totalPoints} / {userData.nextLevelPoints} points</Text>
              </View>
              <View style={userProfileStyles.progressBar}>
                <View style={[userProfileStyles.progressFill, { width: `${getProgressPercentage() * 100}%` }]} />
              </View>
              <View style={userProfileStyles.levelInfo}>
                <Text style={userProfileStyles.levelText}>Current: {userData.currentLevel}</Text>
                <Text style={userProfileStyles.pointsText}>{userData.nextLevelPoints - userData.totalPoints} points to next level</Text>
              </View>
            </View>
          </Animated.View>
          {/* Stats Section */}
          <Animated.View
            style={[
              userProfileStyles.statsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={userProfileStyles.sectionTitle}>Your Activity</Text>
            <View style={userProfileStyles.statsRow}>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.orders}</Text>
                <Text style={userProfileStyles.statsLabel}>Orders</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.points}</Text>
                <Text style={userProfileStyles.statsLabel}>Points</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.reviews}</Text>
                <Text style={userProfileStyles.statsLabel}>Reviews</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.wishlist}</Text>
                <Text style={userProfileStyles.statsLabel}>Wishlist</Text>
              </View>
            </View>
            <View style={userProfileStyles.statsRow}>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.returns}</Text>
                <Text style={userProfileStyles.statsLabel}>Returns</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>{stats.coupons}</Text>
                <Text style={userProfileStyles.statsLabel}>Coupons</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>98%</Text>
                <Text style={userProfileStyles.statsLabel}>Satisfaction</Text>
              </View>
              <View style={userProfileStyles.statsItem}>
                <Text style={userProfileStyles.statsNumber}>12</Text>
                <Text style={userProfileStyles.statsLabel}>Months</Text>
              </View>
            </View>
          </Animated.View>
          {/* Personal Information Form */}
          {isEditing && (
            <Animated.View
              style={[
                userProfileStyles.formSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={userProfileStyles.sectionTitle}>Personal Information</Text>
              {renderInputField('First Name', tempUserData.firstName, text => setTempUserData(prev => prev ? { ...prev, firstName: text } : prev), 'Enter first name', 'person')}
              {renderInputField('Last Name', tempUserData.lastName, text => setTempUserData(prev => prev ? { ...prev, lastName: text } : prev), 'Enter last name', 'person')}
              {renderInputField('Email', tempUserData.email, text => setTempUserData(prev => prev ? { ...prev, email: text } : prev), 'Enter email', 'email', 'email-address')}
              {renderInputField('Phone', tempUserData.phone, text => setTempUserData(prev => prev ? { ...prev, phone: text } : prev), 'Enter phone number', 'phone', 'phone-pad')}
              {renderInputField('Date of Birth', tempUserData.dateOfBirth, text => setTempUserData(prev => prev ? { ...prev, dateOfBirth: text } : prev), 'YYYY-MM-DD', 'event')}
              {renderInputField('Address', tempUserData.address, text => setTempUserData(prev => prev ? { ...prev, address: text } : prev), 'Enter address', 'location-on')}
              {renderInputField('City', tempUserData.city, text => setTempUserData(prev => prev ? { ...prev, city: text } : prev), 'Enter city', 'location-city')}
              {renderInputField('Country', tempUserData.country, text => setTempUserData(prev => prev ? { ...prev, country: text } : prev), 'Enter country', 'public', undefined, true)}
              {/* Action Buttons */}
              <View style={{ marginTop: 24, gap: 12 }}>
                <TouchableOpacity style={userProfileStyles.actionButton} onPress={handleSave} activeOpacity={0.8}>
                  <Text style={userProfileStyles.actionButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[userProfileStyles.actionButton, userProfileStyles.secondaryButton]} onPress={handleCancel} activeOpacity={0.8}>
                  <Text style={userProfileStyles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
          {/* Menu Section */}
          <Animated.View
            style={[
              userProfileStyles.menuSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {renderMenuItem('shopping-bag', 'My Orders', 'Track your orders and view history', undefined, () => navigation.navigate('MyOrders' as never), false, '#1A1A1A')}
            {renderMenuItem('favorite', 'Wishlist', 'Your saved items', undefined, () => navigation.navigate('MainTabs', { screen: 'Favorites' } as any), false, '#E91E63')}
            {renderMenuItem('star', 'Reviews', 'Your product reviews', undefined, () => navigation.navigate('Reviews' as never), false, '#FF9800')}
            {renderMenuItem('card-giftcard', 'Rewards', 'Points and rewards', undefined, () => navigation.navigate('Rewards' as never), false, '#4CAF50')}
            {renderMenuItem('notifications', 'Notifications', 'Manage your notifications', '3', () => navigation.navigate('Notifications' as never), false, '#2196F3')}
            {renderMenuItem('chat', 'Chat', 'Chat with support or friends', undefined, () => navigation.navigate('Chat' as never), false, '#1976D2')}
            {renderMenuItem('settings', 'Settings', 'App and account settings', undefined, () => navigation.navigate('Settings' as never), false, '#757575')}
            {renderMenuItem('security', 'Security', 'Password and privacy settings', undefined, () => navigation.navigate('Security' as never), false, '#9C27B0')}
            {renderMenuItem('help', 'Help & Support', 'Get help and contact support', undefined, () => navigation.navigate('Support' as never), false, '#607D8B')}
            {renderMenuItem('info', 'About', 'App version and legal information', undefined, () => navigation.navigate('About' as never), true, '#795548')}
          </Animated.View>
          {/* Logout Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity style={[userProfileStyles.actionButton, userProfileStyles.logoutButton]} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={[userProfileStyles.actionButtonText, userProfileStyles.logoutButtonText]}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={userProfileStyles.versionText}>Version 1.0.0 • NIDAS</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={userProfileStyles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowAvatarPicker(false)} activeOpacity={1} />
          <View style={userProfileStyles.modalContent}>
            <Text style={userProfileStyles.modalTitle}>Change Profile Photo</Text>
            <TouchableOpacity style={userProfileStyles.modalButton} onPress={handleAvatarPick} activeOpacity={0.8}>
              <Text style={userProfileStyles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[userProfileStyles.modalButton, userProfileStyles.modalButtonDanger]} onPress={() => { setUserData(prev => prev ? { ...prev, avatar: undefined } : null); setShowAvatarPicker(false); }} activeOpacity={0.8}>
              <Text style={userProfileStyles.modalButtonText}>Remove Current Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[userProfileStyles.modalButton, userProfileStyles.modalButtonCancel]} onPress={() => setShowAvatarPicker(false)} activeOpacity={0.8}>
              <Text style={userProfileStyles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={userProfileStyles.modalOverlay}>
          <View style={[userProfileStyles.modalContent, { margin: 20, borderRadius: 20 }]}>
            <Text style={userProfileStyles.modalTitle}>Confirm Logout</Text>
            <Text style={{ textAlign: 'center', color: '#666666', marginBottom: 24, lineHeight: 20 }}>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </Text>
            <TouchableOpacity style={[userProfileStyles.modalButton, userProfileStyles.modalButtonDanger]} onPress={confirmLogout} activeOpacity={0.8}>
              <Text style={userProfileStyles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[userProfileStyles.modalButton, userProfileStyles.modalButtonCancel]} onPress={() => setShowLogoutModal(false)} activeOpacity={0.8}>
              <Text style={userProfileStyles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;

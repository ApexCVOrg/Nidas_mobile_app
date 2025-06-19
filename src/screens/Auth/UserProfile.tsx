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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { userProfileStyles } from '../../styles/auth/userProfile.styles';

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
}

const { width } = Dimensions.get('window');

const UserProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Mock user data - in real app, this would come from Redux store or API
  const [userData, setUserData] = useState<UserProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+84 123 456 789',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: '123 Main Street, District 1',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    membershipLevel: 'Gold Member',
    joinDate: '2023-01-15',
    totalPoints: 1250,
    currentLevel: 'Gold',
    nextLevelPoints: 2000,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempUserData, setTempUserData] = useState<UserProfileData>(userData);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Stats data
  const stats = {
    orders: 24,
    points: userData.totalPoints,
    reviews: 8,
    wishlist: 12,
    returns: 2,
    coupons: 5,
  };

  useEffect(() => {
    setTempUserData(userData);
  }, [userData]);

  useEffect(() => {
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

  const handleSave = () => {
    setUserData(tempUserData);
    setIsEditing(false);
    setFocusedInput(null);
    
    // Animate success
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

    Alert.alert('Success', 'Profile updated successfully! 🎉');
  };

  const handleCancel = () => {
    setTempUserData(userData);
    setIsEditing(false);
    setFocusedInput(null);
  };

  const handleAvatarPick = () => {
    // Mock avatar pick - in real app, this would use expo-image-picker
    Alert.alert(
      'Avatar Change',
      'Avatar change feature will be implemented with expo-image-picker',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mock Change', 
          onPress: () => {
            // Mock avatar change
            setUserData(prev => ({ 
              ...prev, 
              avatar: 'https://via.placeholder.com/120x120/1A1A1A/FFFFFF?text=JD' 
            }));
            setShowAvatarPicker(false);
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Handle logout logic here
    navigation.navigate('Login' as never);
  };

  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  };

  const getProgressPercentage = () => {
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
          color={iconColor || "#1A1A1A"} 
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
      <View style={[
        userProfileStyles.inputContainer,
        focusedInput === label && userProfileStyles.inputContainerFocused
      ]}>
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

  return (
    <SafeAreaView style={userProfileStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Header */}
      <Animated.View 
        style={[
          userProfileStyles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
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
            <Icon name={isEditing ? "close" : "edit"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Section */}
          <Animated.View 
            style={[
              userProfileStyles.profileSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
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
                  <Image 
                    source={{ uri: userData.avatar }} 
                    style={userProfileStyles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={userProfileStyles.avatarText}>{getInitials()}</Text>
                )}
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity 
                  style={userProfileStyles.editAvatarButton} 
                  onPress={handleAvatarPick}
                  activeOpacity={0.8}
                >
                  <Text style={userProfileStyles.editAvatarText}>Change Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={userProfileStyles.userInfo}>
              <Text style={userProfileStyles.userName}>
                {isEditing ? tempUserData.firstName + ' ' + tempUserData.lastName : userData.firstName + ' ' + userData.lastName}
              </Text>
              <Text style={userProfileStyles.userEmail}>
                {isEditing ? tempUserData.email : userData.email}
              </Text>
              <View style={userProfileStyles.membershipBadge}>
                <Text style={userProfileStyles.membershipText}>{userData.membershipLevel}</Text>
              </View>
            </View>

            {/* Level Progress */}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A1A' }}>
                  Level Progress
                </Text>
                <Text style={{ fontSize: 12, color: '#666666' }}>
                  {userData.totalPoints} / {userData.nextLevelPoints} points
                </Text>
              </View>
              <View style={userProfileStyles.progressBar}>
                <View 
                  style={[
                    userProfileStyles.progressFill, 
                    { width: `${getProgressPercentage() * 100}%` }
                  ]} 
                />
              </View>
              <View style={userProfileStyles.levelInfo}>
                <Text style={userProfileStyles.levelText}>Current: {userData.currentLevel}</Text>
                <Text style={userProfileStyles.pointsText}>
                  {userData.nextLevelPoints - userData.totalPoints} points to next level
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats Section */}
          <Animated.View 
            style={[
              userProfileStyles.statsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
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
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={userProfileStyles.sectionTitle}>Personal Information</Text>
              
              {renderInputField(
                'First Name',
                tempUserData.firstName,
                (text) => setTempUserData(prev => ({ ...prev, firstName: text })),
                'Enter first name',
                'person'
              )}
              
              {renderInputField(
                'Last Name',
                tempUserData.lastName,
                (text) => setTempUserData(prev => ({ ...prev, lastName: text })),
                'Enter last name',
                'person'
              )}
              
              {renderInputField(
                'Email',
                tempUserData.email,
                (text) => setTempUserData(prev => ({ ...prev, email: text })),
                'Enter email',
                'email',
                'email-address'
              )}
              
              {renderInputField(
                'Phone',
                tempUserData.phone,
                (text) => setTempUserData(prev => ({ ...prev, phone: text })),
                'Enter phone number',
                'phone',
                'phone-pad'
              )}
              
              {renderInputField(
                'Date of Birth',
                tempUserData.dateOfBirth,
                (text) => setTempUserData(prev => ({ ...prev, dateOfBirth: text })),
                'YYYY-MM-DD',
                'event'
              )}
              
              {renderInputField(
                'Address',
                tempUserData.address,
                (text) => setTempUserData(prev => ({ ...prev, address: text })),
                'Enter address',
                'location-on'
              )}
              
              {renderInputField(
                'City',
                tempUserData.city,
                (text) => setTempUserData(prev => ({ ...prev, city: text })),
                'Enter city',
                'location-city'
              )}
              
              {renderInputField(
                'Country',
                tempUserData.country,
                (text) => setTempUserData(prev => ({ ...prev, country: text })),
                'Enter country',
                'public',
                undefined,
                true
              )}

              {/* Action Buttons */}
              <View style={{ marginTop: 24, gap: 12 }}>
                <TouchableOpacity 
                  style={userProfileStyles.actionButton} 
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={userProfileStyles.actionButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[userProfileStyles.actionButton, userProfileStyles.secondaryButton]} 
                  onPress={handleCancel}
                  activeOpacity={0.8}
                >
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
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {renderMenuItem(
              'shopping-bag',
              'My Orders',
              'Track your orders and view history',
              undefined,
              () => navigation.navigate('Orders' as never),
              false,
              '#1A1A1A'
            )}
            {renderMenuItem(
              'favorite',
              'Wishlist',
              'Your saved items',
              undefined,
              () => navigation.navigate('Wishlist' as never),
              false,
              '#E91E63'
            )}
            {renderMenuItem(
              'star',
              'Reviews',
              'Your product reviews',
              undefined,
              () => navigation.navigate('Reviews' as never),
              false,
              '#FF9800'
            )}
            {renderMenuItem(
              'card-giftcard',
              'Rewards',
              'Points and rewards',
              undefined,
              () => navigation.navigate('Rewards' as never),
              false,
              '#4CAF50'
            )}
            {renderMenuItem(
              'notifications',
              'Notifications',
              'Manage your notifications',
              '3',
              () => navigation.navigate('Notifications' as never),
              false,
              '#2196F3'
            )}
            {renderMenuItem(
              'security',
              'Security',
              'Password and privacy settings',
              undefined,
              () => navigation.navigate('Security' as never),
              false,
              '#9C27B0'
            )}
            {renderMenuItem(
              'help',
              'Help & Support',
              'Get help and contact support',
              undefined,
              () => navigation.navigate('Support' as never),
              false,
              '#607D8B'
            )}
            {renderMenuItem(
              'info',
              'About',
              'App version and legal information',
              undefined,
              () => navigation.navigate('About' as never),
              true,
              '#795548'
            )}
          </Animated.View>

          {/* Logout Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <TouchableOpacity 
              style={[userProfileStyles.actionButton, userProfileStyles.logoutButton]} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={[userProfileStyles.actionButtonText, userProfileStyles.logoutButtonText]}>
                Logout
              </Text>
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
          <TouchableOpacity 
            style={{ flex: 1 }} 
            onPress={() => setShowAvatarPicker(false)}
            activeOpacity={1}
          />
          <View style={userProfileStyles.modalContent}>
            <Text style={userProfileStyles.modalTitle}>Change Profile Photo</Text>
            <TouchableOpacity
              style={userProfileStyles.modalButton}
              onPress={handleAvatarPick}
              activeOpacity={0.8}
            >
              <Text style={userProfileStyles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[userProfileStyles.modalButton, userProfileStyles.modalButtonDanger]}
              onPress={() => {
                setUserData(prev => ({ ...prev, avatar: undefined }));
                setShowAvatarPicker(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={userProfileStyles.modalButtonText}>Remove Current Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[userProfileStyles.modalButton, userProfileStyles.modalButtonCancel]}
              onPress={() => setShowAvatarPicker(false)}
              activeOpacity={0.8}
            >
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
            <TouchableOpacity
              style={[userProfileStyles.modalButton, userProfileStyles.modalButtonDanger]}
              onPress={confirmLogout}
              activeOpacity={0.8}
            >
              <Text style={userProfileStyles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[userProfileStyles.modalButton, userProfileStyles.modalButtonCancel]}
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.8}
            >
              <Text style={userProfileStyles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;

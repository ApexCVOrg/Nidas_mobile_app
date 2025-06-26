import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const userProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#1A1A1A',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  backButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#1A1A1A',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  avatarPlaceholder: {
    fontSize: 48,
    color: '#CCCCCC',
  },
  editAvatarButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  editAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  userInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  userName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  membershipBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  membershipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainerFocused: {
    borderColor: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  inputIcon: {
    marginRight: 12,
  },
  selectContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  selectPlaceholder: {
    color: '#999999',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 16,
    tintColor: '#1A1A1A',
  },
  menuText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  menuArrow: {
    color: '#CCCCCC',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: '#1A1A1A',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  versionText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 12,
    marginBottom: 20,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1A1A1A',
  },
  modalButton: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtonCancelText: {
    color: '#666666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '700',
  },
}); 
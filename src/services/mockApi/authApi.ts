import { mockUsers, MockUser, addMockUser, verifyMockUserEmail, addMockAddress, saveMockDataToFile } from '../mockData/users';
//import { EmailService, sendMockEmail } from '../emailService';
import api from '../../api/axiosInstance';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthApiService {
  private token: string | null = null;

  // Set auth token
  setToken(token: string) {
    this.token = token;
  }

  // Clear token
  clearToken() {
    this.token = null;
  }

  // Login
  async login(credentials: { username: string; password: string }) {
    await delay(500);
    // Lấy user từ API json-server (theo username)
    const response = await api.get('/users', { params: { username: credentials.username } });
    const user = response.data[0];
    console.log('DEBUG login user:', user); // Thêm log để kiểm tra user thực tế
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    // Đảm bảo kiểm tra đúng trường isBanned (có thể là undefined nếu thiếu trong db.json)
    if (user.isBanned === true) {
      throw new Error('Tài khoản của bạn đã bị khóa bởi admin');
    }
    const token = `mock_token_${user.id}_${Date.now()}`;
    this.setToken(token);
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    };
  }

  // Register with email confirmation and file storage
  async register(userData: any) {
    await delay(800); // Simulate longer processing time
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => 
      u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }
    
    // Create new user
    const newUser = addMockUser({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'user',
      avatar: 'default-avatar.svg'
    });
    
    // Save to persistent storage
    await saveMockDataToFile();
    
    // Log current users count
    console.log('📁 Mock: Total users in array:', mockUsers.length);
    console.log('📁 Mock: All users:', mockUsers.map(u => ({ 
      id: u.id, 
      email: u.email, 
      name: u.name, 
      username: u.username,
      isEmailVerified: u.isEmailVerified 
    })));
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simulate sending OTP email
    await this.sendOtpEmail(newUser.email, otp);
    
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    this.setToken(token);
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        otp: otp // Return OTP for testing purposes
      },
      message: 'Registration successful! Please check your email for OTP.'
    };
  }

  // Send OTP for verification
  async sendOtp(email: string) {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found with this email');
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simulate sending OTP email
    await this.sendOtpEmail(email, otp);
    
    return {
      success: true,
      data: { otp }, // Return OTP for testing purposes
      message: 'OTP sent successfully! Please check your email.'
    };
  }

  // Simulate saving users to file/database
  private async saveUsersToFile() {
    await delay(200);
    console.log('📁 Mock: Saving users to database/file...');
    // In real app, this would save to actual database or file
    // For now, we just simulate the operation
  }

  // Send confirmation email (real or mock)
  private async sendConfirmationEmail(email: string, name: string) {
    await delay(300);
    
    // Try to send real email first
    try {
      // Removed: const success = await EmailService.sendWelcomeEmail(email, name);
      // Removed: if (success) {
      // Removed:   console.log('📧 Real welcome email sent to:', email);
      // Removed:   return;
      // Removed: }
    } catch (error) {
      console.log('📧 EmailJS not configured, falling back to mock email');
    }
    
    // Fallback to mock email
    // Removed: sendMockEmail('Welcome', email, { 
    // Removed:   name, 
    // Removed:   message: `Welcome ${name}! Your account has been created successfully.`,
    // Removed:   verificationLink: 'https://example.com/verify?token=mock_verification_token'
    // Removed: });
  }

  // Send OTP email (real or mock)
  private async sendOtpEmail(email: string, otp: string) {
    await delay(200);
    
    // Try to send real email first
    try {
      // Removed: const success = await EmailService.sendOtpEmail(email, 'User', otp);
      // Removed: if (success) {
      // Removed:   console.log('📧 Real OTP email sent to:', email);
      // Removed:   return;
      // Removed: }
    } catch (error) {
      console.log('📧 EmailJS not configured, falling back to mock email');
    }
    
    // Fallback to mock email
    // Removed: sendMockEmail('OTP', email, { otp, message: `Your verification code is: ${otp}. Valid for 5 minutes.` });
  }

  // Logout
  async logout() {
    await delay(200);
    this.clearToken();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  // Get current user
  async getCurrentUser() {
    await delay(300);
    
    if (!this.token) {
      throw new Error('No token found');
    }

    // Extract user ID from token
    const tokenParts = this.token.split('_');
    const userId = tokenParts[2];
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  // Verify email (simulate email verification)
  async verifyEmail(token: string) {
    await delay(400);
    
    // Find user by email (assuming token contains email or we can extract it)
    // For now, we'll verify the most recent unverified user
    const unverifiedUser = mockUsers.find(user => !user.isEmailVerified);
    
    if (unverifiedUser) {
      verifyMockUserEmail(unverifiedUser.email);
      console.log('✅ Mock: Email verified successfully');
      
      return {
        success: true,
        message: 'Email verified successfully!'
      };
    } else {
      throw new Error('No unverified user found');
    }
  }

  // Forgot password (simulate password reset)
  async forgotPassword(email: string) {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found with this email');
    }
    
    // Simulate sending reset email
    await this.sendPasswordResetEmail(email, user.name);
    
    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    };
  }

  // Send password reset email (real or mock)
  private async sendPasswordResetEmail(email: string, name: string) {
    await delay(300);
    
    const resetLink = `https://example.com/reset-password?token=mock_reset_token_${Date.now()}`;
    
    // Try to send real email first
    try {
      // Removed: const success = await EmailService.sendPasswordResetEmail(email, name, resetLink);
      // Removed: if (success) {
      // Removed:   console.log('📧 Real password reset email sent to:', email);
      // Removed:   return;
      // Removed: }
    } catch (error) {
      console.log('📧 EmailJS not configured, falling back to mock email');
    }
    
    // Fallback to mock email
    // Removed: sendMockEmail('Password Reset', email, { 
    // Removed:   name, 
    // Removed:   resetLink,
    // Removed:   message: `Click the link to reset your password: ${resetLink}`
    // Removed: });
  }
} 
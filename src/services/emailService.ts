// Email Service Configuration
const EMAIL_CONFIG = {
  // Email Server Proxy (Local)
  SERVER_URL: 'http://192.168.100.138:3001', // Thay bằng IP máy của bạn
  
  // EmailJS (Backup)
  EMAILJS: {
    SERVICE_ID: 'service_323r0mg',
    TEMPLATE_ID: 'template_qg84bbw',
    USER_ID: '7E-pi0agTQnqwbAr-',
  },
  
  // Current active service
  ACTIVE_SERVICE: 'server', // 'server', 'emailjs', 'mock'
};

export class EmailService {
  // Send OTP email
  static async sendOtpEmail(email: string, name: string, otp: string): Promise<boolean> {
    try {
      switch (EMAIL_CONFIG.ACTIVE_SERVICE) {
        case 'server':
          return await this.sendWithServer(email, name, otp);
        case 'emailjs':
          return await this.sendWithEmailJS(email, name, otp);
        default:
          sendMockEmail('OTP', email, { 
            message: `Your verification code is: ${otp}. Valid for 5 minutes.`, 
            otp 
          });
          return true;
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      sendMockEmail('OTP', email, { 
        message: `Your verification code is: ${otp}. Valid for 5 minutes.`, 
        otp 
      });
      return true;
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      switch (EMAIL_CONFIG.ACTIVE_SERVICE) {
        case 'server':
          return await this.sendWelcomeWithServer(email, name);
        case 'emailjs':
          return await this.sendWelcomeWithEmailJS(email, name);
        default:
          sendMockEmail('Welcome', email, { 
            message: `Welcome ${name}! Your account has been created successfully.` 
          });
          return true;
      }
    } catch (error) {
      console.error('❌ Welcome email sending failed:', error);
      sendMockEmail('Welcome', email, { 
        message: `Welcome ${name}! Your account has been created successfully.` 
      });
      return true;
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<boolean> {
    try {
      switch (EMAIL_CONFIG.ACTIVE_SERVICE) {
        case 'server':
          return await this.sendPasswordResetWithServer(email, name, resetLink);
        case 'emailjs':
          return await this.sendPasswordResetWithEmailJS(email, name, resetLink);
        default:
          sendMockEmail('Password Reset', email, { 
            message: `Click the link to reset your password: ${resetLink}` 
          });
          return true;
      }
    } catch (error) {
      console.error('❌ Password reset email sending failed:', error);
      sendMockEmail('Password Reset', email, { 
        message: `Click the link to reset your password: ${resetLink}` 
      });
      return true;
    }
  }

  // Server proxy method for OTP
  static async sendWithServer(email: string, name: string, otp: string): Promise<boolean> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${name}!</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This code is valid for 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">NIDAS - Your Fashion Destination</p>
        </div>
      `;

      const response = await fetch(`${EMAIL_CONFIG.SERVER_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Verification Code - NIDAS',
          html: html,
          type: 'otp'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📧 Real OTP email sent via server to:', email);
        console.log('📧 Message ID:', result.messageId);
        return true;
      } else {
        const errorText = await response.text();
        console.log('📧 Server email failed:', response.status, errorText);
        console.log('📧 Using mock email instead');
        sendMockEmail('OTP', email, { 
          message: `Your verification code is: ${otp}. Valid for 5 minutes.`, 
          otp 
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Server email sending failed:', error);
      sendMockEmail('OTP', email, { 
        message: `Your verification code is: ${otp}. Valid for 5 minutes.`, 
        otp 
      });
      return true;
    }
  }

  // Server proxy method for Welcome
  static async sendWelcomeWithServer(email: string, name: string): Promise<boolean> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to NIDAS, ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our latest collections</li>
            <li>Add items to your favorites</li>
            <li>Place orders and track them</li>
            <li>Get exclusive offers and discounts</li>
          </ul>
          <p>Happy shopping!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">NIDAS - Your Fashion Destination</p>
        </div>
      `;

      const response = await fetch(`${EMAIL_CONFIG.SERVER_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to NIDAS!',
          html: html,
          type: 'welcome'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📧 Real welcome email sent via server to:', email);
        return true;
      } else {
        console.log('📧 Server welcome email failed, using mock');
        sendMockEmail('Welcome', email, { 
          message: `Welcome ${name}! Your account has been created successfully.` 
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Server welcome email failed:', error);
      sendMockEmail('Welcome', email, { 
        message: `Welcome ${name}! Your account has been created successfully.` 
      });
      return true;
    }
  }

  // Server proxy method for Password Reset
  static async sendPasswordResetWithServer(email: string, name: string, resetLink: string): Promise<boolean> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${name}!</h2>
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">NIDAS - Your Fashion Destination</p>
        </div>
      `;

      const response = await fetch(`${EMAIL_CONFIG.SERVER_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Password Reset - NIDAS',
          html: html,
          type: 'password-reset'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📧 Real password reset email sent via server to:', email);
        return true;
      } else {
        console.log('📧 Server password reset email failed, using mock');
        sendMockEmail('Password Reset', email, { 
          message: `Click the link to reset your password: ${resetLink}` 
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Server password reset email failed:', error);
      sendMockEmail('Password Reset', email, { 
        message: `Click the link to reset your password: ${resetLink}` 
      });
      return true;
    }
  }

  // EmailJS methods (backup)
  static async sendWithEmailJS(email: string, name: string, otp: string): Promise<boolean> {
    const templateParams = {
      to_email: email,
      to_name: name,
      otp_code: otp,
      message: `Your verification code is: ${otp}. Valid for 5 minutes.`,
      subject: 'Verification Code - NIDAS',
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.EMAILJS.SERVICE_ID,
        template_id: EMAIL_CONFIG.EMAILJS.TEMPLATE_ID,
        user_id: EMAIL_CONFIG.EMAILJS.USER_ID,
        template_params: templateParams,
      }),
    });

    return response.ok;
  }

  static async sendWelcomeWithEmailJS(email: string, name: string): Promise<boolean> {
    const templateParams = {
      to_email: email,
      to_name: name,
      message: `Welcome ${name}! Your account has been created successfully.`,
      subject: 'Welcome to NIDAS!',
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.EMAILJS.SERVICE_ID,
        template_id: EMAIL_CONFIG.EMAILJS.TEMPLATE_ID,
        user_id: EMAIL_CONFIG.EMAILJS.USER_ID,
        template_params: templateParams,
      }),
    });

    return response.ok;
  }

  static async sendPasswordResetWithEmailJS(email: string, name: string, resetLink: string): Promise<boolean> {
    const templateParams = {
      to_email: email,
      to_name: name,
      reset_link: resetLink,
      message: `Click the link to reset your password: ${resetLink}`,
      subject: 'Password Reset - NIDAS',
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.EMAILJS.SERVICE_ID,
        template_id: EMAIL_CONFIG.EMAILJS.TEMPLATE_ID,
        user_id: EMAIL_CONFIG.EMAILJS.USER_ID,
        template_params: templateParams,
      }),
    });

    return response.ok;
  }
}

// Mock email function for development/testing
export const sendMockEmail = (type: string, email: string, data: any) => {
  console.log(`📧 Mock ${type} email to:`, email);
  console.log('📧 Email data:', data);
  console.log('📧 Note: Start email server with "node email-server.js" to send real emails');
  
  // For OTP emails, also log the OTP for testing
  if (type === 'OTP' && data.otp) {
    console.log('🔐 Mock OTP for testing:', data.otp);
  }
}; 
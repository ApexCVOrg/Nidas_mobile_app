# 📧 EmailJS Setup Guide

## Bước 1: Đăng ký EmailJS
1. Truy cập [EmailJS.com](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Xác thực email

## Bước 2: Tạo Email Service
1. Vào **Email Services** → **Add New Service**
2. Chọn **Gmail** hoặc **Outlook**
3. Đăng nhập tài khoản email của bạn
4. Copy **Service ID** (ví dụ: `service_abc123`)

## Bước 3: Tạo Email Template
1. Vào **Email Templates** → **Create New Template**
2. Tạo template cho OTP:

```html
Subject: Your Verification Code - NIDAS

Hello {{to_name}},

Your verification code is: {{otp_code}}

This code is valid for 5 minutes.

Best regards,
NIDAS Team
```

3. Copy **Template ID** (ví dụ: `template_xyz789`)

## Bước 4: Lấy User ID
1. Vào **Account** → **API Keys**
2. Copy **Public Key** (User ID)

## Bước 5: Cập nhật Config
Mở file `src/services/emailService.ts` và thay thế:

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Thay bằng Service ID thật
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Thay bằng Template ID thật  
  USER_ID: 'YOUR_USER_ID', // Thay bằng User ID thật
};
```

## Bước 6: Test Email
1. Chạy app: `npm start`
2. Đăng ký user mới
3. Kiểm tra email thật đã được gửi

## Template Examples

### OTP Template:
```html
Subject: Verification Code - NIDAS

Hi {{to_name}},

Your verification code is: {{otp_code}}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

Thanks,
NIDAS Team
```

### Welcome Template:
```html
Subject: Welcome to NIDAS!

Hi {{to_name}},

Welcome to NIDAS! Your account has been created successfully.

You can now:
- Browse our products
- Place orders
- Track your shipments
- Earn rewards

Thanks for joining us!

Best regards,
NIDAS Team
```

### Password Reset Template:
```html
Subject: Password Reset - NIDAS

Hi {{to_name}},

You requested a password reset. Click the link below:

{{reset_link}}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Thanks,
NIDAS Team
```

## Troubleshooting

### Email không gửi được:
1. Kiểm tra Service ID, Template ID, User ID
2. Đảm bảo email service đã được kết nối
3. Kiểm tra template variables có đúng không

### Lỗi CORS:
- EmailJS hoạt động tốt trên mobile app
- Không cần lo lắng về CORS

### Giới hạn:
- Free plan: 200 emails/tháng
- Upgrade để gửi nhiều hơn

## Kết quả
✅ Email thật sẽ được gửi đến người dùng  
✅ OTP code sẽ xuất hiện trong email  
✅ User có thể verify account thật  
✅ App hoạt động như production 
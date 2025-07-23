# 📧 EmailJS Template Setup

## ✅ Keys đã được cấu hình:
- **Service ID:** `service_323r0mg`
- **Template ID:** `template_qg84bbw` 
- **User ID:** `7E-pi0agTQnqwbAr-`

## 📝 Template Variables cần có:

### 1. OTP Email Template:
```html
Subject: {{subject}}

Hi {{to_name}},

Your verification code is: {{otp_code}}

{{message}}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

Thanks,
NIDAS Team
```

### 2. Welcome Email Template:
```html
Subject: {{subject}}

Hi {{to_name}},

{{message}}

You can now:
- Browse our products
- Place orders  
- Track your shipments
- Earn rewards

Thanks for joining us!

Best regards,
NIDAS Team
```

### 3. Password Reset Template:
```html
Subject: {{subject}}

Hi {{to_name}},

You requested a password reset. Click the link below:

{{reset_link}}

{{message}}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Thanks,
NIDAS Team
```

## 🔧 Cách cập nhật template:

1. **Đăng nhập EmailJS:** [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. **Vào Templates:** Email Templates → Edit template `template_qg84bbw`
3. **Cập nhật HTML:** Copy template HTML ở trên
4. **Save:** Lưu template

## 🧪 Test Email:

1. **Chạy app:** `npm start`
2. **Đăng ký user mới:** Nhập email thật
3. **Kiểm tra email:** OTP sẽ được gửi đến email thật
4. **Verify OTP:** Nhập code từ email

## 📱 Kết quả:

✅ **Email thật** sẽ được gửi đến người dùng  
✅ **OTP code** sẽ xuất hiện trong email  
✅ **User có thể verify** account thật  
✅ **App hoạt động** như production  

## 🚨 Lưu ý:

- Template hiện tại sẽ được sử dụng cho tất cả loại email
- Nếu muốn template riêng cho từng loại, tạo thêm template mới
- Free plan: 200 emails/tháng
- Kiểm tra spam folder nếu không nhận được email 
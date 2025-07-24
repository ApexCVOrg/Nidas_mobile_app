# 🔗 Debug Deep Link VNPAY

## 🚨 **Vấn đề hiện tại:**
Sau khi nhập OTP, VNPAY không redirect về app. Đây là các bước debug:

---

## 🔍 **Bước 1: Kiểm tra cấu hình**

### **1.1 App.json scheme:**
```json
{
  "expo": {
    "scheme": "nidas",  // ✅ Đã đúng
    "ios": {
      "bundleIdentifier": "com.nidas.fashion"
    },
    "android": {
      "package": "com.nidas.fashion"
    }
  }
}
```

### **1.2 App.tsx linking:**
```typescript
const linking = {
  prefixes: ['nidas://', 'exp://192.168.100.246:8081'],
  config: {
    screens: {
      PaymentCallback: 'payment-callback',
      PaymentSuccess: 'payment-success',
    },
  },
};
```

### **1.3 Backend returnUrl:**
```javascript
vnp_ReturnUrl: 'nidas://payment-callback'
```

---

## 🧪 **Bước 2: Test Deep Link**

### **2.1 Test trong development:**
```bash
# Mở terminal và chạy:
npx uri-scheme open "nidas://payment-callback?vnp_ResponseCode=00&vnp_TxnRef=TEST123" --android
# hoặc
npx uri-scheme open "nidas://payment-callback?vnp_ResponseCode=00&vnp_TxnRef=TEST123" --ios
```

### **2.2 Test trong browser:**
```
nidas://payment-callback?vnp_ResponseCode=00&vnp_TxnRef=TEST123
```

---

## 📱 **Bước 3: Kiểm tra logs**

### **3.1 App logs:**
Tìm các log sau trong console:
```
🔗 Deep link prefixes: ['nidas://', 'exp://192.168.100.246:8081']
🔗 Can open test deep link: true/false
🔗 Initial URL: null/url
🔗 Received URL: url
```

### **3.2 Backend logs:**
```
[VNPAY][CREATE] Payment URL: https://sandbox.vnpayment.vn/...&vnp_ReturnUrl=nidas%3A%2F%2Fpayment-callback
```

---

## 🔧 **Bước 4: Sửa lỗi có thể**

### **4.1 Nếu deep link không hoạt động:**

**Option A: Sử dụng HTTP URL thay vì custom scheme**
```javascript
// Backend
vnp_ReturnUrl: 'http://192.168.100.246:8081/payment-callback'
```

**Option B: Sử dụng Expo development URL**
```javascript
// Backend
vnp_ReturnUrl: 'exp://192.168.100.246:8081/--/payment-callback'
```

### **4.2 Cập nhật App.tsx:**
```typescript
const linking = {
  prefixes: [
    'nidas://', 
    'exp://192.168.100.246:8081',
    'http://192.168.100.246:8081'  // Thêm HTTP
  ],
  config: {
    screens: {
      PaymentCallback: 'payment-callback',
      PaymentSuccess: 'payment-success',
    },
  },
};
```

---

## 🎯 **Bước 5: Test thực tế**

### **5.1 Test flow hoàn chỉnh:**
1. Mở app → Checkout
2. Nhấn thanh toán VNPAY
3. Thực hiện thanh toán
4. Nhập OTP
5. **Kiểm tra xem có redirect về app không**

### **5.2 Nếu vẫn không hoạt động:**
- Thử test với HTTP URL
- Kiểm tra VNPAY sandbox có hỗ trợ custom scheme không
- Thử build app thật thay vì development

---

## 📋 **Checklist Debug:**

- [ ] App.json có scheme "nidas"
- [ ] App.tsx có linking config
- [ ] Backend dùng returnUrl đúng
- [ ] TabNavigator có PaymentCallbackScreen
- [ ] Test deep link bằng uri-scheme
- [ ] Kiểm tra logs trong console
- [ ] Thử HTTP URL thay vì custom scheme

---

## 🚀 **Giải pháp dự phòng:**

Nếu custom scheme không hoạt động, sử dụng HTTP URL:

```javascript
// Backend
vnp_ReturnUrl: 'http://192.168.100.246:8081/payment-callback'
```

Và cập nhật App.tsx để handle HTTP URL. 
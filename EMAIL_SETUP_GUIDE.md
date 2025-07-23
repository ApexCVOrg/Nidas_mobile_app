# 📧 Email Service Setup Guide

## 🎯 Current Status
- **Mock Email Service**: ✅ Working (for development/testing)
- **Real Email Service**: ⏳ Not configured

## 🚀 Quick Setup Options

### Option 1: Resend.com (Recommended - Free)
1. **Sign up**: [resend.com](https://resend.com)
2. **Get API key**: Dashboard → API Keys → Create
3. **Verify domain**: Add your domain or use their test domain
4. **Update config**:
   ```typescript
   const EMAIL_CONFIG = {
     API_KEY: 're_your_api_key_here',
     FROM_EMAIL: 'noreply@yourdomain.com',
   };
   ```

### Option 2: SendGrid (Free tier)
1. **Sign up**: [sendgrid.com](https://sendgrid.com)
2. **Get API key**: Settings → API Keys → Create
3. **Verify sender**: Settings → Sender Authentication
4. **Update config**:
   ```typescript
   const EMAIL_CONFIG = {
     API_KEY: 'SG.your_api_key_here',
     FROM_EMAIL: 'noreply@yourdomain.com',
   };
   ```

### Option 3: Mailgun (Free tier)
1. **Sign up**: [mailgun.com](https://mailgun.com)
2. **Get API key**: Dashboard → API Keys
3. **Verify domain**: Add your domain
4. **Update config**:
   ```typescript
   const EMAIL_CONFIG = {
     API_KEY: 'key-your_api_key_here',
     FROM_EMAIL: 'noreply@yourdomain.com',
   };
   ```

## 🔧 Implementation Steps

### Step 1: Choose a service
Pick one of the options above based on your needs:
- **Resend**: Simple, modern, 100 emails/day free
- **SendGrid**: Popular, 100 emails/day free
- **Mailgun**: Developer-friendly, 5,000 emails/month free

### Step 2: Get API credentials
1. Sign up for your chosen service
2. Get your API key
3. Verify your sending domain
4. Note your from email address

### Step 3: Update the code
1. Open `src/services/emailService.ts`
2. Replace the placeholder config:
   ```typescript
   const EMAIL_CONFIG = {
     API_KEY: 'your_actual_api_key',
     FROM_EMAIL: 'your_verified_email@domain.com',
   };
   ```

### Step 4: Enable real emails
1. Comment out the mock email code
2. Uncomment the real email code
3. Test with a real email address

## 📱 Testing

### Current (Mock Mode)
```bash
# Console output:
📧 Mock OTP email to: user@example.com
📧 Email data: {"message": "Your verification code is: 123456. Valid for 5 minutes.", "otp": "123456"}
🔐 Mock OTP for testing: 123456
```

### After Setup (Real Mode)
```bash
# Console output:
📧 Real OTP email sent to: user@example.com
# User receives actual email with OTP
```

## 🛠️ Troubleshooting

### Common Issues
1. **API Key Invalid**: Check your API key format
2. **Domain Not Verified**: Verify your sending domain
3. **Rate Limits**: Check your service's free tier limits
4. **Spam Filters**: Check spam folder for test emails

### Debug Steps
1. Check console logs for error messages
2. Verify API key is correct
3. Test with a simple email first
4. Check service dashboard for delivery status

## 💡 Pro Tips

### Development vs Production
- **Development**: Use mock emails for faster testing
- **Production**: Always use real email service

### Email Templates
The code includes beautiful HTML templates for:
- OTP verification emails
- Welcome emails
- Password reset emails

### Security
- Never commit API keys to git
- Use environment variables in production
- Rotate API keys regularly

## 🎉 Success Indicators

When properly configured, you should see:
- ✅ Real emails delivered to inbox
- ✅ Professional HTML email templates
- ✅ Proper error handling and fallbacks
- ✅ Console logs showing successful delivery

## 📞 Support

If you need help:
1. Check the service's documentation
2. Review error messages in console
3. Test with a simple email first
4. Verify all configuration steps

---

**Ready to send real emails? Choose a service and follow the steps above!** 🚀 
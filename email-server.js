const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'apexcvorg@gmail.com',
    pass: 'ajnw xlgp weul ekew',
  },
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, type } = req.body;
    
    const mailOptions = {
      from: 'apexcvorg@gmail.com',
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email sent successfully:', info.messageId);
    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email server is running' });
});

app.listen(PORT, () => {
  console.log(`📧 Email server running on port ${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/health`);
}); 
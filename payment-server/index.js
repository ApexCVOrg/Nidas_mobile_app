require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { VNPay, ProductCode } = require('vnpay');
const fs = require('fs');
const LOG_FILE = 'vnpay.log';

function logToFile(...args) {
  const msg = `[${new Date().toISOString()}] ` + args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ') + '\n';
  fs.appendFile(LOG_FILE, msg, err => { if (err) console.error('Log file error:', err); });
}

const app = express();
const port = 8000; // Fixed port to 8000

app.use(cors());
app.use(express.json());

// Khởi tạo VNPay với cấu hình nâng cao
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_SECRET,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: (data) => {
    console.log('[VNPAY LOG]:', data);
    logToFile('[VNPAY LOG]:', data);
  },
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  }
});

// Route tạo URL thanh toán
app.post('/api/payments/create', (req, res) => {
  const { amount, orderInfo, returnUrl } = req.body;
  console.log('[VNPAY][CREATE] Request:', { amount, orderInfo, returnUrl });
  logToFile('[VNPAY][CREATE] Request:', { amount, orderInfo, returnUrl });
  
  if (!amount || !orderInfo || !returnUrl) {
    console.log('[VNPAY][CREATE][ERROR] Thiếu thông tin thanh toán');
    logToFile('[VNPAY][CREATE][ERROR] Thiếu thông tin thanh toán');
    return res.status(400).json({ success: false, message: 'Thiếu thông tin thanh toán' });
  }
  
  try {
               const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount * 100, // VNPAY yêu cầu amount * 100
        vnp_IpAddr: req.ip,
        vnp_ReturnUrl: 'nidas://payment-callback', // Deep link về app Expo
        vnp_TxnRef: `ORDER_${Date.now()}`,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Other,
      });
    
    console.log('[VNPAY][CREATE] Payment URL:', paymentUrl);
    logToFile('[VNPAY][CREATE] Payment URL:', paymentUrl);
    res.json({ success: true, paymentUrl });
  } catch (error) {
    console.log('[VNPAY][CREATE][ERROR]:', error.message);
    logToFile('[VNPAY][CREATE][ERROR]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route xác thực kết quả thanh toán
app.get('/api/payments/verify', (req, res) => {
  console.log('[VNPAY][VERIFY] Query:', req.query);
  logToFile('[VNPAY][VERIFY] Query:', req.query);
  
  try {
    const verification = vnpay.verifyReturnUrl(req.query);
    console.log('[VNPAY][VERIFY] Result:', verification);
    logToFile('[VNPAY][VERIFY] Result:', verification);
    res.json(verification);
  } catch (error) {
    console.log('[VNPAY][VERIFY][ERROR]:', error.message);
    logToFile('[VNPAY][VERIFY][ERROR]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route lấy danh sách ngân hàng
app.get('/api/payments/banks', async (req, res) => {
  console.log('[VNPAY][BANKS] Requesting bank list');
  logToFile('[VNPAY][BANKS] Requesting bank list');
  
  try {
    const bankList = await vnpay.getBankList();
    console.log('[VNPAY][BANKS] Success:', bankList.length, 'banks found');
    logToFile('[VNPAY][BANKS] Success:', bankList.length, 'banks found');
    res.json({ success: true, banks: bankList });
  } catch (error) {
    console.log('[VNPAY][BANKS][ERROR]:', error.message);
    logToFile('[VNPAY][BANKS][ERROR]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route truy vấn giao dịch
app.get('/api/payments/query/:txnRef', async (req, res) => {
  const { txnRef } = req.params;
  console.log('[VNPAY][QUERY] Requesting transaction:', txnRef);
  logToFile('[VNPAY][QUERY] Requesting transaction:', txnRef);
  
  try {
    // Log params gửi đi
    const queryParams = { vnp_TxnRef: txnRef };
    console.log('[VNPAY][QUERY][DEBUG] Params gửi tới VNPAY:', queryParams);
    logToFile('[VNPAY][QUERY][DEBUG] Params gửi tới VNPAY:', queryParams);

    // Gọi VNPAY
    const queryResult = await vnpay.queryDr(queryParams);

    // Log response raw
    console.log('[VNPAY][QUERY][DEBUG] Response từ VNPAY:', queryResult);
    logToFile('[VNPAY][QUERY][DEBUG] Response từ VNPAY:', queryResult);

    // Log các trường quan trọng
    if (queryResult && queryResult.vnp_ResponseCode) {
      console.log(`[VNPAY][QUERY][DEBUG] vnp_ResponseCode: ${queryResult.vnp_ResponseCode}, vnp_Message: ${queryResult.vnp_Message}`);
      logToFile(`[VNPAY][QUERY][DEBUG] vnp_ResponseCode: ${queryResult.vnp_ResponseCode}, vnp_Message: ${queryResult.vnp_Message}`);
    }

    res.json({ success: true, result: queryResult });
  } catch (error) {
    console.log('[VNPAY][QUERY][ERROR]:', error.message);
    logToFile('[VNPAY][QUERY][ERROR]:', error.message);
    if (error && error.response) {
      // Nếu có response từ VNPAY
      console.log('[VNPAY][QUERY][ERROR][RESPONSE]:', error.response.data);
      logToFile('[VNPAY][QUERY][ERROR][RESPONSE]:', error.response.data);
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route xác thực IPN (Instant Payment Notification)
app.post('/api/payments/ipn', (req, res) => {
  console.log('[VNPAY][IPN] Received IPN:', req.body);
  logToFile('[VNPAY][IPN] Received IPN:', req.body);
  
  try {
    const ipnResult = vnpay.verifyIpnCall(req.body);
    console.log('[VNPAY][IPN] Verification result:', ipnResult);
    logToFile('[VNPAY][IPN] Verification result:', ipnResult);
    
    if (ipnResult.isSuccess && ipnResult.isVerified) {
      // Xử lý logic khi thanh toán thành công
      console.log('[VNPAY][IPN] Payment verified successfully');
      logToFile('[VNPAY][IPN] Payment verified successfully');
      
      // TODO: Cập nhật trạng thái đơn hàng trong database
      // TODO: Gửi email xác nhận cho khách hàng
      // TODO: Cập nhật inventory
    } else {
      console.log('[VNPAY][IPN] Payment verification failed');
      logToFile('[VNPAY][IPN] Payment verification failed');
    }
    
    res.json(ipnResult);
  } catch (error) {
    console.log('[VNPAY][IPN][ERROR]:', error.message);
    logToFile('[VNPAY][IPN][ERROR]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route kiểm tra trạng thái server
app.get('/api/payments/status', (req, res) => {
  res.json({ 
    success: true, 
    message: 'VNPAY Payment Server is running',
    timestamp: new Date().toISOString(),
    config: {
      tmnCode: process.env.VNP_TMNCODE ? 'Configured' : 'Not configured',
      secureSecret: process.env.VNP_SECRET ? 'Configured' : 'Not configured',
      testMode: true
    }
  });
});

app.listen(port, () => {
  console.log(`VNPay payment server listening at http://localhost:${port}`);
  logToFile(`VNPay payment server started at http://localhost:${port}`);
}); 
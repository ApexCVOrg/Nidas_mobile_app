const express = require('express');
const app = express();
const port = 8081;

// Serve a simple HTML page that redirects to the app
app.get('/payment-callback', (req, res) => {
  console.log('🌐 Web callback received:', req.query);
  
  // Extract query parameters
  const queryParams = new URLSearchParams(req.query).toString();
  
  // Create deep link to app
  const deepLink = `nidas://payment-callback?${queryParams}`;
  
  // HTML page that auto-redirects to app
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Redirecting to App...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                text-align: center;
                padding: 20px;
                background: rgba(255,255,255,0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .spinner {
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .button {
                background: white;
                color: #667eea;
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                text-decoration: none;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🔄 Đang chuyển về ứng dụng...</h2>
            <div class="spinner"></div>
            <p>Vui lòng chờ trong giây lát...</p>
            <a href="${deepLink}" class="button">Mở ứng dụng ngay</a>
        </div>
        
        <script>
            // Auto redirect after 3 seconds
            setTimeout(() => {
                window.location.href = '${deepLink}';
            }, 3000);
            
            // Also try to open app immediately
            window.location.href = '${deepLink}';
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Payment Callback Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🌐 Web callback server listening at http://localhost:${port}`);
  console.log(`🔗 Callback URL: http://192.168.100.246:${port}/payment-callback`);
}); 
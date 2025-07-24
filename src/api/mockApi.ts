import axios from 'axios';

const API_URL = 'http://192.168.100.246:3000'; // Thay <YOUR_IP> bằng IP máy tính của bạn

// USERS
export const getUsers = () => axios.get(`${API_URL}/users`);
export const createUser = (user: any) => axios.post(`${API_URL}/users`, user);
export const updateUser = (id: string, user: any) => axios.put(`${API_URL}/users/${id}`, user);
export const deleteUser = (id: string) => axios.delete(`${API_URL}/users/${id}`);

// Đăng nhập bằng username hoặc email, kiểm tra password và xác thực email
export const loginUser = async ({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }) => {
  // Lấy toàn bộ users
  const res = await getUsers();
  const users = res.data;
  // Tìm user theo username hoặc email
  const user = users.find((u: any) =>
    u.username === usernameOrEmail || u.email === usernameOrEmail
  );
  if (!user) {
    throw new Error('Tài khoản không tồn tại');
  }
  if (user.isBanned === true) {
    throw new Error('Tài khoản của bạn đã bị khóa bởi admin');
  }
  if (!user.isEmailVerified) {
    throw new Error('Tài khoản chưa xác thực email. Vui lòng kiểm tra email để xác thực.');
  }
  if (user.password !== password) {
    throw new Error('Mật khẩu không đúng');
  }
  // Tạo token mock
  const token = `mock_token_${user.id}_${Date.now()}`;
  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        username: user.username
      }
    }
  };
};

// Lấy thông tin user và address theo userId
export const getUserWithAddresses = async (userId: string) => {
  const [usersRes, addressesRes] = await Promise.all([
    getUsers(),
    axios.get(`${API_URL}/addresses`)
  ]);
  const user = usersRes.data.find((u: any) => u.id === userId);
  const addresses = addressesRes.data.filter((a: any) => a.userId === userId);
  return { user, addresses };
};

// PRODUCTS
export const getProducts = () => axios.get(`${API_URL}/products`);
export const createProduct = (product: any) => axios.post(`${API_URL}/products`, product);
export const updateProduct = (id: string, product: any) => axios.put(`${API_URL}/products/${id}`, product);
export const deleteProduct = (id: string) => axios.delete(`${API_URL}/products/${id}`);

// Lấy toàn bộ products từ mock API
export const getAllProducts = async () => {
  const res = await getProducts();
  return res.data;
};

// ORDERS
export const getOrders = () => axios.get(`${API_URL}/orders`);
export const createOrder = (order: any) => axios.post(`${API_URL}/orders`, order);
export const updateOrder = (id: string, order: any) => axios.put(`${API_URL}/orders/${id}`, order);
export const deleteOrder = (id: string) => axios.delete(`${API_URL}/orders/${id}`); 

// CHAT & MESSAGING
export const getChats = () => axios.get(`${API_URL}/chats`);
export const getChatById = (chatId: string) => axios.get(`${API_URL}/chats/${chatId}`);
export const createChat = (chat: any) => axios.post(`${API_URL}/chats`, chat);
export const updateChat = (id: string, chat: any) => axios.put(`${API_URL}/chats/${id}`, chat);

export const getMessages = (chatId: string) => axios.get(`${API_URL}/messages?chatId=${chatId}`);
export const sendMessage = (message: any) => axios.post(`${API_URL}/messages`, message);
export const markMessageAsRead = (messageId: string) => axios.patch(`${API_URL}/messages/${messageId}`, { isRead: true });

// FAQ & BOT
export const getFaq = () => axios.get(`${API_URL}/faq`);
export const searchFaq = (query: string) => axios.get(`${API_URL}/faq?q=${query}`);
export const getPolicies = () => axios.get(`${API_URL}/policies`);

// Bot response function
export const getBotResponse = async (userMessage: string) => {
  try {
    const [faqResponse, productsResponse, policiesResponse] = await Promise.all([
      getFaq(),
      getProducts(),
      axios.get(`${API_URL}/policies`)
    ]);
    
    const faqData = faqResponse.data;
    const productsData = productsResponse.data;
    const policiesData = policiesResponse.data;
    
    // Import utility functions
    const { analyzeUserIntent, calculateSimilarity, generateKeywordVariants } = await import('../utils/textProcessor');
    
    // Phân tích ý định người dùng
    const userIntent = analyzeUserIntent(userMessage);
    console.log('User intent:', userIntent);
    
    const userMessageLower = userMessage.toLowerCase();
    
    // Tìm câu trả lời phù hợp nhất dựa trên ý định
    let bestMatch = null;
    let bestScore = 0;
    let responseType = 'faq';
    
    // 1. Kiểm tra FAQ trước với xử lý thông minh hơn
    faqData.forEach((faq: any) => {
      let score = 0;
      
      // Kiểm tra keywords với xử lý không dấu
      if (faq.keywords && Array.isArray(faq.keywords)) {
        faq.keywords.forEach((keyword: string) => {
          const keywordScore = calculateSimilarity(userMessage, keyword);
          score += keywordScore;
        });
      }
      
      // Kiểm tra category
      if (faq.category) {
        const categoryScore = calculateSimilarity(userMessage, faq.category);
        score += categoryScore;
      }
      
      // Kiểm tra question
      if (faq.question) {
        const questionScore = calculateSimilarity(userMessage, faq.question);
        score += questionScore * 2; // Trọng số cao hơn cho câu hỏi
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { ...faq, type: 'faq' };
      }
    });
    
    // 2. Kiểm tra sản phẩm với xử lý thông minh hơn
    if (userIntent.intent === 'product_inquiry' || userIntent.confidence > 0.3) {
      productsData.forEach((product: any) => {
        let score = 0;
        
        // Kiểm tra tên sản phẩm
        const nameScore = calculateSimilarity(userMessage, product.name);
        score += nameScore * 3; // Trọng số cao cho tên sản phẩm
        
        // Kiểm tra brand
        const brandScore = calculateSimilarity(userMessage, product.brand);
        score += brandScore * 2;
        
        // Kiểm tra category
        const categoryScore = calculateSimilarity(userMessage, product.category);
        score += categoryScore * 2;
        
        // Kiểm tra tags
        if (product.tags) {
          product.tags.forEach((tag: string) => {
            const tagScore = calculateSimilarity(userMessage, tag);
            score += tagScore;
          });
        }
        
        // Kiểm tra description
        if (product.description) {
          const descScore = calculateSimilarity(userMessage, product.description);
          score += descScore * 0.5;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { ...product, type: 'product' };
        }
      });
    }
    
    // 3. Kiểm tra chính sách dựa trên ý định
    if (userIntent.intent === 'shipping_policy' || userIntent.intent === 'return_policy' || 
        userIntent.intent === 'warranty_policy' || userIntent.intent === 'payment_method' || 
        userIntent.intent === 'size_guide') {
      
      // Shipping policy
      if (userIntent.intent === 'shipping_policy') {
        const shipping = policiesData.shipping;
        bestMatch = {
          type: 'policy',
          category: 'shipping',
          content: `📦 **Chính sách giao hàng:**
• Miễn phí vận chuyển cho đơn hàng từ ${shipping.free_shipping_threshold.toLocaleString()}đ
• Phí vận chuyển tiêu chuẩn: ${shipping.standard_shipping.toLocaleString()}đ
• Phí vận chuyển nhanh: ${shipping.express_shipping.toLocaleString()}đ
• Thời gian giao hàng tiêu chuẩn: ${shipping.delivery_time.standard}
• Thời gian giao hàng nhanh: ${shipping.delivery_time.express}`
        };
        bestScore = 10;
      }
      
      // Returns policy
      if (userIntent.intent === 'return_policy') {
        const returns = policiesData.returns;
        bestMatch = {
          type: 'policy',
          category: 'returns',
          content: `🔄 **Chính sách đổi trả:**
• Thời gian đổi trả: ${returns.return_period}
• Điều kiện đổi trả:
${returns.conditions.map((condition: string) => `  - ${condition}`).join('\n')}
• Thời gian hoàn tiền: ${returns.refund_time}
• Phí vận chuyển đổi trả: ${returns.return_shipping}`
        };
        bestScore = 10;
      }
      
      // Warranty policy
      if (userIntent.intent === 'warranty_policy') {
        const warranty = policiesData.warranty;
        bestMatch = {
          type: 'policy',
          category: 'warranty',
          content: `🛡️ **Chính sách bảo hành:**
• Thời gian bảo hành: ${warranty.period}
• Phạm vi bảo hành:
${warranty.coverage.map((item: string) => `  - ${item}`).join('\n')}
• Không bảo hành:
${warranty.exclusions.map((item: string) => `  - ${item}`).join('\n')}`
        };
        bestScore = 10;
      }
      
      // Payment policy
      if (userIntent.intent === 'payment_method') {
        const payment = policiesData.payment;
        bestMatch = {
          type: 'policy',
          category: 'payment',
          content: `💳 **Phương thức thanh toán:**
${payment.methods.map((method: string) => `• ${method}`).join('\n')}
${payment.installment.available ? `
🔄 **Trả góp:**
• Có sẵn trả góp qua: ${payment.installment.partners.join(', ')}
• Kỳ hạn: ${payment.installment.terms}` : ''}`
        };
        bestScore = 10;
      }
      
      // Size guide
      if (userIntent.intent === 'size_guide') {
        const sizeGuide = policiesData.size_guide;
        bestMatch = {
          type: 'policy',
          category: 'size',
          content: `📏 **Hướng dẫn chọn size:**
${sizeGuide.measurement_guide}

**Bảng quy đổi size:**
${Object.entries(sizeGuide.eu_to_vn).map(([eu, vn]) => `• EU ${eu} = ${vn}`).join('\n')}`
        };
        bestScore = 10;
      }
    }
    
    // Trả về câu trả lời phù hợp với ngưỡng thấp hơn cho xử lý không dấu
    if (bestMatch && bestScore >= 1) {
      if (bestMatch.type === 'product') {
        const product = bestMatch as any;
        return {
          success: true,
          data: {
            content: `👟 **${product.name}**
💰 Giá: ${product.price.toLocaleString()}đ ${product.discount ? `(Giảm ${product.discount}%)` : ''}
📝 Mô tả: ${product.description}
🎯 Tính năng:
${product.features.map((feature: string) => `• ${feature}`).join('\n')}
📊 Đánh giá: ⭐ ${product.rating}/5 (${product.reviews} đánh giá)
📦 Còn lại: ${product.stock} sản phẩm
🎨 Màu sắc: ${product.colors.join(', ')}
📏 Size có sẵn: ${product.sizes.join(', ')}`,
            question: `Thông tin sản phẩm ${product.name}`,
            category: 'product'
          }
        };
      } else if (bestMatch.type === 'policy') {
        const policy = bestMatch as any;
        return {
          success: true,
          data: {
            content: policy.content,
            question: `Chính sách ${policy.category}`,
            category: 'policy'
          }
        };
      } else {
        const faq = bestMatch as any;
        return {
          success: true,
          data: {
            content: faq.answer,
            question: faq.question,
            category: faq.category
          }
        };
      }
    }
    
    // Câu trả lời mặc định thông minh hơn dựa trên ý định
    let defaultResponse = "";
    
    if (userIntent.intent === 'greeting') {
      defaultResponse = "Xin chào! 👋 Tôi là trợ lý ảo của Nidas. Tôi có thể giúp bạn với:\n\n• 👟 Thông tin sản phẩm (Ultraboost, Handball, Stan Smith, Climacool, Samba)\n• 📦 Chính sách giao hàng, đổi trả, bảo hành\n• 📏 Hướng dẫn chọn size\n• 💳 Phương thức thanh toán và trả góp\n\nBạn muốn biết thông tin gì?";
    } else if (userIntent.intent === 'complaint') {
      defaultResponse = "Tôi rất tiếc về trải nghiệm không tốt của bạn. 😔 Để hỗ trợ tốt nhất, vui lòng cho tôi biết:\n\n• Vấn đề cụ thể bạn gặp phải\n• Mã đơn hàng (nếu có)\n• Thời gian xảy ra vấn đề\n\nTôi sẽ chuyển thông tin cho nhân viên hỗ trợ để giải quyết nhanh chóng.";
    } else {
      const defaultResponses = [
        "Tôi có thể giúp bạn với:\n• 👟 Thông tin sản phẩm (Ultraboost, Handball, Stan Smith, Climacool, Samba)\n• 📦 Chính sách giao hàng, đổi trả, bảo hành\n• 📏 Hướng dẫn chọn size\n• 💳 Phương thức thanh toán và trả góp\n\nBạn muốn biết thông tin gì?",
        "Chào bạn! Tôi là trợ lý ảo của Nidas. Tôi có thể tư vấn về:\n• Các dòng giày Adidas\n• Chính sách mua hàng\n• Hướng dẫn sử dụng\n• Khuyến mãi hiện tại\n\nHãy hỏi tôi bất cứ điều gì!",
        "Xin chào! Tôi sẵn sàng hỗ trợ bạn với mọi thắc mắc về sản phẩm và dịch vụ của chúng tôi. Bạn có thể hỏi bằng tiếng Việt có dấu hoặc không dấu đều được."
      ];
      defaultResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    return {
      success: true,
      data: {
        content: defaultResponse,
        question: "Hướng dẫn chung",
        category: "general"
      }
    };
    
  } catch (error) {
    console.error('Bot response error:', error);
    return {
      success: false,
      data: {
        content: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ với nhân viên hỗ trợ qua số điện thoại: 1900-xxxx.",
        question: "Lỗi hệ thống",
        category: "error"
      }
    };
  }
}; 

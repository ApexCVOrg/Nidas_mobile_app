// Utility functions for text processing
export const normalizeText = (text: string): string => {
  // Chuyển về chữ thường
  let normalized = text.toLowerCase();
  
  // Loại bỏ dấu tiếng Việt
  const vietnameseMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd'
  };

  // Thay thế các ký tự có dấu
  Object.keys(vietnameseMap).forEach(char => {
    normalized = normalized.replace(new RegExp(char, 'g'), vietnameseMap[char]);
  });

  return normalized;
};

// Tạo các biến thể của từ khóa
export const generateKeywordVariants = (keyword: string): string[] => {
  const variants = [keyword];
  
  // Thêm biến thể không dấu
  const noAccent = normalizeText(keyword);
  if (noAccent !== keyword) {
    variants.push(noAccent);
  }
  
  // Thêm biến thể viết tắt phổ biến
  const commonAbbreviations: { [key: string]: string[] } = {
    'giay': ['giày', 'giay'],
    'giày': ['giay', 'giày'],
    'san pham': ['sản phẩm', 'san pham'],
    'sản phẩm': ['san pham', 'sản phẩm'],
    'chinh sach': ['chính sách', 'chinh sach'],
    'chính sách': ['chinh sach', 'chính sách'],
    'giao hang': ['giao hàng', 'giao hang'],
    'giao hàng': ['giao hang', 'giao hàng'],
    'doi tra': ['đổi trả', 'doi tra'],
    'đổi trả': ['doi tra', 'đổi trả'],
    'bao hanh': ['bảo hành', 'bao hanh'],
    'bảo hành': ['bao hanh', 'bảo hành'],
    'thanh toan': ['thanh toán', 'thanh toan'],
    'thanh toán': ['thanh toan', 'thanh toán'],
    'kich thuoc': ['kích thước', 'kich thuoc'],
    'kích thước': ['kich thuoc', 'kích thước'],
    'so giay': ['số giày', 'so giay'],
    'số giày': ['so giay', 'số giày']
  };
  
  const normalizedKeyword = normalizeText(keyword);
  if (commonAbbreviations[normalizedKeyword]) {
    variants.push(...commonAbbreviations[normalizedKeyword]);
  }
  
  return [...new Set(variants)]; // Loại bỏ trùng lặp
};

// Tính điểm tương đồng giữa tin nhắn và từ khóa
export const calculateSimilarity = (message: string, keyword: string): number => {
  const normalizedMessage = normalizeText(message);
  const keywordVariants = generateKeywordVariants(keyword);
  
  let maxScore = 0;
  
  keywordVariants.forEach(variant => {
    const normalizedVariant = normalizeText(variant);
    
    // Kiểm tra chính xác
    if (normalizedMessage.includes(normalizedVariant)) {
      maxScore = Math.max(maxScore, normalizedVariant.length * 2);
    }
    
    // Kiểm tra từng từ
    const messageWords = normalizedMessage.split(/\s+/);
    const variantWords = normalizedVariant.split(/\s+/);
    
    variantWords.forEach(variantWord => {
      messageWords.forEach(messageWord => {
        if (messageWord.includes(variantWord) || variantWord.includes(messageWord)) {
          maxScore = Math.max(maxScore, Math.min(messageWord.length, variantWord.length));
        }
      });
    });
  });
  
  return maxScore;
};

// Tìm từ khóa phù hợp nhất trong danh sách
export const findBestMatch = (message: string, keywords: string[]): { keyword: string; score: number } => {
  let bestMatch = { keyword: '', score: 0 };
  
  keywords.forEach(keyword => {
    const score = calculateSimilarity(message, keyword);
    if (score > bestMatch.score) {
      bestMatch = { keyword, score };
    }
  });
  
  return bestMatch;
};

// Xử lý tin nhắn người dùng để tìm ý định
export const analyzeUserIntent = (message: string): {
  intent: string;
  confidence: number;
  entities: string[];
} => {
  const normalizedMessage = normalizeText(message);
  const entities: string[] = [];
  
  // Định nghĩa các ý định và từ khóa
  const intents = {
    product_inquiry: {
      keywords: ['giay', 'giày', 'ultraboost', 'handball', 'stan smith', 'climacool', 'samba', 'adidas', 'nike', 'san pham', 'sản phẩm'],
      score: 0
    },
    shipping_policy: {
      keywords: ['giao hang', 'giao hàng', 'van chuyen', 'vận chuyển', 'phi ship', 'phí ship', 'thoi gian giao', 'thời gian giao'],
      score: 0
    },
    return_policy: {
      keywords: ['doi tra', 'đổi trả', 'hoan tien', 'hoàn tiền', 'tra hang', 'trả hàng', 'refund'],
      score: 0
    },
    warranty_policy: {
      keywords: ['bao hanh', 'bảo hành', 'warranty', 'hong', 'hỏng', 'loi', 'lỗi'],
      score: 0
    },
    payment_method: {
      keywords: ['thanh toan', 'thanh toán', 'payment', 'tra gop', 'trả góp', 'installment', 'the', 'thẻ'],
      score: 0
    },
    size_guide: {
      keywords: ['size', 'kich thuoc', 'kích thước', 'so giay', 'số giày', 'measurement', 'ban do', 'bản đồ'],
      score: 0
    },
    greeting: {
      keywords: ['xin chao', 'xin chào', 'hello', 'hi', 'chao', 'chào'],
      score: 0
    },
    complaint: {
      keywords: ['phien', 'phiền', 'khong hai long', 'không hài lòng', 'loi', 'lỗi', 'sai', 'wrong'],
      score: 0
    }
  };
  
  // Tính điểm cho từng ý định
  Object.keys(intents).forEach(intentKey => {
    const intent = intents[intentKey as keyof typeof intents];
    intent.keywords.forEach(keyword => {
      const score = calculateSimilarity(normalizedMessage, keyword);
      intent.score += score;
      
      if (score > 0) {
        entities.push(keyword);
      }
    });
  });
  
  // Tìm ý định có điểm cao nhất
  let bestIntent = 'general';
  let bestScore = 0;
  
  Object.keys(intents).forEach(intentKey => {
    const intent = intents[intentKey as keyof typeof intents];
    if (intent.score > bestScore) {
      bestScore = intent.score;
      bestIntent = intentKey;
    }
  });
  
  return {
    intent: bestIntent,
    confidence: bestScore / 10, // Chuẩn hóa điểm về thang 0-1
    entities: [...new Set(entities)] // Loại bỏ trùng lặp
  };
}; 
// Demo file để test các tính năng xử lý text
import { 
  normalizeText, 
  generateKeywordVariants, 
  calculateSimilarity, 
  analyzeUserIntent 
} from './textProcessor';

// Test cases cho việc xử lý tin nhắn không dấu
export const testTextProcessing = () => {
  console.log('=== TEST TEXT PROCESSING ===');
  
  // Test normalizeText
  console.log('1. Test normalizeText:');
  console.log('"Xin chào" ->', normalizeText('Xin chào'));
  console.log('"GIAY ADIDAS" ->', normalizeText('GIAY ADIDAS'));
  console.log('"Đổi trả hàng" ->', normalizeText('Đổi trả hàng'));
  
  // Test generateKeywordVariants
  console.log('\n2. Test generateKeywordVariants:');
  console.log('"giày" ->', generateKeywordVariants('giày'));
  console.log('"chính sách" ->', generateKeywordVariants('chính sách'));
  console.log('"giao hàng" ->', generateKeywordVariants('giao hàng'));
  
  // Test calculateSimilarity
  console.log('\n3. Test calculateSimilarity:');
  console.log('"xin chao" vs "xin chào" ->', calculateSimilarity('xin chao', 'xin chào'));
  console.log('"giay adidas" vs "giày adidas" ->', calculateSimilarity('giay adidas', 'giày adidas'));
  console.log('"doi tra" vs "đổi trả" ->', calculateSimilarity('doi tra', 'đổi trả'));
  
  // Test analyzeUserIntent
  console.log('\n4. Test analyzeUserIntent:');
  
  const testMessages = [
    'xin chao',
    'XIN CHAO',
    'giay ultraboost',
    'giày ultraboost',
    'chinh sach giao hang',
    'chính sách giao hàng',
    'doi tra hang',
    'đổi trả hàng',
    'bao hanh',
    'bảo hành',
    'thanh toan',
    'thanh toán',
    'size giay',
    'số giày',
    'phien qua',
    'phiền quá'
  ];
  
  testMessages.forEach(message => {
    const intent = analyzeUserIntent(message);
    console.log(`"${message}" -> Intent: ${intent.intent}, Confidence: ${intent.confidence.toFixed(2)}`);
  });
};

// Export để có thể gọi từ console
export default testTextProcessing; 
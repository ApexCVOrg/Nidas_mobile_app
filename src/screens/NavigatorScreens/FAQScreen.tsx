import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFaq, searchFaq } from '../../api/mockApi';

interface FAQ {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
  priority: number;
}

const FAQScreen: React.FC = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchQuery, selectedCategory]);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      const response = await getFaq();
      const sortedFaqs = response.data.sort((a: FAQ, b: FAQ) => b.priority - a.priority);
      setFaqs(sortedFaqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      Alert.alert('Lỗi', 'Không thể tải câu hỏi thường gặp');
    } finally {
      setIsLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    setFilteredFaqs(filtered);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      filterFAQs();
      return;
    }

    try {
      const response = await searchFaq(searchQuery);
      setFilteredFaqs(response.data);
    } catch (error) {
      console.error('Error searching FAQs:', error);
      filterFAQs(); // Fallback to local filtering
    }
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const getCategories = () => {
    const categories = ['all', ...new Set(faqs.map(faq => faq.category))];
    return categories;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sản phẩm': return 'inventory';
      case 'đổi trả': return 'swap-horiz';
      case 'giao hàng': return 'local-shipping';
      case 'thanh toán': return 'payment';
      case 'đặt hàng': return 'shopping-cart';
      case 'kích thước': return 'straighten';
      case 'chất lượng': return 'verified';
      case 'bảo hành': return 'build';
      case 'khuyến mãi': return 'local-offer';
      case 'tài khoản': return 'account-circle';
      default: return 'help';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sản phẩm': return '#2196F3';
      case 'đổi trả': return '#FF9800';
      case 'giao hàng': return '#4CAF50';
      case 'thanh toán': return '#9C27B0';
      case 'đặt hàng': return '#607D8B';
      case 'kích thước': return '#795548';
      case 'chất lượng': return '#E91E63';
      case 'bảo hành': return '#FF5722';
      case 'khuyến mãi': return '#FFC107';
      case 'tài khoản': return '#3F51B5';
      default: return '#666';
    }
  };

  const renderCategoryItem = ({ item }: { item: string }) => {
    const isSelected = selectedCategory === item;
    const displayName = item === 'all' ? 'Tất cả' : item;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategoryItem,
          { borderColor: getCategoryColor(item) }
        ]}
        onPress={() => setSelectedCategory(item)}
      >
        <Ionicons 
          name={getCategoryIcon(item) as any} 
          size={20} 
          color={isSelected ? getCategoryColor(item) : '#666'} 
        />
        <Text style={[
          styles.categoryText,
          isSelected && { color: getCategoryColor(item) }
        ]}>
          {displayName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFAQItem = ({ item }: { item: FAQ }) => {
    const isExpanded = expandedFaq === item.id;
    
    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqItemHeader}
          onPress={() => toggleFaq(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqQuestionContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
              <Ionicons name={getCategoryIcon(item.category) as any} size={12} color="white" />
            </View>
            <Text style={styles.faqQuestion} numberOfLines={isExpanded ? undefined : 2}>
              {item.question}
            </Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.answerText}>{item.answer}</Text>
            <View style={styles.keywordsContainer}>
              <Text style={styles.keywordsLabel}>Từ khóa:</Text>
              <View style={styles.keywordsList}>
                {item.keywords.slice(0, 3).map((keyword, index) => (
                  <View key={index} style={styles.keywordTag}>
                    <Text style={styles.keywordText}>{keyword}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải câu hỏi thường gặp...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
        <TouchableOpacity onPress={loadFAQs}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={getCategories()}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* FAQ List */}
      <View style={styles.faqContainer}>
        <View style={styles.faqHeader}>
          <Text style={styles.faqCount}>
            {filteredFaqs.length} câu hỏi
            {searchQuery && ` cho "${searchQuery}"`}
            {selectedCategory !== 'all' && ` trong "${selectedCategory}"`}
          </Text>
        </View>
        
        <FlatList
          data={filteredFaqs}
          renderItem={renderFAQItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="help-circle-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? `Không tìm thấy câu hỏi cho "${searchQuery}"`
                  : 'Không có câu hỏi nào'
                }
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f8ff',
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  faqContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  faqHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqCount: {
    fontSize: 14,
    color: '#666',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  faqQuestionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  keywordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keywordsLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  keywordText: {
    fontSize: 11,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FAQScreen; 
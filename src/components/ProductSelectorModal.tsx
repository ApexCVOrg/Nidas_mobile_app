import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../api/mockApi';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  discount?: number;
  originalPrice?: number;
  imageDefault?: string;
  collections?: string[];
  features?: string[];
  specifications?: any;
  tags?: string[];
  images?: string[];
}

interface ProductSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSendProduct: (product: Product) => void;
}

const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  visible,
  onClose,
  onSendProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadProducts();
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      console.log('Products loaded from db.json:', response.data.length);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error loading products from db.json:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm từ database');
    } finally {
      setLoading(false);
    }
  };

  const handleSendProduct = (product: Product) => {
    onSendProduct(product);
    onClose();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleSendProduct(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()}đ
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleSendProduct(item)}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chọn sản phẩm</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {loading ? 'Đang tải sản phẩm...' : 'Không tìm thấy sản phẩm'}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  productList: {
    paddingHorizontal: 15,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 11,
    color: '#999',
    lineHeight: 14,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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

export default ProductSelectorModal;

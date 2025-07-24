import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../services/mockApi';
import { Product } from '../../types/Product';

const ProductManagement: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [editSelectedColors, setEditSelectedColors] = useState<string[]>([]);
  const [editSelectedSizes, setEditSelectedSizes] = useState<(number | string)[]>([]);
  const [editStockQuantities, setEditStockQuantities] = useState<{[key: string]: number}>({});
  
  // Thêm state cho modal thêm sản phẩm
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<any>({
    name: '',
    category: '',
    gender: '',
    type: '',
    price: '',
    description: '',
    imageDefault: '',
    imageByColor: {},
    colors: [],
    sizes: [],
    tags: [],
    brand: '',
    subtitle: '',
    rating: 0,
    quantityBySize: {},
    stockByColorSize: {},
    collections: [],
  });

  // State cho việc chọn màu và size
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<(number | string)[]>([]);
  const [stockQuantities, setStockQuantities] = useState<{[key: string]: number}>({});

  // State cho search và sort
  const [searchText, setSearchText] = useState('');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');

  // Danh sách category có sẵn (dựa trên dữ liệu thực tế)
  const categories = ['giay', 'men', 'women', 'kids', 'sport', 'accessories', 'quan_ao'];
  const genders = ['nam', 'nu', 'unisex'];
  const types = ['originals', 'sport', 'casual', 'formal'];
  const brands = ['Adidas', 'Nike', 'Puma', 'Under Armour'];
  
  // Danh sách màu cơ bản
  const basicColors = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'gray'];
  
  // Hàm lấy danh sách size dựa trên category
  const getAvailableSizes = (category: string) => {
    if (category === 'giay') {
      return [36, 37, 38, 39, 40, 41, 42];
    } else {
      // Các category khác (men, women, kids, sport, accessories, quan_ao) sử dụng size chữ
      return ['S', 'M', 'L', 'XL'];
    }
  };

  // 1. Thêm collections vào state newProduct, editFields
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [newCollectionInput, setNewCollectionInput] = useState('');

  // Khi fetchProducts, tổng hợp tất cả collection từ sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await mockApi.getProducts();
      let products = response.data.products as Product[];
      // Sản phẩm mới nhất lên đầu (id dạng p+timestamp)
      products = products.sort((a, b) => (b.id > a.id ? 1 : -1));
      setProducts(products);
      // Tổng hợp collection như cũ
      const collectionSet = new Set<string>();
      products.forEach(p => p.collections?.forEach((c: string) => collectionSet.add(c)));
      setAllCollections(Array.from(collectionSet));
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleEditPress = (product: Product) => {
    setEditingProduct(product);
    setEditFields({
      name: product.name,
      price: product.price,
      category: product.category,
      gender: product.gender,
      type: product.type,
      brand: product.brand,
      subtitle: product.subtitle,
      imageDefault: product.imageDefault,
      description: product.description,
      tags: product.tags || [],
      collections: product.collections || [],
    });
    setEditSelectedColors(product.colors || []);
    setEditSelectedSizes(product.sizes || []);
    // Fill số lượng từng màu-size
    setEditStockQuantities((product as any).stockByColorSize || {});
    setEditModalVisible(true);
  };

  // Hàm xử lý chọn/bỏ chọn màu khi edit
  const handleEditColorToggle = (color: string) => {
    setEditSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Hàm xử lý chọn/bỏ chọn size khi edit
  const handleEditSizeToggle = (size: number | string) => {
    setEditSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Hàm xử lý thay đổi số lượng khi edit
  const handleEditQuantityChange = (colorSizeKey: string, quantity: string) => {
    setEditStockQuantities(prev => ({
      ...prev,
      [colorSizeKey]: parseInt(quantity) || 0
    }));
  };

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFields((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'category') {
      setEditSelectedSizes([]);
      setEditStockQuantities({});
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    if (!editFields.name || !editFields.price || !editFields.category) {
      Alert.alert('Error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (editSelectedColors.length === 0) {
      Alert.alert('Error', 'Vui lòng chọn ít nhất một màu');
      return;
    }
    if (editSelectedSizes.length === 0) {
      Alert.alert('Error', 'Vui lòng chọn ít nhất một kích thước');
      return;
    }
    setEditLoading(true);
    try {
      // Tạo lại quantityBySize và stockByColorSize
      const quantityBySize: any = {};
      const stockByColorSize: any = {};
      const imageByColor: any = {};
      editSelectedSizes.forEach((size: number | string) => {
        quantityBySize[size] = 0;
        editSelectedColors.forEach((color: string) => {
          const colorSizeKey = `${color}-${size}`;
          const quantity = editStockQuantities[colorSizeKey] || 10;
          stockByColorSize[colorSizeKey] = quantity;
          quantityBySize[size] += quantity;
          imageByColor[color] = editFields.imageDefault || '';
        });
      });
      const updateData = {
        ...editFields,
        price: String((editFields.price || '').replace(/[^0-9]/g, '')),
        colors: editSelectedColors,
        sizes: editSelectedSizes,
        tags: editFields.tags || [],
        quantityBySize,
        stockByColorSize,
        imageByColor,
      };
      await mockApi.updateProduct(editingProduct.id, updateData);
      setEditModalVisible(false);
      setEditingProduct(null);
      setEditFields({});
      setEditSelectedColors([]);
      setEditSelectedSizes([]);
      setEditStockQuantities({});
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  // Thêm hàm xử lý thêm sản phẩm
  const handleAddPress = () => {
    setNewProduct({
      name: '',
      category: '',
      gender: '',
      type: '',
      price: '',
      description: '',
      imageDefault: '',
      imageByColor: {},
      colors: [],
      sizes: [],
      tags: [],
      brand: '',
      subtitle: '',
      rating: 0,
      quantityBySize: {},
      stockByColorSize: {},
      collections: [],
    });
    setSelectedColors([]);
    setSelectedSizes([]);
    setStockQuantities({});
    setAddModalVisible(true);
  };

  const handleNewProductChange = (field: string, value: string | number | any) => {
    setNewProduct((prev: any) => ({ ...prev, [field]: value }));
    
    // Reset selectedSizes khi category thay đổi
    if (field === 'category') {
      setSelectedSizes([]);
      setStockQuantities({});
    }
  };

  // Hàm xử lý chọn/bỏ chọn màu
  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Hàm xử lý chọn/bỏ chọn size
  const handleSizeToggle = (size: number | string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (colorSizeKey: string, quantity: string) => {
    setStockQuantities(prev => ({
      ...prev,
      [colorSizeKey]: parseInt(quantity) || 0
    }));
  };

  // Hàm format giá theo dạng 3 số có dấu phẩy
  const formatPrice = (value: string) => {
    // Loại bỏ ký tự không phải số
    const numeric = value.replace(/[^0-9]/g, '');
    // Format lại theo dạng 3 số có dấu phẩy
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Hàm format giá khi hiển thị
  const displayPrice = (price: string | number) => {
    const numeric = String(price).replace(/[^0-9]/g, '');
    if (!numeric) return '0 VNĐ';
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  // 2. UI chọn collections trong form thêm/sửa
  const handleAddCollection = () => {
    if (newCollectionInput && !allCollections.includes(newCollectionInput)) {
      setAllCollections([...allCollections, newCollectionInput]);
    }
    setNewProduct((prev: any) => ({
      ...prev,
      collections: [...prev.collections, newCollectionInput]
    }));
    setNewCollectionInput('');
  };

  const handleRemoveCollection = (collection: string) => {
    setNewProduct((prev: any) => ({
      ...prev,
      collections: prev.collections.filter((c: string) => c !== collection)
    }));
  };

  const handleEditCollection = (collection: string) => {
    Alert.prompt('Sửa collection', 'Nhập tên collection mới', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Lưu',
        onPress: (text) => {
          if (text) {
            setAllCollections(prev => prev.map(c => c === collection ? text : c));
            setNewProduct((prev: any) => ({
              ...prev,
              collections: prev.collections.map((c: string) => c === collection ? text : c)
            }));
          }
        },
      },
    ]);
  };

  const handleSaveNewProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      Alert.alert('Error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (selectedColors.length === 0) {
      Alert.alert('Error', 'Vui lòng chọn ít nhất một màu');
      return;
    }

    if (selectedSizes.length === 0) {
      Alert.alert('Error', 'Vui lòng chọn ít nhất một kích thước');
      return;
    }

    setAddLoading(true);
    try {
      // Tạo ID theo format p + số
      const productId = `p${Date.now()}`;
      
      // Tạo quantityBySize và stockByColorSize từ dữ liệu đã chọn
      const quantityBySize: any = {};
      const stockByColorSize: any = {};
      const imageByColor: any = {};
      
             selectedSizes.forEach((size: number | string) => {
         quantityBySize[size] = 0; // Sẽ tính tổng sau
         selectedColors.forEach((color: string) => {
           const colorSizeKey = `${color}-${size}`;
           const quantity = stockQuantities[colorSizeKey] || 10; // Mặc định 10 nếu chưa nhập
           stockByColorSize[colorSizeKey] = quantity;
           quantityBySize[size] += quantity; // Cộng dồn số lượng cho size
           imageByColor[color] = newProduct.imageDefault || ''; // Sử dụng imageDefault cho tất cả màu
         });
       });

      const productData = {
        ...newProduct,
        id: productId,
        price: String((newProduct.price || '').replace(/[^0-9]/g, '')),
        rating: 0, // Mặc định rating = 0
        colors: selectedColors,
        sizes: selectedSizes,
        tags: newProduct.tags || [],
        quantityBySize: quantityBySize,
        stockByColorSize: stockByColorSize,
        imageByColor: imageByColor,
        collections: newProduct.collections,
      };

      // Gọi API để thêm sản phẩm mới
      await mockApi.addProduct(productData);
      
      setAddModalVisible(false);
      setNewProduct({
        name: '',
        category: '',
        gender: '',
        type: '',
        price: '',
        description: '',
        imageDefault: '',
        imageByColor: {},
        colors: [],
        sizes: [],
        tags: [],
        brand: '',
        subtitle: '',
        rating: 0,
        quantityBySize: {},
        stockByColorSize: {},
        collections: [],
      });
      setSelectedColors([]);
      setSelectedSizes([]);
      setStockQuantities({});
      fetchProducts();
      Alert.alert('Success', 'Sản phẩm đã được thêm thành công');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  // Hàm xóa sản phẩm
  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa', style: 'destructive', onPress: async () => {
            try {
              await mockApi.deleteProduct(productId);
              fetchProducts();
              Alert.alert('Đã xóa sản phẩm thành công');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter và search sản phẩm trước khi render
  const filteredProducts = products
    .filter(p => String(p.name).toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      const priceA = Number(String(a.price).replace(/[^0-9]/g, ''));
      const priceB = Number(String(b.price).replace(/[^0-9]/g, ''));
      if (priceSort === 'asc') {
        return priceA - priceB;
      } else if (priceSort === 'desc') {
        return priceB - priceA;
      }
      return 0;
    });

  const renderProduct = ({ item }: any) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{displayPrice(item.price)}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditPress(item)}>
          <Icon name="edit" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteProduct(item.id)}>
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Icon name="add" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 10, marginBottom: 5 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8, marginBottom: 0 }]}
          placeholder="Tìm kiếm sản phẩm theo tên"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={{ padding: 8, backgroundColor: priceSort === 'asc' ? '#2196F3' : '#eee', borderRadius: 6, marginRight: 4 }}
          onPress={() => setPriceSort(priceSort === 'asc' ? 'none' : 'asc')}
        >
          <Text style={{ color: priceSort === 'asc' ? '#fff' : '#333', fontWeight: 'bold' }}>Giá ↑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 8, backgroundColor: priceSort === 'desc' ? '#2196F3' : '#eee', borderRadius: 6 }}
          onPress={() => setPriceSort(priceSort === 'desc' ? 'none' : 'desc')}
        >
          <Text style={{ color: priceSort === 'desc' ? '#fff' : '#333', fontWeight: 'bold' }}>Giá ↓</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '95%', backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Chỉnh sửa sản phẩm</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm *"
                value={editFields.name as string}
                onChangeText={(text) => handleEditFieldChange('name', text)}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Giá * (VD: 3,800,000)"
                  value={String(editFields.price ?? '')}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const formatted = formatPrice(text);
                    handleEditFieldChange('price', formatted);
                  }}
                />
                <Text style={{ marginLeft: 6, fontSize: 15, color: '#666' }}>VNĐ</Text>
              </View>
              {/* Dropdown cho Category */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Danh mục *</Text>
                <View style={styles.dropdownOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.dropdownOption,
                        editFields.category === category && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleEditFieldChange('category', category)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        editFields.category === category && styles.dropdownOptionTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Dropdown cho Gender */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Giới tính</Text>
                <View style={styles.dropdownOptions}>
                  {genders.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.dropdownOption,
                        editFields.gender === gender && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleEditFieldChange('gender', gender)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        editFields.gender === gender && styles.dropdownOptionTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Dropdown cho Type */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Loại</Text>
                <View style={styles.dropdownOptions}>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownOption,
                        editFields.type === type && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleEditFieldChange('type', type)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        editFields.type === type && styles.dropdownOptionTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Dropdown cho Brand */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Thương hiệu</Text>
                <View style={styles.dropdownOptions}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.dropdownOption,
                        editFields.brand === brand && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleEditFieldChange('brand', brand)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        editFields.brand === brand && styles.dropdownOptionTextSelected
                      ]}>
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Phụ đề"
                value={editFields.subtitle as string}
                onChangeText={(text) => handleEditFieldChange('subtitle', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Tên file hình ảnh chính"
                value={editFields.imageDefault as string}
                onChangeText={(text) => handleEditFieldChange('imageDefault', text)}
              />
              <TextInput
                style={[styles.input, { height: 80 }]} 
                placeholder="Mô tả sản phẩm"
                value={editFields.description as string}
                onChangeText={(text) => handleEditFieldChange('description', text)}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Tags (phân cách bằng dấu phẩy)"
                value={editFields.tags?.join(', ') || ''}
                onChangeText={(text) => handleEditFieldChange('tags', text.split(',').map((tag: string) => tag.trim()))}
              />
              {/* Chọn màu sắc */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Chọn màu sắc *</Text>
                <View style={styles.multipleOptions}>
                  {basicColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.multipleOption,
                        editSelectedColors.includes(color) && styles.multipleOptionSelected
                      ]}
                      onPress={() => handleEditColorToggle(color)}
                    >
                      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                      <Text style={[
                        styles.multipleOptionText,
                        editSelectedColors.includes(color) && styles.multipleOptionTextSelected
                      ]}>
                        {color}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Chọn kích thước */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Chọn kích thước *</Text>
                <View style={styles.multipleOptions}>
                  {getAvailableSizes(editFields.category).map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.multipleOption,
                        editSelectedSizes.includes(size) && styles.multipleOptionSelected
                      ]}
                      onPress={() => handleEditSizeToggle(size)}
                    >
                      <Text style={[
                        styles.multipleOptionText,
                        editSelectedSizes.includes(size) && styles.multipleOptionTextSelected
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Nhập số lượng cho từng màu-size */}
              {editSelectedColors.length > 0 && editSelectedSizes.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Số lượng cho từng màu và kích thước</Text>
                  <View style={styles.quantityGrid}>
                    {editSelectedColors.map((color) => (
                      <View key={color} style={styles.colorRow}>
                        <View style={styles.colorHeader}>
                          <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                          <Text style={styles.colorName}>{color}</Text>
                        </View>
                        <View style={styles.sizeInputs}>
                          {editSelectedSizes.map((size) => {
                            const colorSizeKey = `${color}-${size}`;
                            return (
                              <View key={size} style={styles.sizeInputContainer}>
                                <Text style={styles.sizeLabel}>{size}</Text>
                                <TextInput
                                  style={styles.quantityInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={String(editStockQuantities[colorSizeKey] || '')}
                                  onChangeText={(text) => handleEditQuantityChange(colorSizeKey, text)}
                                />
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {/* Chọn collections */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Collections</Text>
                <View style={styles.multipleOptions}>
                  {allCollections.map((col) => (
                    <TouchableOpacity
                      key={col}
                      style={[
                        styles.multipleOption,
                        (editFields.collections || []).includes(col) && styles.multipleOptionSelected
                      ]}
                      onPress={() => {
                        setEditFields((prev: any) => ({
                          ...prev,
                          collections: (prev.collections || []).includes(col)
                            ? (prev.collections || []).filter((c: string) => c !== col)
                            : [...(prev.collections || []), col]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.multipleOptionText,
                        (editFields.collections || []).includes(col) && styles.multipleOptionTextSelected
                      ]}>{col}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Input thêm collection mới */}
                <TextInput
                  style={styles.input}
                  placeholder="Thêm collection mới"
                  value={newCollectionInput}
                  onChangeText={setNewCollectionInput}
                  onSubmitEditing={() => {
                    if (newCollectionInput && !allCollections.includes(newCollectionInput)) {
                      setAllCollections([...allCollections, newCollectionInput]);
                    }
                    setEditFields((prev: any) => ({
                      ...prev,
                      collections: [...prev.collections, newCollectionInput]
                    }));
                    setNewCollectionInput('');
                  }}
                />
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#666' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} disabled={editLoading}>
                <View style={{ backgroundColor: '#2196F3', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5 }}>
                  {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Lưu</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal thêm sản phẩm mới */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '95%', backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Thêm sản phẩm mới</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm *"
                value={newProduct.name as string}
                onChangeText={(text) => handleNewProductChange('name', text)}
              />
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Giá * (VD: 3,800,000)"
                  value={String(newProduct.price ?? '')}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const formatted = formatPrice(text);
                    handleNewProductChange('price', formatted);
                  }}
                />
                <Text style={{ marginLeft: 6, fontSize: 15, color: '#666' }}>VNĐ</Text>
              </View>
              
              {/* Dropdown cho Category */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Danh mục *</Text>
                <View style={styles.dropdownOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.dropdownOption,
                        newProduct.category === category && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleNewProductChange('category', category)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        newProduct.category === category && styles.dropdownOptionTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Dropdown cho Gender */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Giới tính</Text>
                <View style={styles.dropdownOptions}>
                  {genders.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.dropdownOption,
                        newProduct.gender === gender && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleNewProductChange('gender', gender)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        newProduct.gender === gender && styles.dropdownOptionTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Dropdown cho Type */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Loại</Text>
                <View style={styles.dropdownOptions}>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownOption,
                        newProduct.type === type && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleNewProductChange('type', type)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        newProduct.type === type && styles.dropdownOptionTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Dropdown cho Brand */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Thương hiệu</Text>
                <View style={styles.dropdownOptions}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.dropdownOption,
                        newProduct.brand === brand && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleNewProductChange('brand', brand)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        newProduct.brand === brand && styles.dropdownOptionTextSelected
                      ]}>
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Phụ đề"
                value={newProduct.subtitle as string}
                onChangeText={(text) => handleNewProductChange('subtitle', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Tên file hình ảnh chính"
                value={newProduct.imageDefault as string}
                onChangeText={(text) => handleNewProductChange('imageDefault', text)}
              />
              
              <TextInput
                style={[styles.input, { height: 80 }]} 
                placeholder="Mô tả sản phẩm"
                value={newProduct.description as string}
                onChangeText={(text) => handleNewProductChange('description', text)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Tags (phân cách bằng dấu phẩy)"
                value={newProduct.tags?.join(', ') || ''}
                onChangeText={(text) => handleNewProductChange('tags', text.split(',').map(tag => tag.trim()))}
              />
              
              {/* Chọn màu sắc */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Chọn màu sắc *</Text>
                <View style={styles.multipleOptions}>
                  {basicColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.multipleOption,
                        selectedColors.includes(color) && styles.multipleOptionSelected
                      ]}
                      onPress={() => handleColorToggle(color)}
                    >
                      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                      <Text style={[
                        styles.multipleOptionText,
                        selectedColors.includes(color) && styles.multipleOptionTextSelected
                      ]}>
                        {color}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
                             {/* Chọn kích thước */}
               <View style={styles.dropdownContainer}>
                 <Text style={styles.dropdownLabel}>Chọn kích thước *</Text>
                 <View style={styles.multipleOptions}>
                   {getAvailableSizes(newProduct.category).map((size) => (
                     <TouchableOpacity
                       key={size}
                       style={[
                         styles.multipleOption,
                         selectedSizes.includes(size) && styles.multipleOptionSelected
                       ]}
                       onPress={() => handleSizeToggle(size)}
                     >
                       <Text style={[
                         styles.multipleOptionText,
                         selectedSizes.includes(size) && styles.multipleOptionTextSelected
                       ]}>
                         {size}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </View>
               </View>
              
              {/* Nhập số lượng cho từng màu-size */}
              {selectedColors.length > 0 && selectedSizes.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Số lượng cho từng màu và kích thước</Text>
                  <View style={styles.quantityGrid}>
                    {selectedColors.map((color) => (
                      <View key={color} style={styles.colorRow}>
                        <View style={styles.colorHeader}>
                          <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                          <Text style={styles.colorName}>{color}</Text>
                        </View>
                        <View style={styles.sizeInputs}>
                          {selectedSizes.map((size) => {
                            const colorSizeKey = `${color}-${size}`;
                            return (
                              <View key={size} style={styles.sizeInputContainer}>
                                <Text style={styles.sizeLabel}>{size}</Text>
                                <TextInput
                                  style={styles.quantityInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={String(stockQuantities[colorSizeKey] || '')}
                                  onChangeText={(text) => handleQuantityChange(colorSizeKey, text)}
                                />
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {/* Chọn collections */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Collections</Text>
                <View style={styles.multipleOptions}>
                  {allCollections.map((col) => (
                    <TouchableOpacity
                      key={col}
                      style={[
                        styles.multipleOption,
                        (newProduct.collections || []).includes(col) && styles.multipleOptionSelected
                      ]}
                      onPress={() => {
                        setNewProduct((prev: any) => ({
                          ...prev,
                          collections: (prev.collections || []).includes(col)
                            ? (prev.collections || []).filter((c: string) => c !== col)
                            : [...(prev.collections || []), col]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.multipleOptionText,
                        (newProduct.collections || []).includes(col) && styles.multipleOptionTextSelected
                      ]}>{col}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Input thêm collection mới */}
                <TextInput
                  style={styles.input}
                  placeholder="Thêm collection mới"
                  value={newCollectionInput}
                  onChangeText={setNewCollectionInput}
                  onSubmitEditing={() => {
                    if (newCollectionInput && !allCollections.includes(newCollectionInput)) {
                      setAllCollections([...allCollections, newCollectionInput]);
                    }
                    setNewProduct((prev: any) => ({
                      ...prev,
                      collections: [...prev.collections, newCollectionInput]
                    }));
                    setNewCollectionInput('');
                  }}
                />
              </View>
            </ScrollView>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#666' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNewProduct} disabled={addLoading}>
                <View style={{ backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5 }}>
                  {addLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Thêm</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  addButton: {
    padding: 5,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dropdownOptions: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionSelected: {
    backgroundColor: '#e0e0e0',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOptionTextSelected: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  multipleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  multipleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  multipleOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  multipleOptionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  multipleOptionTextSelected: {
    color: '#fff',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  colorName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  sizeInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeInputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  quantityGrid: {
    // Add styles for grid layout if needed
  },
});

export default ProductManagement; 
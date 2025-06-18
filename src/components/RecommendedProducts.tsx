import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ProductDetail: { product: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'shoes' | 'clothing' | 'pants';
  description: string;
};

type RecommendedProductsProps = {
  currentProductType: 'shoes' | 'clothing' | 'pants';
};

const RecommendedProducts = ({ currentProductType }: RecommendedProductsProps) => {
  const navigation = useNavigation<NavigationProp>();

  // Mock data - In real app, this would come from an API
  const allProducts: Product[] = [
    {
      id: '1',
      name: 'Ultraboost 22',
      price: 3200000,
      image: 'https://bizweb.dktcdn.net/100/413/756/products/giay-ultraboost-20-djen-fu8498-0-1730358676649.jpg?v=17309955845900a0a0a0a0a/ultraboost-22-shoes.jpg',
      type: 'shoes',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
    {
      id: '2',
      name: 'Stan Smith',
      price: 2800000,
      image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/4edaa6d5b65a40d19f20a7fa00ea641f_9366/Giay_Stan_Smith_trang_M20325_01_standard.jpg',
      type: 'shoes',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
    {
      id: '3',
      name: 'Terrex Free Hiker',
      price: 3500000,
      image: 'data:image/jpeg;base64,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',
      type: 'shoes',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
    {
      id: '4',
      name: 'Adidas T-Shirt',
      price: 1200000,
      image: 'data:image/jpeg;base64,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',
      type: 'clothing',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
    {
      id: '5',
      name: 'Adidas Hoodie',
      price: 1800000,
      image: 'https://product.hstatic.net/200000477321/product/ao_hoodie_designed_for_training_djen_iy1119_21_model_51f09781e40644e487481d0f0d77f974_grande.jpg',
      type: 'clothing',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
    {
      id: '6',
      name: 'Adidas Track Pants',
      price: 1500000,
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c87749bc2db8494c94a4c14aa3718d38_9366/Quan_Track_Pant_Firebird_Dang_Baggy_Adicolor_DJen_IZ4801_21_model.jpg',
      type: 'pants',
      description: 'Sản phẩm chất lượng cao với thiết kế hiện đại và tiện dụng.',
    },
  ];

  const recommendedProducts = allProducts.filter(
    (product) => product.type === currentProductType
  );

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        type: product.type
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm tương tự</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {recommendedProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleProductPress(product)}
          >
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              {product.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  scrollView: {
    flexDirection: 'row',
  },
  productCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecommendedProducts; 
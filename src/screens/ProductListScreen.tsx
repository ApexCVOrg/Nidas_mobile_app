import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigation/MainNavigator';

type ProductListScreenProps = {
  navigation: NativeStackNavigationProp<ProductStackParamList, 'ProductList'>;
};

const ProductListScreen = ({ navigation }: ProductListScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <FlatList<{ id: string }>
        data={[]}
        renderItem={() => null}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
});

export default ProductListScreen; 
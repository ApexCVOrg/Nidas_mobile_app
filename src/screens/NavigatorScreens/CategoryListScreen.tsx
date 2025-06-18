import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CategoryListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Nhận các category con từ params
  const { title, categories } = route.params as {
    title: string;
    categories: { id: string; name: string; image: any }[];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Image source={item.image} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={22} color="#666" style={styles.itemArrow} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  itemArrow: {
    marginLeft: 8,
  },
});

export default CategoryListScreen; 
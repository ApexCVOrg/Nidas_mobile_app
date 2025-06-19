import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = 220;

type Product = {
  id: string;
  name: string;
  description?: string;
  image: any; // require(...) hoặc uri
  cta?: string;
  screen?: string; // Cho phép truyền screen để điều hướng riêng
};

type Props = {
  data: Product[];
  onPressItem?: (item: Product) => void;
};

const HorizontalProductCarousel: React.FC<Props> = ({ data, onPressItem }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 16 }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    >
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.itemContainer}
          activeOpacity={0.85}
          onPress={() => onPressItem && onPressItem(item)}
        >
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.name}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            {item.cta && (
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaText}>{item.cta}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  desc: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default HorizontalProductCarousel; 
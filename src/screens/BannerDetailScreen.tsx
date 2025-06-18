import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import CustomTabBar from '../components/CustomTabBar';

type BannerDetailScreenRouteProp = RouteProp<TabNavigatorParamList, 'BannerDetail'>;

type Props = {
  route: BannerDetailScreenRouteProp;
};

const BannerDetailScreen = ({ route }: Props) => {
  const { item } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
      <CustomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16, color: '#444' },
});

export default BannerDetailScreen; 
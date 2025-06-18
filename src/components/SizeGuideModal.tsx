import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type SizeGuideModalProps = {
  visible: boolean;
  onClose: () => void;
  productType: 'shoes' | 'clothing' | 'pants';
};

const SizeGuideModal = ({ visible, onClose, productType }: SizeGuideModalProps) => {
  const shoesSizeGuide = [
    {
      size: '38',
      eu: '38',
      us: '5.5',
      uk: '4',
      cm: '24',
    },
    {
      size: '39',
      eu: '39',
      us: '6.5',
      uk: '5',
      cm: '25',
    },
    {
      size: '40',
      eu: '40',
      us: '7.5',
      uk: '6',
      cm: '26',
    },
    {
      size: '41',
      eu: '41',
      us: '8.5',
      uk: '7',
      cm: '27',
    },
    {
      size: '42',
      eu: '42',
      us: '9.5',
      uk: '8',
      cm: '28',
    },
    {
      size: '43',
      eu: '43',
      us: '10.5',
      uk: '9',
      cm: '29',
    },
    {
      size: '44',
      eu: '44',
      us: '11.5',
      uk: '10',
      cm: '30',
    },
  ];

  const clothingSizeGuide = [
    {
      size: 'S',
      chest: '86-91 cm',
      waist: '71-76 cm',
      hip: '86-91 cm',
    },
    {
      size: 'M',
      chest: '91-96 cm',
      waist: '76-81 cm',
      hip: '91-96 cm',
    },
    {
      size: 'L',
      chest: '96-101 cm',
      waist: '81-86 cm',
      hip: '96-101 cm',
    },
    {
      size: 'XL',
      chest: '101-106 cm',
      waist: '86-91 cm',
      hip: '101-106 cm',
    },
    {
      size: 'XXL',
      chest: '106-111 cm',
      waist: '91-96 cm',
      hip: '106-111 cm',
    },
  ];

  const pantsSizeGuide = [
    {
      size: '28',
      waist: '71 cm',
      hip: '86 cm',
      inseam: '76 cm',
    },
    {
      size: '30',
      waist: '76 cm',
      hip: '91 cm',
      inseam: '76 cm',
    },
    {
      size: '32',
      waist: '81 cm',
      hip: '96 cm',
      inseam: '76 cm',
    },
    {
      size: '34',
      waist: '86 cm',
      hip: '101 cm',
      inseam: '76 cm',
    },
    {
      size: '36',
      waist: '91 cm',
      hip: '106 cm',
      inseam: '76 cm',
    },
  ];

  const getSizeGuideData = () => {
    switch (productType) {
      case 'shoes':
        return shoesSizeGuide;
      case 'clothing':
        return clothingSizeGuide;
      case 'pants':
        return pantsSizeGuide;
      default:
        return clothingSizeGuide;
    }
  };

  const getMeasurementInstructions = () => {
    switch (productType) {
      case 'shoes':
        return [
          'Đo chiều dài bàn chân từ gót đến ngón chân dài nhất',
          'Đo chiều rộng bàn chân tại điểm rộng nhất',
          'Nên đo vào cuối ngày khi bàn chân đã nở ra',
        ];
      case 'clothing':
        return [
          'Ngực: Đo vòng ngực tại điểm rộng nhất',
          'Eo: Đo vòng eo tại điểm nhỏ nhất',
          'Hông: Đo vòng hông tại điểm rộng nhất',
        ];
      case 'pants':
        return [
          'Eo: Đo vòng eo tại điểm nhỏ nhất',
          'Hông: Đo vòng hông tại điểm rộng nhất',
          'Độ dài: Đo từ eo đến mắt cá chân',
        ];
      default:
        return [];
    }
  };

  const getTips = () => {
    switch (productType) {
      case 'shoes':
        return [
          'Nên thử giày vào cuối ngày khi bàn chân đã nở ra',
          'Để lại khoảng 1cm ở mũi giày để thoải mái khi di chuyển',
          'Nếu bàn chân rộng, hãy chọn size lớn hơn',
        ];
      case 'clothing':
        return [
          'Nên đo khi mặc đồ lót để có kết quả chính xác nhất',
          'Nếu số đo của bạn nằm giữa hai size, hãy chọn size lớn hơn',
          'Sản phẩm có thể co giãn nhẹ sau vài lần giặt',
        ];
      case 'pants':
        return [
          'Nên đo khi mặc quần lót để có kết quả chính xác nhất',
          'Để ý đến độ dài của quần so với chiều cao của bạn',
          'Nếu số đo của bạn nằm giữa hai size, hãy chọn size lớn hơn',
        ];
      default:
        return [];
    }
  };

  const renderSizeTable = () => {
    const data = getSizeGuideData();
    
    if (productType === 'shoes') {
      return (
        <View style={styles.sizeChartSection}>
          <Text style={styles.sectionTitle}>Bảng size giày</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Size VN</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>EU</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>US</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>UK</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>CM</Text>
          </View>
          {data.map((item) => {
            if ('eu' in item) {
              return (
                <View key={item.size} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.sizeCell]}>{item.size}</Text>
                  <Text style={styles.tableCell}>{item.eu}</Text>
                  <Text style={styles.tableCell}>{item.us}</Text>
                  <Text style={styles.tableCell}>{item.uk}</Text>
                  <Text style={styles.tableCell}>{item.cm}</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      );
    }

    if (productType === 'pants') {
      return (
        <View style={styles.sizeChartSection}>
          <Text style={styles.sectionTitle}>Bảng size quần</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Size</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Eo</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Hông</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Độ dài</Text>
          </View>
          {data.map((item) => {
            if ('inseam' in item) {
              return (
                <View key={item.size} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.sizeCell]}>{item.size}</Text>
                  <Text style={styles.tableCell}>{item.waist}</Text>
                  <Text style={styles.tableCell}>{item.hip}</Text>
                  <Text style={styles.tableCell}>{item.inseam}</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      );
    }

    return (
      <View style={styles.sizeChartSection}>
        <Text style={styles.sectionTitle}>Bảng size áo</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.headerCell]}>Size</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>Ngực</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>Eo</Text>
          <Text style={[styles.tableCell, styles.headerCell]}>Hông</Text>
        </View>
        {data.map((item) => {
          if ('chest' in item) {
            return (
              <View key={item.size} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.sizeCell]}>{item.size}</Text>
                <Text style={styles.tableCell}>{item.chest}</Text>
                <Text style={styles.tableCell}>{item.waist}</Text>
                <Text style={styles.tableCell}>{item.hip}</Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Hướng dẫn chọn size</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.instructionSection}>
              <Text style={styles.sectionTitle}>Cách đo size</Text>
              {getMeasurementInstructions().map((instruction, index) => (
                <View key={index} style={styles.measurementItem}>
                  <Icon name="straighten" size={20} color="#000" />
                  <Text style={styles.measurementText}>{instruction}</Text>
                </View>
              ))}
            </View>

            {renderSizeTable()}

            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Lưu ý</Text>
              {getTips().map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Icon name="info" size={20} color="#000" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  instructionSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  measurementText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sizeChartSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 12,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#000',
  },
  sizeCell: {
    fontWeight: 'bold',
  },
  tipsSection: {
    padding: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default SizeGuideModal; 
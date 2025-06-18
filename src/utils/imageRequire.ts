const imageMap: { [key: string]: any } = {
  'NikeBanner.jpg': require('../../assets/homePage/NikeBanner.jpg'),
  'NikeBanner2.jpg': require('../../assets/homePage/NikeBanner2.jpg'),
  'NikeBanner3.jpg': require('../../assets/homePage/NikeBanner3.jpg'),
  'Giay_Ultraboost_22.jpg': require('../../assets/Giay_Ultraboost_22.jpg'),
  'Ao_Thun_Polo_Ba_La.jpg': require('../../assets/Ao_Thun_Polo_Ba_La.jpg'),
  'Quan_Hiking_Terrex.jpg': require('../../assets/Quan_Hiking_Terrex.jpg'),
  'Giay_Stan_Smith_x_Liberty_London.jpg': require('../../assets/Giay_Stan_Smith_x_Liberty_London.jpg'),
  'banner.jpg': require('../../assets/banner.jpg'),
  'sport.jpg': require('../../assets/sport.jpg'),
  // ... thêm các ảnh khác nếu có
};

export function getImageRequire(filename: string) {
  return imageMap[filename];
} 
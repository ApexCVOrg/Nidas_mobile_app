const ultraboostImageMap: { [key: string]: any } = {
  "assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5_Den_ID8812_HM1.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5_Den_ID8812_HM1.png"),
  "assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5_Xam_IF1481_HM1.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5_Xam_IF1481_HM1.png"),
  "assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5x_Den_IH3110_HM1.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5x_Den_IH3110_HM1.png"),
  "assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5x_trang_IH3111_HM1.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Ultraboost_5x_trang_IH3111_HM1.png"),
  "assets/SearchPage/Collection/Ultraboost/Giay_Chay_Bo_Pureboost_5_Den_ID1158_HM1.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Chay_Bo_Pureboost_5_Den_ID1158_HM1.png"),
  "assets/SearchPage/Collection/Ultraboost/Giay_Chay_Bo_Pureboost_5_trang_IF9192_01_standard.png": require("../../assets/SearchPage/Collection/Ultraboost/Giay_Chay_Bo_Pureboost_5_trang_IF9192_01_standard.png"),
};

export function getUltraboostImage(path: string) {
  return ultraboostImageMap[path] || require("../../assets/icon.png");
} 
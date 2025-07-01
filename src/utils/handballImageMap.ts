const handballImageMap: { [key: string]: any } = {
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_xanh_da_troi_IG6194_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_xanh_da_troi_IG6194_01_standard.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_mau_xanh_la_IG6192_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_mau_xanh_la_IG6192_01_standard.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_Cam_IG6191_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_Cam_IG6191_01_standard.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_vang_IF7088_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_vang_IF7088_01_standard.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_xanh_da_troi__denIF7087_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_xanh_da_troi__denIF7087_01_standard.jpg"),
  "assets/SearchPage/Collection/Handball/Handball_Spezial_Mau_xanh_da_troi_JS3866_01_00_standard_Nam.jpg": require("../../assets/SearchPage/Collection/Handball/Handball_Spezial_Mau_xanh_da_troi_JS3866_01_00_standard_Nam.jpg"),
  "assets/SearchPage/Collection/Handball/Handball_Spezial_trang_xanh_JS3865_01_00_standard_Nam.jpg": require("../../assets/SearchPage/Collection/Handball/Handball_Spezial_trang_xanh_JS3865_01_00_standard_Nam.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_Maroon_JP8726_01_00_standard_Nu.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Mau_Maroon_JP8726_01_00_standard_Nu.jpg"),
  "assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Xam_IF7086_01_standard.jpg": require("../../assets/SearchPage/Collection/Handball/Giay_Handball_Spezial_Xam_IF7086_01_standard.jpg"),
};

export function getHandballImage(path: string) {
  return handballImageMap[path] || require("../../assets/icon.png");
} 
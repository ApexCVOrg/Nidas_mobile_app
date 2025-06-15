const imageMap: { [key: string]: any } = {
  "aoadidasden.png": require("../../assets/aoadidasden.png"),
  "aoadidastrang.png": require("../../assets/aoadidastrang.png"),
  "aoadidasxanh.png": require("../../assets/aoadidasxanh.png"),
  // Thêm các ảnh khác nếu có
};

export function getImageRequire(fileName: string) {
  return imageMap[fileName] || null;
} 
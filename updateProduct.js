// updateProduct.js
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'mock-api/db.json');

if (process.argv.length < 5) {
  console.log('Cách dùng: node updateProduct.js <productId> <field> <newValue>');
  process.exit(1);
}

const productId = process.argv[2];
const field = process.argv[3];
const newValue = process.argv[4];

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const productIndex = db.products.findIndex(p => p.id === productId);
if (productIndex !== -1) {
  db.products[productIndex][field] = newValue;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Đã cập nhật sản phẩm ${productId}: ${field} = ${newValue}`);
} else {
  console.log('Không tìm thấy sản phẩm!');
} 
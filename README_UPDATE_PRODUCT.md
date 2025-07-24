# Hướng dẫn cập nhật sản phẩm trong mock-api/db.json

## 1. Sử dụng script Node.js

### a. Chạy script cập nhật sản phẩm

```bash
node updateProduct.js <productId> <field> <newValue>
```

**Ví dụ:**
```bash
node updateProduct.js p1 price "600.000 VNĐ"
```

Script sẽ cập nhật trường `price` của sản phẩm có id `p1` thành `600.000 VNĐ` trong file `mock-api/db.json`.

---

## 2. Sử dụng json-server để CRUD và tự động ghi file

### a. Cài đặt json-server
```bash
npm install -g json-server
```

### b. Chạy json-server với file db.json
```bash
json-server --watch mock-api/db.json --port 3000
```

### c. Gọi API để cập nhật sản phẩm

**Ví dụ dùng curl:**
```bash
curl -X PATCH http://localhost:3000/products/p1 -H "Content-Type: application/json" -d '{"price":"600.000 VNĐ"}'
```

**Hoặc dùng axios/fetch trong app:**
```js
await axios.patch('http://localhost:3000/products/p1', { price: '600.000 VNĐ' });
```

Sau khi gọi API, file `mock-api/db.json` sẽ được cập nhật tự động. 